import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/admin/LoginPage.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route path="/" element={<HomePage />} />

      {/* Admin */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<DashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
