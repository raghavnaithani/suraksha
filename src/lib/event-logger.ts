// Simple event logger stored in localStorage for dev auditing
export type EventRecord = {
  id: string
  time: string
  type: string
  payload?: any
}

const LOG_KEY = 'app_event_log'

function read(): EventRecord[] {
  try {
    const raw = localStorage.getItem(LOG_KEY) || '[]'
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function write(records: EventRecord[]) {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(records))
  } catch (e) {
    // ignore
  }
}

export function logEvent(type: string, payload?: any) {
  try {
    const records = read()
    const rec: EventRecord = { id: `evt-${Date.now()}`, time: new Date().toISOString(), type, payload }
    records.push(rec)
    // cap events to recent 500 records
    if (records.length > 500) records.splice(0, records.length - 500)
    write(records)
    // emit a window event for listeners
    try {
      window.dispatchEvent(new CustomEvent('appEventLogged', { detail: rec }))
    } catch (e) {}
  } catch (e) {}
}

export function getEvents() {
  return read()
}

export function clearEvents() {
  try {
    localStorage.removeItem(LOG_KEY)
    window.dispatchEvent(new CustomEvent('appEventsCleared'))
  } catch (e) {}
}

export function downloadEvents(filename = 'suraksha-events.json') {
  const data = JSON.stringify(read(), null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
