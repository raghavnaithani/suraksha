import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth-context'
import { getQueueLength } from '../../src/lib/sos-queue'

export default function SosButton() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [queueLength, setQueueLength] = useState<number>(0)

  useEffect(() => {
    // read initial queue length
    try {
      setQueueLength(getQueueLength())
    } catch (e) {}

    const onUpdate = (e: any) => {
      try {
        setQueueLength(getQueueLength())
      } catch (err) {}
    }
    window.addEventListener('sosQueueUpdated', onUpdate as EventListener)
    window.addEventListener('sosQueueUpdated', onUpdate as EventListener)
    window.addEventListener('storage', onUpdate as EventListener)
    return () => {
      window.removeEventListener('sosQueueUpdated', onUpdate as EventListener)
      window.removeEventListener('sosQueueUpdated', onUpdate as EventListener)
      window.removeEventListener('storage', onUpdate as EventListener)
    }
  }, [])

  const handleClick = () => {
    try {
      console.log('[SOS] button pressed, user:', auth.user)
    } catch (e) {}
    if (auth && auth.isAuthenticated) navigate('/sos')
    else navigate('/sos-anonymous')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        aria-label="Emergency SOS"
        onClick={handleClick}
        className="relative w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center ring-4 ring-red-200"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v6" />
          <path d="M12 22v-6" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      {queueLength > 0 && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {queueLength}
        </div>
      )}
    </div>
  )
}
