import { logEvent } from './event-logger'

const QUEUE_KEY = 'sos_queue'
const MAX_SOS_QUEUE = 50

function readQueue(): any[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY) || '[]'
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function writeQueue(q: any[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
    window.dispatchEvent(new CustomEvent('sosQueueUpdated', { detail: { length: q.length } }))
  } catch (e) {
    console.warn('sos-queue: write failed', e)
  }
}

export function enqueue(payload: any) {
  const queue = readQueue()
  const entry = { id: `sos-${Date.now()}`, payload, timestamp: new Date().toISOString(), status: 'queued' }
  queue.push(entry)
  if (queue.length > MAX_SOS_QUEUE) {
    const removed = queue.splice(0, queue.length - MAX_SOS_QUEUE)
    logEvent('sos_queue_trimmed', { removed: removed.length })
  }
  writeQueue(queue)
  logEvent('sos_enqueued', entry)
  return entry
}

export function getQueue() {
  return readQueue()
}

export function getQueueLength() {
  return readQueue().length
}

async function sendToServer(entry: any) {
  try {
    const res = await fetch('/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry.payload),
    })
    if (!res.ok) throw new Error('send failed')
    const data = await res.json()
    return { success: true, data }
  } catch (e) {
    return { success: false, error: e }
  }
}

export async function flushQueue() {
  const queue = readQueue()
  if (!queue.length) return { flushed: 0 }
  const remaining: any[] = []
  let flushed = 0
  for (const entry of queue) {
    const r = await sendToServer(entry)
    if (r.success) {
      flushed++
      logEvent('sos_sent_flushed', { id: entry.id })
    } else {
      remaining.push(entry)
    }
  }
  writeQueue(remaining)
  logEvent('sos_flush_attempt', { flushed, remaining: remaining.length })
  return { flushed, remaining: remaining.length }
}

let _processor: number | null = null

export function startProcessor(intervalMs = 60_000) {
  if (_processor) return
  _processor = window.setInterval(async () => {
    try {
      if (navigator.onLine) {
        await flushQueue()
      }
    } catch (e) {}
  }, intervalMs)
  logEvent('sos_processor_started', { intervalMs })
}

export function stopProcessor() {
  if (_processor) {
    clearInterval(_processor)
    _processor = null
    logEvent('sos_processor_stopped')
  }
}
