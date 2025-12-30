// Schema definitions for structured complaint types
export type FieldDef = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'phone' | 'date'
  required?: boolean
  options?: string[]
  hint?: string
}

export type ComplaintType = {
  id: string
  title: string
  description?: string
  fields: FieldDef[]
}

export const COMPLAINT_TYPES: ComplaintType[] = [
  {
    id: 'harassment',
    title: 'Harassment / Assault',
    description: 'Report harassment, assault, or threatening behaviour.',
    fields: [
      { name: 'incident_date', label: 'Date of incident', type: 'date', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'perpetrator_description', label: 'Perpetrator description', type: 'textarea' },
      { name: 'witnesses', label: 'Witnesses (if any)', type: 'textarea' },
    ],
  },
  {
    id: 'theft',
    title: 'Theft / Property Loss',
    description: 'Report stolen or lost property during service interaction.',
    fields: [
      { name: 'incident_date', label: 'Date of incident', type: 'date', required: true },
      { name: 'item_description', label: 'Item description', type: 'textarea', required: true },
      { name: 'value_estimate', label: 'Estimated value', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
    ],
  },
  {
    id: 'safety',
    title: 'Unsafe Conditions',
    description: 'Report dangerous or unsafe working or service conditions.',
    fields: [
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'hazard_type', label: 'Type of hazard', type: 'select', options: ['Road', 'Vehicle', 'Equipment', 'Other'] },
      { name: 'details', label: 'Details', type: 'textarea' },
    ],
  },
]
