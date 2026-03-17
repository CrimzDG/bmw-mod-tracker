import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { carService } from '../services'
import Navbar from '../components/Navbar'
import CarCard from '../components/CarCard'
import CarModal from '../components/CarModal'
import './GaragePage.css'

export default function GaragePage() {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCar, setEditCar] = useState(null)

  useEffect(() => { fetchCars() }, [])

  async function fetchCars() {
    try {
      const data = await carService.getAll()
      setCars(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(form) {
    if (editCar) {
      const updated = await carService.update(editCar.id, form)
      setCars(cs => cs.map(c => c.id === updated.id ? updated : c))
    } else {
      const created = await carService.create(form)
      setCars(cs => [created, ...cs])
    }
  }

  async function handleDelete(car) {
    if (!confirm(`Delete "${car.name}"? This will remove all its mods too.`)) return
    await carService.delete(car.id)
    setCars(cs => cs.filter(c => c.id !== car.id))
  }

  function openAdd() { setEditCar(null); setShowModal(true) }
  function openEdit(car) { setEditCar(car); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditCar(null) }

  return (
    <div className="garage-layout">
      <Navbar />

      <main className="garage-main">
        <div className="garage-top">
          <div>
            <h1 className="garage-heading">My Garage</h1>
            <p className="garage-sub">Select a car to open its mod board</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add car
          </button>
        </div>

        {loading ? (
          <div className="garage-loading"><span className="spinner" /></div>
        ) : cars.length === 0 ? (
          <div className="garage-empty">
            <span style={{ fontSize: 48 }}>🚗</span>
            <p>No cars yet — add your first one</p>
            <button className="btn btn-primary" onClick={openAdd}>Add car</button>
          </div>
        ) : (
          <div className="garage-grid">
            {cars.map(car => (
              <CarCard
                key={car.id}
                car={car}
                onClick={() => navigate(`/garage/${car.id}/board`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <CarModal car={editCar} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  )
}
