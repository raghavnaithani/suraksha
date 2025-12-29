import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth-context'
import { useToast } from '@lib/use-toast'
import { apiPost } from '@lib/use-api'

export default function SosPage({ anonymous }: { anonymous?: boolean }) {
  const auth = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSend = async () => {
    try {
      console.log('[SOS] Sending SOS', { anonymous, user: auth.user })
      const payload = { anonymous: !!anonymous, user: auth.user ?? null, location: null }
      const res = await apiPost('/api/sos', payload)
      if (res && res.queued) {
        toast({ title: 'SOS queued', description: 'SOS was queued locally and will be sent when online.' })
      } else {
        toast({ title: 'SOS sent', description: 'Emergency alert sent (demo).' })
      }
    } catch (e) {
      console.warn('[SOS] send failed', e)
      toast({ title: 'SOS failed', description: 'Unable to send SOS. Please try again.' })
    } finally {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-red-600">Emergency SOS</h2>
        <p className="mt-2 text-sm text-gray-600">This will notify your configured emergency contacts and nearby authorities.</p>
        <div className="mt-6">
          <button onClick={handleSend} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded">Send SOS</button>
        </div>
        <div className="mt-4 text-xs text-gray-500">Mode: {anonymous ? 'Anonymous' : auth.user?.identityMode ?? 'Unknown'}</div>
      </div>
    </div>
  )
}
