import { useEffect, useRef, useState } from 'react'
import * as api from '../../../api/adminProducts.js'
import { mediaUrl } from '../../../api/client.js'

const EMPTY = {
  name: '',
  slug: '',
  tag: '',
  desc: '',
  longDesc: '',
  emoji: '🧸',
  color: '#FF6B6B',
  ageRange: '',
  status: 'available',
  order: 0,
  isActive: true,
  develops: '',
  highlights: [],
}

// Vietnamese-friendly slugify (strips diacritics, spaces → dashes).
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

export default function ProductsAdminPage() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null) // the product being edited (has _id, imagePath)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  function load() {
    setError(null)
    api
      .listProducts()
      .then(setItems)
      .catch((e) => setError(e.message || 'Không tải được danh sách.'))
  }
  useEffect(load, [])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function resetForm() {
    setEditing(null)
    setForm(EMPTY)
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function startEdit(p) {
    setEditing(p)
    setForm({
      name: p.name || '',
      slug: p.slug || '',
      tag: p.tag || '',
      desc: p.desc || '',
      longDesc: p.longDesc || '',
      emoji: p.emoji || '🧸',
      color: p.color || '#FF6B6B',
      ageRange: p.ageRange || '',
      status: p.status || 'available',
      order: p.order ?? 0,
      isActive: p.isActive !== false,
      develops: (p.develops || []).join(', '),
      highlights: (p.highlights || []).map((h) => ({ icon: h.icon || '', title: h.title || '', desc: h.desc || '' })),
    })
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Highlights editor
  function addHighlight() {
    set('highlights', [...form.highlights, { icon: '', title: '', desc: '' }])
  }
  function updateHighlight(i, key, value) {
    set(
      'highlights',
      form.highlights.map((h, idx) => (idx === i ? { ...h, [key]: value } : h))
    )
  }
  function removeHighlight(i) {
    set(
      'highlights',
      form.highlights.filter((_, idx) => idx !== i)
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const slug = (form.slug.trim() || slugify(form.name)).trim()
    const body = {
      name: form.name.trim(),
      slug,
      tag: form.tag.trim(),
      desc: form.desc.trim(),
      longDesc: form.longDesc.trim(),
      emoji: form.emoji.trim(),
      color: form.color.trim(),
      ageRange: form.ageRange.trim(),
      status: form.status,
      order: Number(form.order) || 0,
      isActive: form.isActive,
      develops: form.develops
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean),
      highlights: form.highlights
        .map((h) => ({ icon: h.icon.trim(), title: h.title.trim(), desc: h.desc.trim() }))
        .filter((h) => h.title),
    }

    try {
      const saved = editing ? await api.updateProduct(editing._id, body) : await api.createProduct(body)
      if (file) await api.uploadProductImage(saved._id, file)
      resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa sản phẩm này?')) return
    try {
      await api.deleteProduct(id)
      if (editing?._id === id) resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Xóa thất bại.')
    }
  }

  async function handleRemoveImage() {
    if (!editing) return
    try {
      const updated = await api.deleteProductImage(editing._id)
      setEditing(updated)
      load()
    } catch (err) {
      setError(err.message || 'Xóa ảnh thất bại.')
    }
  }

  const currentImage = editing && mediaUrl(editing.imagePath)

  return (
    <main className="admin-content">
      <h1 className="admin-page-title">Sản phẩm</h1>
      <p className="admin-page-sub">
        Quản lý danh sách sản phẩm hiển thị ở trang <code>/products</code>. Trạng thái “Sắp ra mắt”
        hiện dạng thẻ teaser, không có trang chi tiết.
      </p>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <section className="admin-card">
        <h2 className="admin-card__title">{editing ? `Sửa: ${editing.name}` : 'Thêm sản phẩm'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-field-row">
            <label className="admin-field" style={{ flex: 1 }}>
              <span>Tên sản phẩm</span>
              <input type="text" value={form.name} maxLength={200} required onChange={(e) => set('name', e.target.value)} />
            </label>
            <label className="admin-field" style={{ flex: 1 }}>
              <span>Slug (để trống sẽ tự tạo)</span>
              <input type="text" value={form.slug} placeholder="vi-du-slug" onChange={(e) => set('slug', e.target.value)} />
            </label>
          </div>

          <label className="admin-field">
            <span>Nhãn (tag)</span>
            <input type="text" value={form.tag} maxLength={120} onChange={(e) => set('tag', e.target.value)} />
          </label>

          <label className="admin-field">
            <span>Mô tả ngắn</span>
            <textarea rows={2} value={form.desc} maxLength={600} onChange={(e) => set('desc', e.target.value)} />
          </label>

          <label className="admin-field">
            <span>Mô tả dài (trang chi tiết)</span>
            <textarea rows={4} value={form.longDesc} maxLength={4000} onChange={(e) => set('longDesc', e.target.value)} />
          </label>

          <div className="admin-field-row">
            <label className="admin-field admin-field--sm">
              <span>Emoji</span>
              <input type="text" value={form.emoji} maxLength={8} onChange={(e) => set('emoji', e.target.value)} />
            </label>
            <label className="admin-field admin-field--sm">
              <span>Màu</span>
              <input type="color" value={form.color} onChange={(e) => set('color', e.target.value)} />
            </label>
            <label className="admin-field admin-field--sm">
              <span>Độ tuổi</span>
              <input type="text" value={form.ageRange} placeholder="3 – 6 tuổi" onChange={(e) => set('ageRange', e.target.value)} />
            </label>
          </div>

          {/* Image upload */}
          <div className="admin-field">
            <span>Ảnh sản phẩm</span>
            {currentImage && (
              <div className="admin-image-preview">
                <img src={currentImage} alt={editing.name} />
                <button type="button" className="btn btn--ghost btn--sm" onClick={handleRemoveImage}>
                  Xóa ảnh hiện tại
                </button>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <small className="admin-muted">JPG/PNG/WEBP/GIF, tối đa 3MB. Để trống nếu giữ ảnh cũ (hoặc dùng emoji).</small>
          </div>

          <div className="admin-field-row">
            <label className="admin-field admin-field--sm">
              <span>Trạng thái</span>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="available">Đang bán</option>
                <option value="upcoming">Sắp ra mắt</option>
              </select>
            </label>
            <label className="admin-field admin-field--sm">
              <span>Thứ tự</span>
              <input type="number" value={form.order} onChange={(e) => set('order', e.target.value)} />
            </label>
            <label className="admin-check">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
              <span>Hiển thị</span>
            </label>
          </div>

          <label className="admin-field">
            <span>Phát triển (cách nhau dấu phẩy)</span>
            <input type="text" value={form.develops} placeholder="Ngôn ngữ, Cảm xúc, Giác quan" onChange={(e) => set('develops', e.target.value)} />
          </label>

          {/* Highlights editor */}
          <div className="admin-field">
            <span>Điểm nổi bật (trang chi tiết)</span>
            {form.highlights.map((h, i) => (
              <div className="admin-highlight-row" key={i}>
                <input
                  type="text"
                  className="admin-highlight-row__icon"
                  placeholder="🔊"
                  value={h.icon}
                  onChange={(e) => updateHighlight(i, 'icon', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Tiêu đề"
                  value={h.title}
                  onChange={(e) => updateHighlight(i, 'title', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Mô tả ngắn"
                  value={h.desc}
                  onChange={(e) => updateHighlight(i, 'desc', e.target.value)}
                />
                <button type="button" className="btn btn--danger btn--sm" onClick={() => removeHighlight(i)}>
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn btn--ghost btn--sm admin-highlight-add" onClick={addHighlight}>
              + Thêm điểm nổi bật
            </button>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Đang lưu…' : editing ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {editing && (
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
          <p className="admin-muted">Chưa có sản phẩm nào.</p>
        ) : (
          <ul className="admin-list">
            {items.map((p) => (
              <li key={p._id} className="admin-list__row">
                <div className="admin-list__thumb" style={{ '--accent': p.color }}>
                  {mediaUrl(p.imagePath) ? (
                    <img src={mediaUrl(p.imagePath)} alt={p.name} />
                  ) : (
                    <span>{p.emoji}</span>
                  )}
                </div>
                <div className="admin-list__main">
                  <strong>{p.name}</strong>
                  <p>{p.desc}</p>
                  <div className="admin-tags">
                    <span className={`admin-badge ${p.status === 'upcoming' ? 'admin-badge--off' : 'admin-badge--ok'}`}>
                      {p.status === 'upcoming' ? 'Sắp ra mắt' : 'Đang bán'}
                    </span>
                    {p.isActive === false && <span className="admin-badge admin-badge--off">Ẩn</span>}
                  </div>
                </div>
                <div className="admin-list__side">
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => startEdit(p)}>
                    Sửa
                  </button>
                  <button type="button" className="btn btn--danger btn--sm" onClick={() => handleDelete(p._id)}>
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
