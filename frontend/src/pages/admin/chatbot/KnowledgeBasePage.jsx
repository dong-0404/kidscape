import { useEffect, useState } from 'react'
import * as api from '../../../api/adminChat.js'

const EMPTY = { title: '', content: '', tags: '', order: 0, isActive: true }

export default function KnowledgeBasePage() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setError(null)
    api
      .listKb()
      .then(setItems)
      .catch((e) => setError(e.message || 'Không tải được danh sách.'))
  }
  useEffect(load, [])

  function startEdit(item) {
    setEditingId(item._id)
    setForm({
      title: item.title,
      content: item.content,
      tags: (item.tags || []).join(', '),
      order: item.order ?? 0,
      isActive: item.isActive !== false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const body = {
      title: form.title.trim(),
      content: form.content.trim(),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      order: Number(form.order) || 0,
      isActive: form.isActive,
    }
    try {
      if (editingId) await api.updateKb(editingId, body)
      else await api.createKb(body)
      resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa mục tri thức này?')) return
    try {
      await api.deleteKb(id)
      if (editingId === id) resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Xóa thất bại.')
    }
  }

  return (
    <main className="admin-content">
      <h1 className="admin-page-title">Kho tri thức (KB)</h1>
      <p className="admin-page-sub">
        Nội dung dùng để AI trả lời câu hỏi tự do. Chỉ những mục đang hiển thị mới được đưa vào ngữ
        cảnh cho chatbot.
      </p>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <section className="admin-card">
        <h2 className="admin-card__title">{editingId ? 'Sửa mục tri thức' : 'Thêm mục tri thức'}</h2>
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Tiêu đề</span>
            <input
              type="text"
              maxLength={200}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </label>
          <label className="admin-field">
            <span>Nội dung</span>
            <textarea
              rows={5}
              maxLength={5000}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              required
            />
          </label>
          <label className="admin-field">
            <span>Thẻ (phân tách bằng dấu phẩy)</span>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="sản phẩm, an toàn, độ tuổi"
            />
          </label>
          <div className="admin-field-row">
            <label className="admin-field admin-field--sm">
              <span>Thứ tự</span>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              />
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              <span>Hiển thị</span>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Đang lưu…' : editingId ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {editingId && (
              <button type="button" className="btn btn--ghost" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">Danh sách ({items?.length ?? 0})</h2>
        {items === null ? (
          <p className="admin-muted">Đang tải…</p>
        ) : items.length === 0 ? (
          <p className="admin-muted">Chưa có mục tri thức nào.</p>
        ) : (
          <ul className="admin-list">
            {items.map((it) => (
              <li key={it._id} className="admin-list__row">
                <div className="admin-list__main">
                  <strong>{it.title}</strong>
                  <p>{it.content}</p>
                  {it.tags?.length > 0 && (
                    <div className="admin-tags">
                      {it.tags.map((t) => (
                        <span key={t} className="admin-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="admin-list__side">
                  {it.isActive === false && <span className="admin-badge admin-badge--off">Ẩn</span>}
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => startEdit(it)}>
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(it._id)}
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
