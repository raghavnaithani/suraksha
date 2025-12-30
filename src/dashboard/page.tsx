import React from 'react'
import Layout from '../../components/Layout'
import { getEvents, clearEvents, downloadEvents } from '@lib/event-logger'

export default function DashboardPage(): JSX.Element {
  const [events, setEvents] = React.useState<any[]>([])

  React.useEffect(() => {
    setEvents(getEvents())
    const onLogged = (e: any) => {
      setEvents((s) => [...s, e.detail])
    }
    const onCleared = () => setEvents([])
    window.addEventListener('appEventLogged', onLogged as EventListener)
    window.addEventListener('appEventsCleared', onCleared as EventListener)
    return () => {
      window.removeEventListener('appEventLogged', onLogged as EventListener)
      window.removeEventListener('appEventsCleared', onCleared as EventListener)
    }
  }, [])

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Transparency Dashboard</h2>
        <div className="mb-4">Client-side event log snapshot. Useful for debugging and transparency during demos.</div>
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => downloadEvents()}>Download events</button>
          <button className="px-3 py-2 border rounded" onClick={() => { clearEvents(); setEvents([]) }}>Clear events</button>
        </div>

        <div className="border rounded p-4 bg-white">
          <div className="text-sm text-muted-foreground mb-2">Total events: {events.length}</div>
          <ul className="space-y-2">
            {events.slice().reverse().slice(0, 50).map((ev, idx) => (
              <li key={ev.id || idx} className="p-2 border rounded">
                <div className="text-xs text-muted-foreground">{ev.time} • {ev.id}</div>
                <div className="font-medium">{ev.type}</div>
                <pre className="text-xs mt-2 whitespace-pre-wrap">{JSON.stringify(ev.payload || {}, null, 2)}</pre>
              </li>
            ))}
            {events.length === 0 && <li className="text-sm text-muted-foreground">No events recorded yet.</li>}
          </ul>
        </div>
      </div>
    </Layout>
  )
}
