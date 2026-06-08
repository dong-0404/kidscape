import { useState } from 'react'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already signed in → skip the login screen.
  if (!loading && isAuthenticated) return <Navigate to={from} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-auth">
      <form className="admin-auth__card" onSubmit={handleSubmit}>
        <Link to="/" className="admin-auth__brand">
          <span className="logo__mark" aria-hidden="true">
            <span className="logo__dot logo__dot--y" />
            <span className="logo__dot logo__dot--t" />
          </span>
          <span className="logo__text">KidScape</span>
        </Link>

        <h1 className="admin-auth__title">Đăng nhập quản trị</h1>
        <p className="admin-auth__sub">Khu vực dành cho quản trị viên KidScape</p>

        {error && <div className="admin-alert admin-alert--error">{error}</div>}

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@kidscape.vn"
            autoComplete="username"
            required
            autoFocus
          />
        </label>

        <label className="admin-field">
          <span>Mật khẩu</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          className="btn btn--primary btn--lg admin-auth__submit"
          disabled={submitting}
        >
          {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>

        <Link to="/" className="admin-auth__back">
          ← Về trang chủ
        </Link>
      </form>
    </div>
  )
}
