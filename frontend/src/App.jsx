import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './motion/PageTransition.jsx'
import ScrollToTop from './motion/ScrollToTop.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
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
      <ScrollToTop />
      {isAdmin ? (
        // ADMIN: thế giới hình ảnh riêng — KHÔNG transition, KHÔNG chat widget.
        <Routes>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        // PUBLIC: crossfade opacity-only giữa các trang (giữ sticky header + fixed chat ổn định).
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            {/* /products CHÍNH LÀ màn sản phẩm (bộ sa bàn chủ lực).
                /products/:slug giữ lại để link cũ và sản phẩm khác từ API vẫn vào được. */}
            <Route path="/products" element={<PageTransition><ProductPage /></PageTransition>} />
            <Route path="/products/:slug" element={<PageTransition><ProductPage /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
            <Route path="/blog/:slug" element={<PageTransition><BlogDetailPage /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      )}

      {!isAdmin && <ChatWidget />}
    </>
  )
}
