import { create } from 'zustand'

export interface TranscriptionResult {
  id: string
  filename: string
  transcription: string
  summary: string
  language: string
  createdAt: string
  fileSize?: number
}

interface TranscriptionState {
  currentResult: TranscriptionResult | null
  setCurrentResult: (result: TranscriptionResult | null) => void
  clearCurrentResult: () => void
}

export const useTranscriptionStore = create<TranscriptionState>((set) => ({
  currentResult: null,
  setCurrentResult: (result) => set({ currentResult: result }),
  clearCurrentResult: () => set({ currentResult: null }),
}))
