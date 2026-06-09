import { useEffect, useState } from 'react'
import * as api from '../../../api/adminChat.js'

const EMPTY = { question: '', answer: '', order: 0, isActive: true }

export default function SuggestionsPage() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setError(null)
    api
      .listSuggestions()
      .then(setItems)
      .catch((e) => setError(e.message || 'Không tải được danh sách.'))
  }
  useEffect(load, [])

  function startEdit(item) {
    setEditingId(item._id)
    setForm({
      question: item.question,
      answer: item.answer,
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
      question: form.question.trim(),
      answer: form.answer.trim(),
      order: Number(form.order) || 0,
      isActive: form.isActive,
    }
    try {
      if (editingId) await api.updateSuggestion(editingId, body)
      else await api.createSuggestion(body)
      resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa câu hỏi gợi ý này?')) return
    try {
      await api.deleteSuggestion(id)
      if (editingId === id) resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Xóa thất bại.')
    }
  }

  return (
    <main className="admin-content">
      <h1 className="admin-page-title">Câu hỏi gợi ý</h1>
      <p className="admin-page-sub">
        Các câu hỏi hiển thị dạng chip trong khung chat. Khi người dùng bấm vào, câu trả lời sẵn sẽ
        hiện ngay (không gọi AI).
      </p>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <section className="admin-card">
        <h2 className="admin-card__title">{editingId ? 'Sửa câu hỏi gợi ý' : 'Thêm câu hỏi gợi ý'}</h2>
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Câu hỏi</span>
            <input
              type="text"
              maxLength={300}
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              required
            />
          </label>
          <label className="admin-field">
            <span>Câu trả lời sẵn</span>
            <textarea
              rows={4}
              maxLength={3000}
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              required
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
          <p className="admin-muted">Chưa có câu hỏi gợi ý nào.</p>
        ) : (
          <ul className="admin-list">
            {items.map((it) => (
              <li key={it._id} className="admin-list__row">
                <div className="admin-list__main">
                  <strong>{it.question}</strong>
                  <p>{it.answer}</p>
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
