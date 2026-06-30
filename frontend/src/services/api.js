import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
})

// Attach the JWT token (if present) to every request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the server ever responds with 401, the token is invalid/expired -
// clear local storage so the user is sent back to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

// ---------- Auth ----------
export const registerStudent = (data) => api.post('/register', data)
export const loginStudent = (data) => api.post('/login', data)

// ---------- Student complaints ----------
export const createComplaint = (data) => api.post('/complaints', data)
export const getMyComplaints = () => api.get('/my-complaints')

// ---------- Admin ----------
export const getAllComplaints = () => api.get('/admin/complaints')
export const updateComplaintStatus = (id, status) =>
  api.put(`/admin/complaints/${id}`, { status })
export const deleteComplaint = (id) => api.delete(`/admin/complaints/${id}`)

export default api
