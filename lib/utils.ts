export function cn(...inputs: any[]) {
  const classes: string[] = []
  for (const input of inputs.flat()) {
    if (!input) continue
    if (typeof input === 'string') classes.push(input)
    else if (Array.isArray(input)) classes.push(...input.filter(Boolean))
    else if (typeof input === 'object') {
      for (const [k, v] of Object.entries(input)) if (v) classes.push(k)
    }
  }
  return classes.join(' ')
}

export function downloadJson(data: unknown, filename = 'data.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadCsv(rows: any[] = [], filename = 'data.csv') {
  if (!Array.isArray(rows) || rows.length === 0) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(String(r[h] ?? ''))).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
