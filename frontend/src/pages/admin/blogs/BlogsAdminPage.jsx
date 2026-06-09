import { useEffect, useRef, useState } from 'react'
import * as api from '../../../api/adminBlogs.js'
import { listCategories } from '../../../api/adminCategories.js'
import { mediaUrl } from '../../../api/client.js'
import RichTextEditor from '../../../components/admin/RichTextEditor.jsx'

function todayStr() {
  // YYYY-MM-DD for <input type=date> (local).
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  tags: '',
  author: 'KidScape',
  featured: false,
  isActive: true,
  order: 0,
  publishedAt: todayStr(),
}

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

export default function BlogsAdminPage() {
  const [items, setItems] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  function load() {
    setError(null)
    api
      .listBlogs()
      .then(setItems)
      .catch((e) => setError(e.message || 'Không tải được danh sách.'))
  }
  useEffect(() => {
    load()
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }
  function resetForm() {
    setEditing(null)
    setForm({ ...EMPTY, publishedAt: todayStr() })
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }
  function startEdit(b) {
    setEditing(b)
    setForm({
      title: b.title || '',
      slug: b.slug || '',
      excerpt: b.excerpt || '',
      content: b.content || '',
      category: b.category || '',
      tags: (b.tags || []).join(', '),
      author: b.author || 'KidScape',
      featured: !!b.featured,
      isActive: b.isActive !== false,
      order: b.order ?? 0,
      publishedAt: b.publishedAt ? b.publishedAt.slice(0, 10) : todayStr(),
    })
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const body = {
      title: form.title.trim(),
      slug: (form.slug.trim() || slugify(form.title)).trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      category: form.category,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      author: form.author.trim() || 'KidScape',
      featured: form.featured,
      isActive: form.isActive,
      order: Number(form.order) || 0,
      publishedAt: form.publishedAt,
    }
    try {
      const saved = editing ? await api.updateBlog(editing._id, body) : await api.createBlog(body)
      if (file) await api.uploadBlogImage(saved._id, file)
      resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa bài viết này?')) return
    try {
      await api.deleteBlog(id)
      if (editing?._id === id) resetForm()
      load()
    } catch (err) {
      setError(err.message || 'Xóa thất bại.')
    }
  }

  async function handleRemoveImage() {
    if (!editing) return
    try {
      const updated = await api.deleteBlogImage(editing._id)
      setEditing(updated)
      load()
    } catch (err) {
      setError(err.message || 'Xóa ảnh thất bại.')
    }
  }

  const currentImage = editing && mediaUrl(editing.imagePath)
  const catName = (slug) => categories.find((c) => c.slug === slug)?.name || slug || '—'

  return (
    <main className="admin-content">
      <h1 className="admin-page-title">Tin tức & Bài viết</h1>
      <p className="admin-page-sub">
        Quản lý bài viết hiển thị ở trang <code>/blog</code>. Cần tạo danh mục trước (mục “Danh mục”).
      </p>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <section className="admin-card">
        <h2 className="admin-card__title">{editing ? `Sửa: ${editing.title}` : 'Thêm bài viết'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-field-row">
            <label className="admin-field" style={{ flex: 1 }}>
              <span>Tiêu đề</span>
              <input type="text" value={form.title} maxLength={200} required onChange={(e) => set('title', e.target.value)} />
            </label>
            <label className="admin-field" style={{ flex: 1 }}>
              <span>Slug (để trống sẽ tự tạo)</span>
              <input type="text" value={form.slug} placeholder="slug-bai-viet" onChange={(e) => set('slug', e.target.value)} />
            </label>
          </div>

          <label className="admin-field">
            <span>Mô tả ngắn (excerpt)</span>
            <textarea rows={2} value={form.excerpt} maxLength={600} onChange={(e) => set('excerpt', e.target.value)} />
          </label>

          <div className="admin-field">
            <span>Nội dung</span>
            <RichTextEditor value={form.content} onChange={(html) => set('content', html)} />
          </div>

          <div className="admin-field-row">
            <label className="admin-field admin-field--sm">
              <span>Danh mục</span>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">— Chọn —</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field admin-field--sm">
              <span>Tác giả</span>
              <input type="text" value={form.author} onChange={(e) => set('author', e.target.value)} />
            </label>
            <label className="admin-field admin-field--sm">
              <span>Ngày công bố</span>
              <input type="date" value={form.publishedAt} onChange={(e) => set('publishedAt', e.target.value)} />
            </label>
          </div>

          <label className="admin-field">
            <span>Thẻ (tags, cách nhau dấu phẩy)</span>
            <input type="text" value={form.tags} placeholder="động vật, giáo dục" onChange={(e) => set('tags', e.target.value)} />
          </label>

          {/* Cover image */}
          <div className="admin-field">
            <span>Ảnh bìa</span>
            {currentImage && (
              <div className="admin-image-preview">
                <img src={currentImage} alt={editing.title} />
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
            <small className="admin-muted">JPG/PNG/WEBP/GIF, tối đa 3MB.</small>
          </div>

          <div className="admin-field-row">
            <label className="admin-field admin-field--sm">
              <span>Thứ tự</span>
              <input type="number" value={form.order} onChange={(e) => set('order', e.target.value)} />
            </label>
            <label className="admin-check">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              <span>Nổi bật</span>
            </label>
            <label className="admin-check">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
              <span>Hiển thị</span>
            </label>
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
          <p className="admin-muted">Chưa có bài viết nào.</p>
        ) : (
          <ul className="admin-list">
            {items.map((b) => (
              <li key={b._id} className="admin-list__row">
                <div className="admin-list__thumb">
                  {mediaUrl(b.imagePath) ? <img src={mediaUrl(b.imagePath)} alt={b.title} /> : <span>📰</span>}
                </div>
                <div className="admin-list__main">
                  <strong>{b.title}</strong>
                  <p>{b.excerpt}</p>
                  <div className="admin-tags">
                    {b.category && <span className="admin-badge admin-badge--ok">{catName(b.category)}</span>}
                    {b.featured && <span className="admin-badge admin-badge--ok">Nổi bật</span>}
                    {b.isActive === false && <span className="admin-badge admin-badge--off">Ẩn</span>}
                  </div>
                </div>
                <div className="admin-list__side">
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => startEdit(b)}>
                    Sửa
                  </button>
                  <button type="button" className="btn btn--danger btn--sm" onClick={() => handleDelete(b._id)}>
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
