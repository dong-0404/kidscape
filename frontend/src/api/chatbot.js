// Public chatbot API. Suggestions reuse the shared apiFetch; the streaming `ask`
// endpoint needs raw fetch + a reader (apiFetch buffers the whole body).
import { apiFetch } from './client.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'

// GET /chat/suggestions -> [{ _id, question, answer }]
export async function getSuggestions() {
  const data = await apiFetch('/chat/suggestions')
  return data?.suggestions ?? []
}

const FRIENDLY_ERROR =
  'Xin lỗi, mình đang gặp chút trục trặc kết nối. Bạn thử lại sau một chút nhé!'

/**
 * Stream an answer from the chatbot. Reads the SSE response over fetch.
 * @param {string} question
 * @param {{ onDelta?:(t:string)=>void, onDone?:()=>void, onError?:(msg:string)=>void, signal?:AbortSignal }} cbs
 */
export async function streamAsk(question, { onDelta, onDone, onError, signal } = {}) {
  let res
  try {
    res = await fetch(`${BASE_URL}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') return
    onError?.(FRIENDLY_ERROR)
    return
  }

  // Non-OK (503 unavailable, 429 rate-limited, 422 validation) → JSON error body.
  if (!res.ok || !res.body) {
    let message = FRIENDLY_ERROR
    try {
      const body = await res.json()
      message = body?.error?.message || message
    } catch {
      /* keep default */
    }
    onError?.(message)
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    onDone?.()
  }

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // SSE frames are separated by a blank line.
      let sep
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, sep)
        buffer = buffer.slice(sep + 2)
        handleFrame(frame, { onDelta, onDone: finish, onError })
      }
    }
    finish()
  } catch (err) {
    if (err?.name === 'AbortError') return
    onError?.(FRIENDLY_ERROR)
  }
}

// Parse one SSE frame ("event: x\ndata: {...}") and dispatch.
function handleFrame(frame, { onDelta, onDone, onError }) {
  let event = 'message'
  let dataLine = ''
  for (const line of frame.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) dataLine += line.slice(5).trim()
  }
  if (!dataLine) return

  let payload
  try {
    payload = JSON.parse(dataLine)
  } catch {
    return
  }

  if (event === 'error') onError?.(payload.message || FRIENDLY_ERROR)
  else if (event === 'done') onDone?.()
  else if (payload.delta) onDelta?.(payload.delta)
}
