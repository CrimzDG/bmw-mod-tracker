import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { carService, modService } from '../services'
import Navbar from '../components/Navbar'
import KanbanColumn from '../components/KanbanColumn'
import ModCard from '../components/ModCard'
import ModModal from '../components/ModModal'
import './BoardPage.css'

const STATUSES = ['WISHLIST', 'PLANNED', 'IN_PROGRESS', 'DONE']

function SpendTracker({ mods }) {
  const modsWithCost = mods.filter(m => m.estimatedCost != null || m.actualCost != null)
  if (modsWithCost.length === 0) return null

  const totalEstimated = mods.reduce((sum, m) => sum + (m.estimatedCost || 0), 0)
  const totalSpent = mods
    .filter(m => m.status === 'DONE')
    .reduce((sum, m) => sum + (m.actualCost || m.estimatedCost || 0), 0)
  const remaining = Math.max(0, totalEstimated - totalSpent)
  const pct = totalEstimated > 0 ? Math.min(100, (totalSpent / totalEstimated) * 100) : 0

  const fmt = (n) => `€${n.toLocaleString('en-IE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return (
    <div className="spend-tracker">
      <div className="spend-tracker-inner">
        <div className="spend-tracker-label">Build Budget</div>

        <div className="spend-tracker-row">
          <span className="spend-tracker-key">Total budget</span>
          <span className="spend-tracker-val">{fmt(totalEstimated)}</span>
        </div>

        <div className="spend-tracker-divider" />

        <div className="spend-tracker-row">
          <span className="spend-tracker-key">Remaining</span>
          <span className="spend-tracker-val spend-tracker-val--remaining">{fmt(remaining)}</span>
        </div>

        <div className="spend-tracker-row">
          <span className="spend-tracker-key">Spent</span>
          <span className="spend-tracker-val spend-tracker-val--spent">{fmt(totalSpent)}</span>
        </div>

        <div className="spend-tracker-bar-wrap">
          <div className="spend-tracker-bar" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function BoardPage() {
  const { carId } = useParams()
  const [car, setCar] = useState(null)
  const [mods, setMods] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editMod, setEditMod] = useState(null)
  const [defaultStatus, setDefaultStatus] = useState('WISHLIST')

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  }))

  useEffect(() => { fetchData() }, [carId])

  async function fetchData() {
    try {
      const [carData, modsData] = await Promise.all([
        carService.getOne(carId),
        modService.getAll(carId),
      ])
      setCar(carData)
      setMods(modsData)
    } finally {
      setLoading(false)
    }
  }

  function modsByStatus(status) { return mods.filter(m => m.status === status) }
  function findModById(id) { return mods.find(m => m.id === id) }
  function findStatusOfMod(id) { return mods.find(m => m.id === id)?.status }
  function handleDragStart({ active }) { setActiveId(active.id) }

  async function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over) return
    const mod = findModById(active.id)
    if (!mod) return
    const targetStatus = STATUSES.includes(over.id) ? over.id : findStatusOfMod(over.id)
    if (!targetStatus || mod.status === targetStatus) return
    setMods(ms => ms.map(m => m.id === mod.id ? { ...m, status: targetStatus } : m))
    try {
      await modService.updateStatus(carId, mod.id, targetStatus)
    } catch {
      setMods(ms => ms.map(m => m.id === mod.id ? { ...m, status: mod.status } : m))
    }
  }

  async function handleSaveMod(form) {
    if (editMod) {
      const updated = await modService.update(carId, editMod.id, form)
      setMods(ms => ms.map(m => m.id === updated.id ? updated : m))
    } else {
      const created = await modService.create(carId, form)
      setMods(ms => [...ms, created])
    }
  }

  async function handleDeleteMod(mod) {
    if (!confirm(`Delete "${mod.title}"?`)) return
    await modService.delete(carId, mod.id)
    setMods(ms => ms.filter(m => m.id !== mod.id))
  }

  function openAdd(status) { setEditMod(null); setDefaultStatus(status); setShowModal(true) }
  function openEdit(mod) { setEditMod(mod); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditMod(null) }

  const activeMod = activeId ? findModById(activeId) : null

  if (loading) {
    return (
      <div className="board-layout">
        <Navbar backTo="/garage" />
        <div className="board-loading"><span className="spinner" /></div>
      </div>
    )
  }

  return (
    <div className="board-layout">
      <Navbar backTo="/garage" title={car?.name} />

      <main className="board-main">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="board-columns">
            {STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                mods={modsByStatus(status)}
                onAddMod={openAdd}
                onEditMod={openEdit}
                onDeleteMod={handleDeleteMod}
              />
            ))}
          </div>

          <DragOverlay>
            {activeMod && (
              <ModCard mod={activeMod} onClick={() => {}} onDelete={() => {}} />
            )}
          </DragOverlay>
        </DndContext>

        <SpendTracker mods={mods} />
      </main>

      {showModal && (
        <ModModal
          mod={editMod}
          defaultStatus={defaultStatus}
          onClose={closeModal}
          onSave={handleSaveMod}
        />
      )}
    </div>
  )
}
