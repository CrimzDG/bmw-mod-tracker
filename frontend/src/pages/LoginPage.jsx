import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

function BMWRoundel() {
  return (
    <svg className="auth-logo-roundel" width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="31" fill="#1C1C1C" stroke="#444" strokeWidth="1.5"/>
      <circle cx="32" cy="32" r="25" fill="none" stroke="#444" strokeWidth="1"/>
      <path d="M32 7 A25 25 0 0 1 57 32 L32 32 Z" fill="#fff"/>
      <path d="M32 32 L57 32 A25 25 0 0 1 32 57 Z" fill="#1C6EFF"/>
      <path d="M32 57 A25 25 0 0 1 7 32 L32 32 Z" fill="#fff"/>
      <path d="M7 32 A25 25 0 0 1 32 7 L32 32 Z" fill="#1C6EFF"/>
      <circle cx="32" cy="32" r="25" fill="none" stroke="#888" strokeWidth="1.5"/>
      <circle cx="32" cy="32" r="31" fill="none" stroke="#555" strokeWidth="1"/>
    </svg>
  )
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.login(form)
      login(data)
      navigate('/garage')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-logo">
        <BMWRoundel />
        <span className="auth-logo-text">BMW</span>
        <span className="auth-logo-sub">MOD TRACKER</span>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your garage</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? <span className="spinner" /> : 'Sign in'}
        </button>

        <p className="auth-switch">
          No account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  )
}
