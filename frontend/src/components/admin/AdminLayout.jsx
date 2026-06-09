import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'

// Active modules (real routes) + "coming soon" placeholders.
const LINKS = [
  { to: '/admin', label: 'Tổng quan', icon: '📊', end: true },
  { to: '/admin/chatbot/suggestions', label: 'Câu hỏi gợi ý', icon: '💬' },
  { to: '/admin/chatbot/kb', label: 'Tri thức (KB)', icon: '📚' },
]

const SOON = [
  { icon: '📰', label: 'Tin tức' },
  { icon: '🧸', label: 'Sản phẩm' },
  { icon: '🤝', label: 'Đối tác' },
  { icon: '👥', label: 'Đội ngũ' },
  { icon: '✉️', label: 'Liên hệ' },
  { icon: '⚙️', label: 'Cài đặt' },
]

export default function AdminLayout() {
  const { admin, logout } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="logo__mark" aria-hidden="true">
            <span className="logo__dot logo__dot--y" />
            <span className="logo__dot logo__dot--t" />
          </span>
          <span className="logo__text">KidScape</span>
        </div>

        <nav className="admin-nav">
          {LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav__item${isActive ? ' is-active' : ''}`}
            >
              <span className="admin-nav__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {SOON.map((item) => (
            <button
              key={item.label}
              type="button"
              className="admin-nav__item"
              disabled
              title="Sắp có"
            >
              <span className="admin-nav__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span className="admin-nav__soon">Sắp có</span>
            </button>
          ))}
        </nav>

        <button type="button" className="admin-sidebar__logout" onClick={logout}>
          <span aria-hidden="true">⏻</span> Đăng xuất
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar__greet">Xin chào, {admin?.name || 'Quản trị viên'} 👋</p>
          </div>
          <div className="admin-topbar__user">
            <div className="admin-avatar" aria-hidden="true">
              {(admin?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="admin-topbar__meta">
              <strong>{admin?.name}</strong>
              <span>{admin?.email}</span>
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  )
}
