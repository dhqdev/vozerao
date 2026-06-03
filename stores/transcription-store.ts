import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface TranscriptionResult {
  id: string
  filename: string
  title: string
  transcription: string
  summary: string
  language: string
  createdAt: string
  fileSize?: number
  duration?: number
  chatHistory?: ChatMessage[]
}

interface TranscriptionState {
  currentResult: TranscriptionResult | null
  setCurrentResult: (result: TranscriptionResult | null) => void
  clearCurrentResult: () => void
  addChatMessage: (message: ChatMessage) => void
}

export const useTranscriptionStore = create<TranscriptionState>((set) => ({
  currentResult: null,
  setCurrentResult: (result) => set({ currentResult: result }),
  clearCurrentResult: () => set({ currentResult: null }),
  addChatMessage: (message) =>
    set((state) => ({
      currentResult: state.currentResult
        ? {
            ...state.currentResult,
            chatHistory: [...(state.currentResult.chatHistory || []), message],
          }
        : null,
    })),
}))
