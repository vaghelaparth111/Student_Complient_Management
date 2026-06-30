import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🎓 Complaint Portal
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/my-complaints"
                className={`nav-link ${isActive('/my-complaints') ? 'active' : ''}`}
              >
                My Complaints
              </Link>
              <Link
                to="/submit-complaint"
                className={`nav-link ${isActive('/submit-complaint') ? 'active' : ''}`}
              >
                Submit Complaint
              </Link>
              <span className="nav-link" style={{ color: 'var(--color-text-muted)' }}>
                Hi, {user?.name}
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                Login
              </Link>
              <Link
                to="/register"
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
              >
                Register
              </Link>
            </>
          )}
          <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
