const router = require('express').Router()
const auth = require('../middleware/auth')
const supabase = require('../supabase')

// All routes require auth
router.use(auth)

// GET /api/cars
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('cars')
    .select('*, mods(count)')
    .eq('owner_id', req.userId)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  const cars = data.map(c => ({
    id: c.id,
    name: c.name,
    model: c.model,
    year: c.year,
    color: c.color,
    notes: c.notes,
    createdAt: c.created_at,
    modCount: c.mods[0]?.count || 0
  }))

  res.json(cars)
})

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('cars')
    .select('*, mods(count)')
    .eq('id', req.params.id)
    .eq('owner_id', req.userId)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Car not found' })

  res.json({
    id: data.id,
    name: data.name,
    model: data.model,
    year: data.year,
    color: data.color,
    notes: data.notes,
    createdAt: data.created_at,
    modCount: data.mods[0]?.count || 0
  })
})

// POST /api/cars
router.post('/', async (req, res) => {
  const { name, model, year, color, notes } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })

  const { data, error } = await supabase
    .from('cars')
    .insert({ name, model, year, color, notes, owner_id: req.userId })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json({ ...data, createdAt: data.created_at, modCount: 0 })
})

// PUT /api/cars/:id
router.put('/:id', async (req, res) => {
  const { name, model, year, color, notes } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })

  const { data, error } = await supabase
    .from('cars')
    .update({ name, model, year, color, notes })
    .eq('id', req.params.id)
    .eq('owner_id', req.userId)
    .select()
    .single()

  if (error || !data) return res.status(404).json({ error: 'Car not found' })

  res.json({ ...data, createdAt: data.created_at })
})

// DELETE /api/cars/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', req.params.id)
    .eq('owner_id', req.userId)

  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

module.exports = router
