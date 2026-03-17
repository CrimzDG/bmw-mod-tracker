import { useState, useEffect } from 'react'

export default function CarModal({ car, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', model: '', year: '', color: '', notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (car) {
      setForm({
        name: car.name || '',
        model: car.model || '',
        year: car.year || '',
        color: car.color || '',
        notes: car.notes || '',
      })
    }
  }, [car])

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSave({
        ...form,
        year: form.year ? parseInt(form.year) : null,
      })
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{car ? 'Edit car' : 'Add car'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ background: 'rgba(224,60,60,0.1)', border: '1px solid rgba(224,60,60,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Name *</label>
            <input placeholder="e.g. E30 M3" value={form.name} onChange={set('name')} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Model</label>
              <input placeholder="e.g. E30" value={form.model} onChange={set('model')} />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input type="number" placeholder="1989" value={form.year} onChange={set('year')} min="1916" max="2099" />
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <input placeholder="e.g. Alpineweiss" value={form.color} onChange={set('color')} />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              placeholder="Any notes about the car..."
              value={form.notes}
              onChange={set('notes')}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : car ? 'Save changes' : 'Add car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
