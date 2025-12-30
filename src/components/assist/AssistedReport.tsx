import React from 'react'
import { apiPost } from '@lib/use-api'
import { useToast } from '@lib/use-toast'

type Step = 1 | 2 | 3

export default function AssistedReport(): JSX.Element {
  const [step, setStep] = React.useState<Step>(1)
  const [location, setLocation] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [contact, setContact] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const toast = useToast()

  async function handleSubmit() {
    setLoading(true)
    try {
      const payload = { location, description, contact, assisted: true, timestamp: new Date().toISOString() }
      const res: any = await apiPost('/api/sos', payload)
      if (res && res.queued) {
        toast.toast({ title: 'SOS queued', description: 'Network unavailable — SOS saved and will be retried.' })
      } else {
        toast.toast({ title: 'SOS sent', description: 'Emergency report has been sent successfully.' })
      }
      // log minimal local event
      try {
        const mod = await import('../../lib/event-logger')
        mod.logEvent('assisted_sos_sent', { payload, result: res })
      } catch (e) {}
      setStep(3)
    } catch (err) {
      toast.toast({ title: 'Error', description: 'Failed to send SOS. It may be queued.' })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Assisted Emergency Reporting</h2>
      <div className="mb-4">Step {step} of 3</div>

      {step === 1 && (
        <div>
          <label className="block mb-2">Location</label>
          <input autoFocus value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded" placeholder="Where are you?" />
          <div className="flex justify-end mt-4">
            <button onClick={() => setStep(2)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={4} placeholder="Briefly describe what's happening"></textarea>
          <label className="block mt-3 mb-2">Contact (optional)</label>
          <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full p-2 border rounded" placeholder="Phone or email" />
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(1)} className="px-4 py-2 border rounded">Back</button>
            <button onClick={() => handleSubmit()} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded">{loading ? 'Sending...' : 'Send SOS'}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="mb-4">Thank you. Your report has been processed (or queued).</p>
          <div className="flex gap-2">
            <button onClick={() => { setStep(1); setLocation(''); setDescription(''); setContact('') }} className="px-4 py-2 border rounded">Report another</button>
          </div>
        </div>
      )}
    </div>
  )
}
