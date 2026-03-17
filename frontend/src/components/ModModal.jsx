import { useState, useEffect } from 'react'

const STATUSES = ['WISHLIST', 'PLANNED', 'IN_PROGRESS', 'DONE']
const STATUS_LABELS = {
  WISHLIST: 'Wishlist',
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

export default function ModModal({ mod, defaultStatus, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: defaultStatus || 'WISHLIST',
    estimatedCost: '',
    actualCost: '',
    vendor: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mod) {
      setForm({
        title: mod.title || '',
        description: mod.description || '',
        status: mod.status || 'WISHLIST',
        estimatedCost: mod.estimatedCost ?? '',
        actualCost: mod.actualCost ?? '',
        vendor: mod.vendor || '',
      })
    }
  }, [mod])

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
        estimatedCost: form.estimatedCost !== '' ? parseFloat(form.estimatedCost) : null,
        actualCost: form.actualCost !== '' ? parseFloat(form.actualCost) : null,
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
          <h2>{mod ? 'Edit mod' : 'Add mod'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ background: 'rgba(224,60,60,0.1)', border: '1px solid rgba(224,60,60,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Title *</label>
            <input placeholder="e.g. Coilover suspension" value={form.title} onChange={set('title')} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Details, part numbers, links..."
              value={form.description}
              onChange={set('description')}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={set('status')}>
              {STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Est. cost (€)</label>
              <input type="number" placeholder="0.00" value={form.estimatedCost} onChange={set('estimatedCost')} min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Actual cost (€)</label>
              <input type="number" placeholder="0.00" value={form.actualCost} onChange={set('actualCost')} min="0" step="0.01" />
            </div>
          </div>

          <div className="form-group">
            <label>Vendor / supplier</label>
            <input placeholder="e.g. Turner Motorsport" value={form.vendor} onChange={set('vendor')} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : mod ? 'Save changes' : 'Add mod'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
