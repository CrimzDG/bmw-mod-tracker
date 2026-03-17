import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function BMWLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#1C1C1C" stroke="#444" strokeWidth="1"/>
      <circle cx="16" cy="16" r="12" fill="none" stroke="#444" strokeWidth="0.75"/>
      <path d="M16 4 A12 12 0 0 1 28 16 L16 16 Z" fill="#fff"/>
      <path d="M16 16 L28 16 A12 12 0 0 1 16 28 Z" fill="#1C6EFF"/>
      <path d="M16 28 A12 12 0 0 1 4 16 L16 16 Z" fill="#fff"/>
      <path d="M4 16 A12 12 0 0 1 16 4 L16 16 Z" fill="#1C6EFF"/>
      <circle cx="16" cy="16" r="12" fill="none" stroke="#666" strokeWidth="1"/>
      <circle cx="16" cy="16" r="15" fill="none" stroke="#444" strokeWidth="0.75"/>
    </svg>
  )
}

export default function Navbar({ title, backTo }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        {backTo && (
          <Link to={backTo} className="navbar-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="navbar-back-label">Back</span>
          </Link>
        )}
        <div className="navbar-brand">
          <BMWLogo />
          <div className="navbar-brand-text">
            <span className="navbar-brand-bmw">BMW</span>
            <span className="navbar-brand-sub">MOD TRACKER</span>
          </div>
        </div>
        {title && <span className="navbar-title">{title}</span>}
      </div>

      <div className="navbar-right">
        <span className="navbar-user">{user?.username}</span>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </header>
  )
}
