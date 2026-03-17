const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../supabase')
const { registerLimiter } = require('../middleware/rateLimiter')

// POST /api/auth/register
// registerLimiter applied here — 5 per hour per IP on top of the global auth limit
router.post('/register', registerLimiter, async (req, res) => {
  const { email, password, username } = req.body
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password and username are required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return res.status(400).json({ error: 'Email already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data: user, error } = await supabase
    .from('users')
    .insert({ email, password: hashedPassword, username })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
  res.json({ token, userId: user.id, email: user.email, username: user.username })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
  res.json({ token, userId: user.id, email: user.email, username: user.username })
})

module.exports = router
