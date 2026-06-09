import { useEffect, useState } from 'react'
import * as api from '../../../api/adminCategories.js'

const EMPTY = { name: '', slug: '', order: 0, isActive: true }

function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function CategoriesAdminPage() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setError(null)
    api
      .listCategories()
      .then(setItems)
      .catch((e) => setError(e.message || 'Không tải được danh sách.'))
  }
  useEffect(load, [])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }
  function resetForm() {
    setEditingId(null)
    setForm(EMPTY)
  }
  function startEdit(c) {
    setEditingId(c._id)
    setForm({ name: c.name, slug: c.slug, order: c.order ?? 0, isActive: c.isActive !== false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const body = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)).trim(),
      order: Number(form.order) || 0,
      isActive: form.isActive,
    }
    try {
      if (editingId) await api.updateCategory(editingId, body)
      else await api.createCategory(body)
      resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa danh mục này?')) return
    try {
      await api.deleteCategory(id)
      if (editingId === id) resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Xóa thất bại.')
    }
  }

  return (
    <main className="admin-content">
      <h1 className="admin-page-title">Danh mục bài viết</h1>
      <p className="admin-page-sub">Danh mục dùng để phân loại và lọc bài viết ở trang Tin tức.</p>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <section className="admin-card">
        <h2 className="admin-card__title">{editingId ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-field-row">
            <label className="admin-field" style={{ flex: 1 }}>
              <span>Tên danh mục</span>
              <input type="text" value={form.name} maxLength={100} required onChange={(e) => set('name', e.target.value)} />
            </label>
            <label className="admin-field" style={{ flex: 1 }}>
              <span>Slug (để trống sẽ tự tạo)</span>
              <input type="text" value={form.slug} placeholder="vi-du-danh-muc" onChange={(e) => set('slug', e.target.value)} />
            </label>
          </div>
          <div className="admin-field-row">
            <label className="admin-field admin-field--sm">
              <span>Thứ tự</span>
              <input type="number" value={form.order} onChange={(e) => set('order', e.target.value)} />
            </label>
            <label className="admin-check">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
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
          <p className="admin-muted">Chưa có danh mục nào.</p>
        ) : (
          <ul className="admin-list">
            {items.map((c) => (
              <li key={c._id} className="admin-list__row">
                <div className="admin-list__main">
                  <strong>{c.name}</strong>
                  <p>/{c.slug}</p>
                </div>
                <div className="admin-list__side">
                  {c.isActive === false && <span className="admin-badge admin-badge--off">Ẩn</span>}
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => startEdit(c)}>
                    Sửa
                  </button>
                  <button type="button" className="btn btn--danger btn--sm" onClick={() => handleDelete(c._id)}>
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
