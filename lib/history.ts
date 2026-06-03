import type { TranscriptionResult } from '@/stores/transcription-store'

const HISTORY_KEY = 'vozia_history'

export function getHistory(): TranscriptionResult[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(HISTORY_KEY)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveToHistory(item: TranscriptionResult): void {
  const history = getHistory()
  const exists = history.find((h) => h.id === item.id)
  if (!exists) {
    history.unshift(item)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }
}

export function removeFromHistory(id: string): void {
  const history = getHistory()
  const filtered = history.filter((h) => h.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}

export function getStats() {
  const history = getHistory()
  const totalTranscriptions = history.length
  
  // Estimate minutes based on average file size (rough estimation)
  const totalMinutes = history.reduce((acc, item) => {
    // Assuming ~1MB per minute of audio on average
    const estimatedMinutes = (item.fileSize || 500000) / 1000000
    return acc + estimatedMinutes
  }, 0)
  
  const languages = new Set(history.map((h) => h.language).filter(Boolean))
  
  return {
    totalTranscriptions,
    totalMinutes: Math.round(totalMinutes * 10) / 10,
    languagesDetected: languages.size || 0,
  }
}
