import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

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
        {backTo ? (
          <Link to={backTo} className="navbar-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
        ) : null}
        <div className="navbar-brand">
          <span className="navbar-brand-bmw">BMW</span>
          <span className="navbar-brand-sub">MOD TRACKER</span>
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
