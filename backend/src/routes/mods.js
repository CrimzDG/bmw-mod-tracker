const router = require('express').Router({ mergeParams: true })
const auth = require('../middleware/auth')
const supabase = require('../supabase')

router.use(auth)

// Verify the car belongs to the user
async function verifyCar(carId, userId) {
  const { data } = await supabase
    .from('cars')
    .select('id')
    .eq('id', carId)
    .eq('owner_id', userId)
    .single()
  return !!data
}

// GET /api/cars/:carId/mods
router.get('/', async (req, res) => {
  const owned = await verifyCar(req.params.carId, req.userId)
  if (!owned) return res.status(404).json({ error: 'Car not found' })

  const { data, error } = await supabase
    .from('mods')
    .select('*')
    .eq('car_id', req.params.carId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    status: m.status,
    estimatedCost: m.estimated_cost,
    actualCost: m.actual_cost,
    vendor: m.vendor,
    sortOrder: m.sort_order,
    carId: m.car_id,
    createdAt: m.created_at,
    updatedAt: m.updated_at
  })))
})

// POST /api/cars/:carId/mods
router.post('/', async (req, res) => {
  const owned = await verifyCar(req.params.carId, req.userId)
  if (!owned) return res.status(404).json({ error: 'Car not found' })

  const { title, description, status, estimatedCost, actualCost, vendor } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })

  const { data, error } = await supabase
    .from('mods')
    .insert({
      title,
      description,
      status: status || 'WISHLIST',
      estimated_cost: estimatedCost,
      actual_cost: actualCost,
      vendor,
      car_id: req.params.carId
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json({
    id: data.id, title: data.title, description: data.description,
    status: data.status, estimatedCost: data.estimated_cost,
    actualCost: data.actual_cost, vendor: data.vendor,
    sortOrder: data.sort_order, carId: data.car_id,
    createdAt: data.created_at, updatedAt: data.updated_at
  })
})

// PUT /api/cars/:carId/mods/:modId
router.put('/:modId', async (req, res) => {
  const owned = await verifyCar(req.params.carId, req.userId)
  if (!owned) return res.status(404).json({ error: 'Car not found' })

  const { title, description, status, estimatedCost, actualCost, vendor } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })

  const { data, error } = await supabase
    .from('mods')
    .update({
      title, description, status,
      estimated_cost: estimatedCost,
      actual_cost: actualCost,
      vendor,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.params.modId)
    .eq('car_id', req.params.carId)
    .select()
    .single()

  if (error || !data) return res.status(404).json({ error: 'Mod not found' })

  res.json({
    id: data.id, title: data.title, description: data.description,
    status: data.status, estimatedCost: data.estimated_cost,
    actualCost: data.actual_cost, vendor: data.vendor,
    sortOrder: data.sort_order, carId: data.car_id,
    createdAt: data.created_at, updatedAt: data.updated_at
  })
})

// PATCH /api/cars/:carId/mods/:modId/status
router.patch('/:modId/status', async (req, res) => {
  const owned = await verifyCar(req.params.carId, req.userId)
  if (!owned) return res.status(404).json({ error: 'Car not found' })

  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'Status is required' })

  const { data, error } = await supabase
    .from('mods')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', req.params.modId)
    .eq('car_id', req.params.carId)
    .select()
    .single()

  if (error || !data) return res.status(404).json({ error: 'Mod not found' })

  res.json({
    id: data.id, title: data.title, description: data.description,
    status: data.status, estimatedCost: data.estimated_cost,
    actualCost: data.actual_cost, vendor: data.vendor,
    sortOrder: data.sort_order, carId: data.car_id,
    createdAt: data.created_at, updatedAt: data.updated_at
  })
})

// DELETE /api/cars/:carId/mods/:modId
router.delete('/:modId', async (req, res) => {
  const owned = await verifyCar(req.params.carId, req.userId)
  if (!owned) return res.status(404).json({ error: 'Car not found' })

  const { error } = await supabase
    .from('mods')
    .delete()
    .eq('id', req.params.modId)
    .eq('car_id', req.params.carId)

  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

module.exports = router
