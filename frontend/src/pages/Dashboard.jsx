import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="container">
      <div className="welcome-banner">
        <h1>Welcome, {user?.name}</h1>
        <p>{user?.department} Department · {user?.email}</p>
      </div>

      <div className="card-grid">
        <div className="action-card">
          <h3>📝 Submit Complaint</h3>
          <p>Have an issue to report? Submit a new complaint and we'll track it for you.</p>
          <Link to="/submit-complaint" className="btn btn-primary">
            Submit Complaint
          </Link>
        </div>

        <div className="action-card">
          <h3>📋 My Complaints</h3>
          <p>View the status and history of all the complaints you've submitted.</p>
          <Link to="/my-complaints" className="btn btn-outline">
            View My Complaints
          </Link>
        </div>
      </div>
    </div>
  )
}
