import { useEffect, useState } from 'react'
import { getMyComplaints } from '../services/api.js'
import ComplaintTable from '../components/ComplaintTable.jsx'

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await getMyComplaints()
        setComplaints(response.data)
      } catch (err) {
        setError('Failed to load your complaints. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Complaints</h1>
        <p>Track the status of all the complaints you've submitted.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-text">Loading your complaints...</div>
      ) : (
        <ComplaintTable complaints={complaints} mode="student" />
      )}
    </div>
  )
}
