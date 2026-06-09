import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import BlogDetailPage from './pages/BlogDetailPage.jsx'
import LoginPage from './pages/admin/LoginPage.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import ProductsAdminPage from './pages/admin/products/ProductsAdminPage.jsx'
import BlogsAdminPage from './pages/admin/blogs/BlogsAdminPage.jsx'
import CategoriesAdminPage from './pages/admin/categories/CategoriesAdminPage.jsx'
import SubscribersPage from './pages/admin/subscribers/SubscribersPage.jsx'
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
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="blogs" element={<BlogsAdminPage />} />
            <Route path="categories" element={<CategoriesAdminPage />} />
            <Route path="subscribers" element={<SubscribersPage />} />
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
