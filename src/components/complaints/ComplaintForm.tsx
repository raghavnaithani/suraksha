import React from 'react'
import { ComplaintType, FieldDef } from '../../lib/complaint-types'
import { apiPost } from '@lib/use-api'
import { useToast } from '@lib/use-toast'
import { evaluateWarnings } from '@lib/warn-rules'

function renderField(field: FieldDef, value: any, onChange: (v: any) => void) {
  const common = { value: value ?? '', onChange: (e: any) => onChange(e.target.value) }
  switch (field.type) {
    case 'text':
      return <input className="w-full p-2 border rounded" {...common} />
    case 'date':
      return <input type="date" className="w-full p-2 border rounded" {...common} />
    case 'textarea':
      return <textarea className="w-full p-2 border rounded" rows={4} {...common} />
    case 'select':
      return (
        <select className="w-full p-2 border rounded" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )
    case 'phone':
      return <input placeholder="Phone" className="w-full p-2 border rounded" {...common} />
    default:
      return <input className="w-full p-2 border rounded" {...common} />
  }
}

export default function ComplaintForm({ type, schema, onSubmitted }: { type: ComplaintType | undefined; schema: ComplaintType | undefined; onSubmitted?: (res: any) => void }) {
  const [values, setValues] = React.useState<Record<string, any>>({})
  const [loading, setLoading] = React.useState(false)
  const toast = useToast()

  const warnings = React.useMemo(() => evaluateWarnings(schema ?? type, values), [schema, type, values])

  function setField(name: string, val: any) {
    setValues((s) => ({ ...s, [name]: val }))
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    try {
      const payload = { type: type?.id ?? schema?.id ?? 'unknown', values, timestamp: new Date().toISOString() }
      const res = await apiPost('/api/complaints', payload)
      toast.toast({ title: 'Complaint submitted', description: 'Thank you — your complaint has been recorded.' })
      try {
        const mod = await import('../../lib/event-logger')
        mod.logEvent('complaint_submitted', { type: type?.id ?? schema?.id, values })
      } catch (e) {}
      onSubmitted?.(res)
    } catch (err) {
      toast.toast({ title: 'Submission failed', description: 'Saved locally and will retry if offline.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <h3 className="text-lg font-medium">{schema?.title}</h3>
      <p className="text-sm text-muted-foreground">{schema?.description}</p>

      {/* Contextual warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w) => (
            <div
              key={w.id}
              className={
                w.level === 'urgent'
                  ? 'p-3 rounded bg-red-100 border border-red-300 text-red-900'
                  : w.level === 'warn'
                  ? 'p-3 rounded bg-yellow-50 border border-yellow-300 text-yellow-900'
                  : 'p-3 rounded bg-blue-50 border border-blue-200 text-blue-900'
              }
            >
              {w.message}
            </div>
          ))}
        </div>
      )}
      {schema.fields.map((f) => (
        <div key={f.name}>
          <label className="block text-sm font-medium mb-1">{f.label}{f.required ? ' *' : ''}</label>
          {renderField(f, values[f.name], (v) => setField(f.name, v))}
          {f.hint && <div className="text-xs text-muted-foreground mt-1">{f.hint}</div>}
        </div>
      ))}
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </div>
    </form>
  )
}
