// End-to-end test for blogs + categories. Needs a reachable MongoDB at
// process.env.MONGODB_URI (CI mongo service; locally via the memory-server wrapper).
process.env.NODE_ENV = process.env.NODE_ENV || 'test'
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kidscape_blog_test'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_long_enough_for_tests_only_123'

const { connectDB, disconnectDB } = await import('../src/config/db.js')
const Admin = (await import('../src/models/Admin.js')).default
const Blog = (await import('../src/models/Blog.js')).default
const Category = (await import('../src/models/Category.js')).default
const { createApp } = await import('../src/app.js')

let ok = true
const check = (label, cond) => {
  console.log(`${cond ? '✓' : '✗'} ${label}`)
  if (!cond) ok = false
}

await connectDB()
await Promise.all([Admin.deleteMany({}), Blog.deleteMany({}), Category.deleteMany({})])

const EMAIL = 'blog-e2e@kidscape.vn'
const PASS = 'ChangeMe123!'
await Admin.create({ name: 'Blog E2E', email: EMAIL, passwordHash: await Admin.hashPassword(PASS) })

const server = createApp().listen(0)
await new Promise((r) => server.once('listening', r))
const base = `http://127.0.0.1:${server.address().port}/api`

const req = (path, { method = 'GET', body, token } = {}) =>
  fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

try {
  const token = (await (await req('/auth/login', { method: 'POST', body: { email: EMAIL, password: PASS } })).json())
    .data.token

  // ── Categories: gating + create ──
  check('admin categories không token -> 401', (await req('/admin/categories')).status === 401)
  check(
    'tạo category -> 201',
    (await req('/admin/categories', { method: 'POST', token, body: { name: 'Động vật', slug: 'dong-vat' } })).status ===
      201
  )
  const pubCats = await (await req('/categories')).json()
  check('public categories -> 1', pubCats.data.categories.length === 1)

  // ── Blogs: gating ──
  check('admin blogs không token -> 401', (await req('/admin/blogs')).status === 401)

  // ── Create blog ──
  const cb = await req('/admin/blogs', {
    method: 'POST',
    token,
    body: {
      slug: 'bai-viet-1',
      title: 'Bài viết 1',
      excerpt: 'Tóm tắt',
      content: '<p>Nội dung <strong>HTML</strong></p>',
      category: 'dong-vat',
      tags: ['a', 'b'],
      featured: true,
      publishedAt: '2026-05-01',
    },
  })
  check('tạo blog -> 201', cb.status === 201)
  const blogId = (await cb.json()).data.blog._id

  // ── Validation + dup ──
  check(
    'slug có khoảng trắng -> 422',
    (await req('/admin/blogs', { method: 'POST', token, body: { slug: 'sai slug', title: 'X' } })).status === 422
  )
  check(
    'slug trùng -> 409',
    (await req('/admin/blogs', { method: 'POST', token, body: { slug: 'bai-viet-1', title: 'Y' } })).status === 409
  )

  // ── Second blog (other category) ──
  await req('/admin/blogs', {
    method: 'POST',
    token,
    body: { slug: 'bai-viet-2', title: 'Bài viết 2', category: 'giao-duc' },
  })

  // ── Public list + filter ──
  const list = await (await req('/blogs')).json()
  check('public blogs -> 2', list.data.blogs.length === 2)
  const filtered = await (await req('/blogs?category=dong-vat')).json()
  check('lọc ?category=dong-vat -> 1', filtered.data.blogs.length === 1)

  // ── Public get by slug ──
  const gb = await req('/blogs/bai-viet-1')
  check('public get slug -> 200 + giữ HTML', gb.status === 200 && (await gb.json()).data.blog.content.includes('<strong>'))
  check('public get slug sai -> 404', (await req('/blogs/khong-co')).status === 404)

  // ── Hide via isActive ──
  await req(`/admin/blogs/${blogId}`, { method: 'PATCH', token, body: { isActive: false } })
  const list2 = await (await req('/blogs')).json()
  check('ẩn rồi -> public còn 1', list2.data.blogs.length === 1)

  // ── Delete ──
  check('xóa blog -> 204', (await req(`/admin/blogs/${blogId}`, { method: 'DELETE', token })).status === 204)
  check('xóa id sai -> 422', (await req('/admin/blogs/not-an-id', { method: 'DELETE', token })).status === 422)
} catch (e) {
  console.error('ERROR:', e)
  ok = false
} finally {
  await Promise.all([Admin.deleteMany({}), Blog.deleteMany({}), Category.deleteMany({})])
  server.close()
  await disconnectDB()
  console.log(ok ? '\n✅ ALL PASSED' : '\n❌ FAILED')
  process.exit(ok ? 0 : 1)
}
