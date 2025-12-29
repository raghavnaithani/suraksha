import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { useToast } from '@lib/use-toast'

export default function SosQueueInspector() {
  const [queue, setQueue] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const raw = localStorage.getItem('sos_queue') || '[]'
    try {
      setQueue(JSON.parse(raw))
    } catch (e) {
      setQueue([])
    }
  }, [])

  const clearQueue = () => {
    localStorage.removeItem('sos_queue')
    setQueue([])
    toast({ title: 'Cleared', description: 'SOS queue cleared (dev).' })
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">SOS Queue (dev inspector)</h2>
        <div className="mb-4">
          <Button onClick={clearQueue} variant="destructive">Clear Queue</Button>
        </div>
        <div className="space-y-2">
          {queue.length === 0 && <div className="text-sm text-muted-foreground">Queue is empty</div>}
          {queue.map((item) => (
            <div key={item.id} className="p-3 border rounded bg-white">
              <div className="text-xs text-gray-500">{item.id} • {new Date(item.timestamp).toLocaleString()}</div>
              <pre className="text-xs overflow-auto max-h-36">{JSON.stringify(item.payload, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
