// End-to-end chat test. Requires a reachable MongoDB at process.env.MONGODB_URI
// (CI provides a `mongo` service; locally use the memory-server wrapper).
// Intentionally leaves GEMINI_API_KEY unset → exercises the 503 + canned fast-path.
process.env.NODE_ENV = process.env.NODE_ENV || 'test'
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kidscape_chat_test'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_long_enough_for_tests_only_123'
delete process.env.GEMINI_API_KEY

const { connectDB, disconnectDB } = await import('../src/config/db.js')
const Admin = (await import('../src/models/Admin.js')).default
const KnowledgeBase = (await import('../src/models/KnowledgeBase.js')).default
const ChatbotSuggestion = (await import('../src/models/ChatbotSuggestion.js')).default
const { createApp } = await import('../src/app.js')

let ok = true
const check = (label, cond) => {
  console.log(`${cond ? '✓' : '✗'} ${label}`)
  if (!cond) ok = false
}

await connectDB()
await Promise.all([Admin.deleteMany({}), KnowledgeBase.deleteMany({}), ChatbotSuggestion.deleteMany({})])

const EMAIL = 'chat-e2e@kidscape.vn'
const PASS = 'ChangeMe123!'
await Admin.create({ name: 'Chat E2E', email: EMAIL, passwordHash: await Admin.hashPassword(PASS) })

const server = createApp().listen(0)
await new Promise((r) => server.once('listening', r))
const base = `http://127.0.0.1:${server.address().port}/api`

const req = (path, { method = 'GET', body, token } = {}) =>
  fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

// Read an SSE response fully into a string.
async function readSse(res) {
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let out = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    out += decoder.decode(value, { stream: true })
  }
  return out
}

try {
  const token = (await (await req('/auth/login', { method: 'POST', body: { email: EMAIL, password: PASS } })).json())
    .data.token

  // ── Admin auth gating ──
  check('admin list không token -> 401', (await req('/admin/chat/suggestions')).status === 401)

  // ── Admin create suggestion ──
  const cs = await req('/admin/chat/suggestions', {
    method: 'POST',
    token,
    body: { question: 'KidScape là gì?', answer: 'Là thương hiệu đồ chơi giáo dục đa giác quan.' },
  })
  check('tạo suggestion -> 201', cs.status === 201)
  const suggestionId = (await cs.json()).data.suggestion._id || (await cs.clone?.().json?.())

  // ── Admin create KB ──
  const ck = await req('/admin/chat/kb', {
    method: 'POST',
    token,
    body: { title: 'Độ tuổi', content: 'Sản phẩm cho trẻ 3-6 tuổi.' },
  })
  check('tạo KB -> 201', ck.status === 201)

  // ── Validation ──
  check(
    'tạo suggestion thiếu answer -> 422',
    (await req('/admin/chat/suggestions', { method: 'POST', token, body: { question: 'x' } })).status === 422
  )

  // ── Public suggestions list ──
  const ps = await req('/chat/suggestions')
  const psj = await ps.json()
  check('public suggestions -> 200 + list', ps.status === 200 && Array.isArray(psj.data.suggestions) && psj.data.suggestions.length === 1)
  check('public list không lộ isActive field', psj.data.suggestions[0].isActive === undefined)

  // ── ask: empty question -> 422 ──
  check('ask rỗng -> 422', (await req('/chat/ask', { method: 'POST', body: { question: '   ' } })).status === 422)

  // ── ask: canned fast-path streams the stored answer WITHOUT a Gemini key ──
  const askRes = await req('/chat/ask', { method: 'POST', body: { question: 'KidScape là gì?' } })
  check('ask câu trùng suggestion -> 200 SSE', askRes.status === 200 && askRes.headers.get('content-type').includes('text/event-stream'))
  const sse = await readSse(askRes)
  check('SSE chứa đáp án sẵn', sse.includes('đồ chơi giáo dục đa giác quan'))
  check('SSE có event done', sse.includes('event: done'))

  // ── ask: free question with NO key + not canned -> still opens SSE but no Gemini.
  //    Without a key the controller returns JSON 503 before streaming. ──
  const askFree = await req('/chat/ask', { method: 'POST', body: { question: 'Thời tiết hôm nay thế nào?' } })
  check('ask khi thiếu GEMINI_API_KEY -> 503', askFree.status === 503)

  // ── Admin delete ──
  const adminList = (await (await req('/admin/chat/suggestions', { token })).json()).data.suggestions
  const delId = adminList[0]._id
  check('xóa suggestion -> 204', (await req(`/admin/chat/suggestions/${delId}`, { method: 'DELETE', token })).status === 204)
  check('xóa id không hợp lệ -> 422', (await req('/admin/chat/suggestions/not-an-id', { method: 'DELETE', token })).status === 422)
} catch (e) {
  console.error('ERROR:', e)
  ok = false
} finally {
  await Promise.all([Admin.deleteMany({}), KnowledgeBase.deleteMany({}), ChatbotSuggestion.deleteMany({})])
  server.close()
  await disconnectDB()
  console.log(ok ? '\n✅ ALL PASSED' : '\n❌ FAILED')
  process.exit(ok ? 0 : 1)
}
