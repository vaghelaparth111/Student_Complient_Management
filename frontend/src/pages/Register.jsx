import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerStudent } from '../services/api.js'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
    confirm_password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!form.name || !form.email || !form.department || !form.password || !form.confirm_password) {
      setError('All fields are required.')
      return false
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(form.email)) {
      setError('Please enter a valid email address.')
      return false
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return false
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)
    try {
      await registerStudent(form)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="auth-subtext">Register as a student to start submitting complaints.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              name="department"
              type="text"
              className="form-control"
              placeholder="e.g. IT"
              value={form.department}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              className="form-control"
              placeholder="Re-enter your password"
              value={form.confirm_password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}
