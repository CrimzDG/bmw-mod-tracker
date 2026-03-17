import './CarCard.css'

// BMW colour swatches
const BMW_COLORS = {
  'Alpine White': '#F5F5F0',
  'Black Sapphire': '#1a1a2e',
  'Mineral White': '#E8E8E4',
  'Glacier Silver': '#C0C0BC',
  'Space Grey': '#6B7280',
  'Melbourne Red': '#9B1C1C',
  'Portimao Blue': '#1E3A5F',
  'Tanzanite Blue': '#2C4A7C',
  'Skyscraper Grey': '#8B8B8B',
  'Dravit Grey': '#5C5C5C',
  'Frozen Dark Silver': '#A8A8A4',
  'San Marino Blue': '#3B5998',
  'Sunset Orange': '#CC5500',
  'Snapper Rocks Blue': '#4A90D9',
  'Aventurin Red': '#8B0000',
  'Phytonic Blue': '#2D5A8E',
}

function getColorSwatch(colorName) {
  if (!colorName) return null
  const match = Object.entries(BMW_COLORS).find(([name]) =>
    colorName.toLowerCase().includes(name.toLowerCase())
  )
  return match ? match[1] : null
}

function isLightColor(hex) {
  if (!hex) return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

// BMW Roundel SVG
function BMWRoundel({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="23" fill="#1C1C1C" stroke="#444" strokeWidth="1"/>
      <circle cx="24" cy="24" r="19" fill="none" stroke="#444" strokeWidth="1"/>
      {/* BMW quarters */}
      <path d="M24 5 A19 19 0 0 1 43 24 L24 24 Z" fill="#fff"/>
      <path d="M24 24 L43 24 A19 19 0 0 1 24 43 Z" fill="#1C6EFF"/>
      <path d="M24 43 A19 19 0 0 1 5 24 L24 24 Z" fill="#fff"/>
      <path d="M5 24 A19 19 0 0 1 24 5 L24 24 Z" fill="#1C6EFF"/>
      {/* Outer ring */}
      <circle cx="24" cy="24" r="19" fill="none" stroke="#888" strokeWidth="1.5"/>
      <circle cx="24" cy="24" r="23" fill="none" stroke="#555" strokeWidth="1"/>
    </svg>
  )
}

export default function CarCard({ car, onClick, onDelete }) {
  const swatchColor = getColorSwatch(car.color || '')
  const lightSwatch = isLightColor(swatchColor)

  return (
    <div className="car-card" onClick={onClick}>
      {/* Color accent bar */}
      {swatchColor && (
        <div className="car-card-color-bar" style={{ background: swatchColor }} />
      )}

      <div className="car-card-header">
        <BMWRoundel size={52} />
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
          <div className="car-card-color">
            {swatchColor && (
              <span
                className="car-card-color-dot"
                style={{ background: swatchColor, border: lightSwatch ? '1px solid #555' : 'none' }}
              />
            )}
            <span className="car-card-meta">{car.color}</span>
          </div>
        )}
      </div>

      <div className="car-card-footer">
        <span className="car-card-mods-badge">
          {car.modCount} {car.modCount === 1 ? 'mod' : 'mods'}
        </span>
        <span className="car-card-cta">
          Open board
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 4 }}>
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  )
}
