import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './ModCard.css'

export default function ModCard({ mod, onClick, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: mod.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const costDisplay = mod.actualCost != null
    ? `€${mod.actualCost.toFixed(2)}`
    : mod.estimatedCost != null
    ? `~€${mod.estimatedCost.toFixed(2)}`
    : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mod-card"
      {...attributes}
      {...listeners}
    >
      <div className="mod-card-inner" onClick={onClick}>
        <div className="mod-card-top">
          <span className="mod-card-title">{mod.title}</span>
          <button
            className="mod-card-delete"
            onClick={e => { e.stopPropagation(); onDelete(mod) }}
            title="Delete mod"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {mod.description && (
          <p className="mod-card-desc">{mod.description}</p>
        )}

        <div className="mod-card-footer">
          {mod.vendor && <span className="mod-card-vendor">{mod.vendor}</span>}
          {costDisplay && <span className="mod-card-cost">{costDisplay}</span>}
        </div>
      </div>
    </div>
  )
}
