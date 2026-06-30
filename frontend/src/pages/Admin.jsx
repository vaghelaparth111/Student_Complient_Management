import { useEffect, useState } from 'react'
import { getAllComplaints, updateComplaintStatus, deleteComplaint } from '../services/api.js'
import ComplaintTable from '../components/ComplaintTable.jsx'

export default function Admin() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchComplaints = async () => {
    try {
      const response = await getAllComplaints()
      setComplaints(response.data)
    } catch (err) {
      setError('Failed to load complaints. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    // Optimistically update the UI, then sync with the server
    const previous = complaints
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    )
    try {
      await updateComplaintStatus(id, newStatus)
    } catch (err) {
      setError('Failed to update status. Please try again.')
      setComplaints(previous)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return

    const previous = complaints
    setComplaints((prev) => prev.filter((c) => c.id !== id))
    try {
      await deleteComplaint(id)
    } catch (err) {
      setError('Failed to delete complaint. Please try again.')
      setComplaints(previous)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>View, update, and manage all student complaints.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-text">Loading complaints...</div>
      ) : (
        <ComplaintTable
          complaints={complaints}
          mode="admin"
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
