import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SubmitComplaint from './pages/SubmitComplaint.jsx'
import MyComplaints from './pages/MyComplaints.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-complaint"
          element={
            <ProtectedRoute>
              <SubmitComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute>
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        {/* Admin panel - no login required in v1 per spec */}
        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}
