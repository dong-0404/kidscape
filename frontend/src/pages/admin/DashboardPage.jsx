import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import * as authApi from '../../api/auth.js'

const NAV_ITEMS = [
  { icon: '📊', label: 'Tổng quan', active: true },
  { icon: '📰', label: 'Tin tức' },
  { icon: '🧸', label: 'Sản phẩm' },
  { icon: '🤝', label: 'Đối tác' },
  { icon: '👥', label: 'Đội ngũ' },
  { icon: '✉️', label: 'Liên hệ' },
  { icon: '⚙️', label: 'Cài đặt' },
]

function formatDateTime(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('vi-VN')
  } catch {
    return '—'
  }
}

export default function DashboardPage() {
  const { admin, logout } = useAuth()
  const [health, setHealth] = useState(null)
  const [healthError, setHealthError] = useState(false)

  useEffect(() => {
    let active = true
    authApi
      .getHealth()
      .then((data) => active && setHealth(data))
      .catch(() => active && setHealthError(true))
    return () => {
      active = false
    }
  }, [])

  const apiOnline = !healthError && !!health
  const dbConnected = health?.db === 'connected'

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
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`admin-nav__item${item.active ? ' is-active' : ''}`}
              disabled={!item.active}
              title={item.active ? item.label : 'Sắp có'}
            >
              <span className="admin-nav__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
              {!item.active && <span className="admin-nav__soon">Sắp có</span>}
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
            <h1 className="admin-topbar__title">Tổng quan</h1>
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

        <main className="admin-content">
          {/* Stat cards */}
          <section className="admin-grid admin-grid--stats">
            <div className="admin-card admin-stat">
              <span className="admin-stat__label">Trạng thái API</span>
              <span className={`admin-badge ${apiOnline ? 'admin-badge--ok' : 'admin-badge--off'}`}>
                {healthError ? 'Mất kết nối' : apiOnline ? 'Đang hoạt động' : 'Đang kiểm tra…'}
              </span>
            </div>
            <div className="admin-card admin-stat">
              <span className="admin-stat__label">Cơ sở dữ liệu</span>
              <span className={`admin-badge ${dbConnected ? 'admin-badge--ok' : 'admin-badge--off'}`}>
                {health ? (dbConnected ? 'Đã kết nối' : health.db) : '—'}
              </span>
            </div>
            <div className="admin-card admin-stat">
              <span className="admin-stat__label">Vai trò</span>
              <span className="admin-stat__value">Quản trị viên</span>
            </div>
            <div className="admin-card admin-stat">
              <span className="admin-stat__label">Đăng nhập gần nhất</span>
              <span className="admin-stat__value admin-stat__value--sm">
                {formatDateTime(admin?.lastLoginAt)}
              </span>
            </div>
          </section>

          <div className="admin-grid admin-grid--two">
            {/* Account info */}
            <section className="admin-card">
              <h2 className="admin-card__title">Thông tin tài khoản</h2>
              <dl className="admin-info">
                <div>
                  <dt>Họ tên</dt>
                  <dd>{admin?.name || '—'}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{admin?.email || '—'}</dd>
                </div>
                <div>
                  <dt>Trạng thái</dt>
                  <dd>
                    <span className="admin-badge admin-badge--ok">
                      {admin?.isActive === false ? 'Đã khóa' : 'Hoạt động'}
                    </span>
                  </dd>
                </div>
              </dl>
            </section>

            {/* Change password */}
            <ChangePasswordCard />
          </div>

          <section className="admin-card admin-soon-card">
            <h2 className="admin-card__title">Quản lý nội dung</h2>
            <p className="admin-soon-card__text">
              Các module quản lý (Tin tức, Sản phẩm, Đối tác, Đội ngũ, Liên hệ…) sẽ được bổ sung ở
              giai đoạn tiếp theo.
            </p>
            <Link to="/" className="btn btn--ghost">
              Xem trang chủ
            </Link>
          </section>
        </main>
      </div>
    </div>
  )
}

function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', message }
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (newPassword.length < 8) {
      setStatus({ type: 'error', message: 'Mật khẩu mới tối thiểu 8 ký tự.' })
      return
    }
    if (newPassword !== confirm) {
      setStatus({ type: 'error', message: 'Xác nhận mật khẩu không khớp.' })
      return
    }

    setSubmitting(true)
    try {
      await authApi.changePassword(currentPassword, newPassword)
      setStatus({ type: 'success', message: 'Đổi mật khẩu thành công.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Đổi mật khẩu thất bại.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="admin-card">
      <h2 className="admin-card__title">Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        {status && (
          <div className={`admin-alert admin-alert--${status.type}`}>{status.message}</div>
        )}
        <label className="admin-field">
          <span>Mật khẩu hiện tại</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <label className="admin-field">
          <span>Mật khẩu mới</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <label className="admin-field">
          <span>Xác nhận mật khẩu mới</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Đang lưu…' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </section>
  )
}
