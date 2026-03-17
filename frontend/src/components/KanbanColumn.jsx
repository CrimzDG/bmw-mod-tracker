import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ModCard from './ModCard'
import './KanbanColumn.css'

const COLUMN_META = {
  WISHLIST:    { label: 'Wishlist',     color: '#555' },
  PLANNED:     { label: 'Planned',      color: '#1c6eff' },
  IN_PROGRESS: { label: 'In Progress',  color: '#f59e0b' },
  DONE:        { label: 'Done',         color: '#22c55e' },
}

export default function KanbanColumn({ status, mods, onAddMod, onEditMod, onDeleteMod }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const meta = COLUMN_META[status]

  return (
    <div className={`kanban-col ${isOver ? 'kanban-col--over' : ''}`}>
      <div className="kanban-col-header">
        <div className="kanban-col-title">
          <span className="kanban-col-dot" style={{ background: meta.color }} />
          <span>{meta.label}</span>
        </div>
        <span className="kanban-col-count">{mods.length}</span>
      </div>

      <div ref={setNodeRef} className="kanban-col-body">
        <SortableContext items={mods.map(m => m.id)} strategy={verticalListSortingStrategy}>
          {mods.map(mod => (
            <ModCard
              key={mod.id}
              mod={mod}
              onClick={() => onEditMod(mod)}
              onDelete={onDeleteMod}
            />
          ))}
        </SortableContext>

        {mods.length === 0 && (
          <div className="kanban-col-empty">Drop mods here</div>
        )}
      </div>

      <button className="kanban-col-add" onClick={() => onAddMod(status)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Add mod
      </button>
    </div>
  )
}
