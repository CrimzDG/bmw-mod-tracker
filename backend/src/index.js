require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Auth routes
app.use('/api/auth', require('./routes/auth'))

// Car routes
app.use('/api/cars', require('./routes/cars'))

// Mod routes — must include :carId in the path
app.use('/api/cars/:carId/mods', require('./routes/mods'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
