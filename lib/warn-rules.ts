// Lightweight rule engine for contextual warnings in ComplaintForm
export type Warning = { id: string; level: 'info' | 'warn' | 'urgent'; message: string }

export function evaluateWarnings(schema: any, values: Record<string, any>): Warning[] {
  const warnings: Warning[] = []
  try {
    const desc = String(values?.description || '').toLowerCase()
    // Urgent keywords
    if (desc.match(/\b(assault|rape|violence|attack|stabbing|shooting)\b/)) {
      warnings.push({ id: 'urgent-violence', level: 'urgent', message: 'Report mentions violence — consider contacting emergency services immediately.' })
    }

    // If schema expects a phone but user didn't provide contact
    if (!values?.contact) {
      const hasPhone = (schema?.fields || []).some((f: any) => f.type === 'phone' || f.name === 'contact' || f.name === 'phone')
      if (hasPhone) warnings.push({ id: 'missing-contact', level: 'info', message: 'Providing a contact helps responders reach you.' })
    }

    // If there is a date field and the date is clearly in the past
    const dateField = (schema?.fields || []).find((f: any) => f.type === 'date')
    if (dateField && values?.[dateField.name]) {
      const d = new Date(values[dateField.name])
      if (!Number.isNaN(d.getTime())) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (d < yesterday) warnings.push({ id: 'past-date', level: 'warn', message: 'The incident date is in the past; include as much detail as possible about timing.' })
      }
    }
  } catch (e) {
    // swallow errors — engine is intentionally simple
  }
  return warnings
}
