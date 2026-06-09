import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/admin/LoginPage.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import SuggestionsPage from './pages/admin/chatbot/SuggestionsPage.jsx'
import KnowledgeBasePage from './pages/admin/chatbot/KnowledgeBasePage.jsx'
import ChatWidget from './components/chatbot/ChatWidget.jsx'

export default function App() {
  const location = useLocation()
  // The chat widget appears on every public page, never inside the admin area.
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<HomePage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="chatbot/suggestions" element={<SuggestionsPage />} />
            <Route path="chatbot/kb" element={<KnowledgeBasePage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdmin && <ChatWidget />}
    </>
  )
}
