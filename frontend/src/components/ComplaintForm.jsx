import { useState } from 'react'
import { createComplaint } from '../services/api.js'

export default function ComplaintForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!title.trim() || !description.trim()) {
      setError('Both title and description are required.')
      return false
    }
    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters long.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validate()) return

    setLoading(true)
    try {
      await createComplaint({ title: title.trim(), description: description.trim() })
      setSuccess('Your complaint was submitted successfully!')
      setTitle('')
      setDescription('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit complaint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Complaint Title</label>
          <input
            id="title"
            type="text"
            className="form-control"
            placeholder="e.g. WiFi not working in Lab 2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  )
}
