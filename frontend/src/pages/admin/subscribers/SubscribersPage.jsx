import { useEffect, useState } from 'react'
import * as api from '../../../api/adminSubscribers.js'

function formatDateTime(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('vi-VN')
  } catch {
    return '—'
  }
}

export default function SubscribersPage() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)

  function load() {
    setError(null)
    api
      .listSubscribers()
      .then(setItems)
      .catch((e) => setError(e.message || 'Không tải được danh sách.'))
  }
  useEffect(load, [])

  async function handleDelete(id) {
    if (!window.confirm('Xóa email này khỏi danh sách?')) return
    try {
      await api.deleteSubscriber(id)
      load()
    } catch (err) {
      setError(err.message || 'Xóa thất bại.')
    }
  }

  async function handleExport() {
    setExporting(true)
    setError(null)
    try {
      await api.exportSubscribersCsv()
    } catch (err) {
      setError(err.message || 'Xuất CSV thất bại.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <main className="admin-content">
      <div className="admin-page-bar">
        <div>
          <h1 className="admin-page-title">Email đăng ký</h1>
          <p className="admin-page-sub">
            Danh sách email thu được từ ô “Nhận tin khi có sản phẩm mới” ở trang sản phẩm.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleExport}
          disabled={exporting || !items?.length}
        >
          {exporting ? 'Đang xuất…' : '⬇ Xuất CSV'}
        </button>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <section className="admin-card">
        <h2 className="admin-card__title">Danh sách ({items?.length ?? 0})</h2>
        {items === null ? (
          <p className="admin-muted">Đang tải…</p>
        ) : items.length === 0 ? (
          <p className="admin-muted">Chưa có ai đăng ký.</p>
        ) : (
          <ul className="admin-list">
            {items.map((s) => (
              <li key={s._id} className="admin-list__row">
                <div className="admin-list__main">
                  <strong>{s.email}</strong>
                  <p>
                    Đăng ký lúc {formatDateTime(s.createdAt)}
                    {s.source ? ` · nguồn: ${s.source}` : ''}
                  </p>
                </div>
                <div className="admin-list__side">
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(s._id)}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
