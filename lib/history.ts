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

export function updateHistory(id: string, updates: Partial<TranscriptionResult>): void {
  const history = getHistory()
  const index = history.findIndex((h) => h.id === id)
  if (index !== -1) {
    history[index] = { ...history[index], ...updates }
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
  
  // Estimate minutes based on word count (150 words/min average)
  const totalMinutes = history.reduce((acc, item) => {
    const wordCount = item.transcription?.split(/\s+/).length || 0
    const estimatedMinutes = wordCount / 150
    return acc + estimatedMinutes
  }, 0)
  
  const languages = new Set(history.map((h) => h.language).filter(Boolean))
  
  return {
    totalTranscriptions,
    totalMinutes: Math.round(totalMinutes * 10) / 10,
    languagesDetected: languages.size || 0,
  }
}

// Generate title from transcription content
export function generateTitle(transcription: string, filename: string): string {
  if (!transcription || transcription.length < 20) {
    return filename.replace(/\.[^/.]+$/, '')
  }

  // Get first sentence or first ~50 chars
  const firstSentence = transcription.split(/[.!?]/)[0]?.trim() || ''
  
  if (firstSentence.length > 5 && firstSentence.length <= 60) {
    return firstSentence
  }
  
  // Extract key words from beginning
  const words = transcription.slice(0, 200).split(/\s+/).slice(0, 8)
  let title = words.join(' ')
  
  if (title.length > 50) {
    title = title.slice(0, 47) + '...'
  }
  
  return title || filename.replace(/\.[^/.]+$/, '')
}
