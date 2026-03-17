import './CarCard.css'

export default function CarCard({ car, onClick, onDelete }) {
  return (
    <div className="car-card" onClick={onClick}>
      <div className="car-card-header">
        <div className="car-card-icon">🚗</div>
        <button
          className="car-card-delete"
          onClick={e => { e.stopPropagation(); onDelete(car) }}
          title="Delete car"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="car-card-body">
        <h2 className="car-card-name">{car.name}</h2>
        {(car.model || car.year) && (
          <p className="car-card-meta">
            {[car.year, car.model].filter(Boolean).join(' · ')}
          </p>
        )}
        {car.color && (
          <p className="car-card-meta">{car.color}</p>
        )}
      </div>

      <div className="car-card-footer">
        <span className="car-card-mods">{car.modCount} mod{car.modCount !== 1 ? 's' : ''}</span>
        <span className="car-card-cta">Open board →</span>
      </div>
    </div>
  )
}
