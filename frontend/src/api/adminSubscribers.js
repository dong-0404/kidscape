// Admin management of newsletter subscribers (all require auth).
import { apiFetch, tokenStore, API_BASE_URL } from './client.js'

export function listSubscribers() {
  return apiFetch('/admin/subscribers', { auth: true }).then((d) => d.subscribers)
}
export function deleteSubscriber(id) {
  return apiFetch(`/admin/subscribers/${id}`, { method: 'DELETE', auth: true })
}

// Download the subscriber list as a CSV file (raw fetch → Blob → save).
export async function exportSubscribersCsv() {
  const res = await fetch(`${API_BASE_URL}/admin/subscribers/export`, {
    headers: { Authorization: `Bearer ${tokenStore.get()}` },
  })
  if (!res.ok) throw new Error('Không tải được tệp CSV.')
  const blob = await res.blob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'kidscape-subscribers.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
