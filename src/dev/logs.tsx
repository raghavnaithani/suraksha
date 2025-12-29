import React from 'react'
import { Button } from '../../components/ui/button'
import { getEvents, clearEvents, downloadEvents } from '../lib/event-logger'

export default function DevLogs() {
  const [events, setEvents] = React.useState(() => getEvents())

  React.useEffect(() => {
    const onLogged = () => setEvents(getEvents())
    window.addEventListener('appEventLogged', onLogged as EventListener)
    window.addEventListener('appEventsCleared', onLogged as EventListener)
    return () => {
      window.removeEventListener('appEventLogged', onLogged as EventListener)
      window.removeEventListener('appEventsCleared', onLogged as EventListener)
    }
  }, [])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Dev Event Log</h2>
        <div className="flex gap-2 mb-4">
          <Button onClick={() => downloadEvents()}>Download JSON</Button>
          <Button variant="destructive" onClick={() => { clearEvents(); setEvents([]) }}>Clear Logs</Button>
        </div>
        <div className="space-y-2">
          {events.length === 0 && <div className="text-sm text-muted-foreground">No events</div>}
          {events.slice().reverse().map((e) => (
            <div key={e.id} className="p-3 border rounded bg-white">
              <div className="text-xs text-gray-500">{e.time} • {e.type}</div>
              <pre className="text-xs overflow-auto max-h-48">{JSON.stringify(e.payload, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
