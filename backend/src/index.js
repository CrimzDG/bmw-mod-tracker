require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter')

const app = express()

// Trust proxy — needed for Render/Railway to get real client IPs
// Without this, rate limiting would apply to the proxy IP and limit everyone
app.set('trust proxy', 1)

app.use(cors())
app.use(express.json())

// ── Tier 1: global rate limit on all routes ──
app.use(globalLimiter)

// ── Tier 2: stricter limit on all auth routes ──
app.use('/api/auth', authLimiter)

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/cars', require('./routes/cars'))
app.use('/api/cars/:carId/mods', require('./routes/mods'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
