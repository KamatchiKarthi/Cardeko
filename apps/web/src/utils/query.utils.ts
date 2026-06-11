export function buildSearchParams(params: object): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value === null || value === undefined || value === '') continue
    if (Array.isArray(value)) {
      if (value.length === 0) continue
      search.set(key, value.join(','))
      continue
    }
    search.set(key, String(value))
  }

  return search.toString()
}
