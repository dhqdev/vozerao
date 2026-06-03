'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronDown, Settings2, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { AudioUploader } from '@/components/audio-uploader'
import { LoadingOverlay } from '@/components/loading-overlay'
import { useTranscriptionStore } from '@/stores/transcription-store'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://back-transcricao.vercel.app'

const audioLanguages = [
  { value: 'auto', label: 'Auto-detectar' },
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'Inglês' },
  { value: 'es', label: 'Espanhol' },
  { value: 'fr', label: 'Francês' },
  { value: 'de', label: 'Alemão' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: 'Japonês' },
  { value: 'zh', label: 'Chinês' },
]

const summaryLanguages = [
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'Inglês' },
]

const loadingMessages = [
  'Enviando áudio...',
  'Transcrevendo com Whisper AI...',
  'Gerando resumo com GPT-4...',
  'Finalizando...',
]

export default function TranscreverPage() {
  const router = useRouter()
  const { setCurrentResult } = useTranscriptionStore()
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [audioLanguage, setAudioLanguage] = useState('auto')
  const [summaryLanguage, setSummaryLanguage] = useState('pt')
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<string[]>([loadingMessages[0]])

  // Cycle through loading messages
  useEffect(() => {
    if (!isLoading) return

    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length
      setCurrentMessage([loadingMessages[index]])
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoading])

  const handleTranscribe = useCallback(async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setCurrentMessage([loadingMessages[0]])

    const formData = new FormData()
    formData.append('file', selectedFile)
    
    if (audioLanguage !== 'auto') {
      formData.append('language', audioLanguage)
    }
    formData.append('summary_language', summaryLanguage)

    try {
      const response = await axios.post(
        `${API_URL}/transcribe-and-summarize`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000, // 5 minutes timeout
        }
      )

      const result = {
        id: crypto.randomUUID(),
        filename: selectedFile.name,
        transcription: response.data.transcription || response.data.transcript || '',
        summary: response.data.summary || '',
        language: response.data.language || audioLanguage,
        createdAt: new Date().toISOString(),
        fileSize: selectedFile.size,
      }

      setCurrentResult(result)
      toast.success('Transcrição concluída com sucesso!')
      router.push('/resultado')
    } catch (error) {
      console.error('[v0] Transcription error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.error || 'Erro ao processar o áudio. Tente novamente.'
        toast.error(message)
      } else {
        toast.error('Erro inesperado. Por favor, tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [selectedFile, audioLanguage, summaryLanguage, setCurrentResult, router])

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Nova Transcrição
          </h1>
          <p className="text-muted-foreground">
            Faça upload do seu áudio e receba a transcrição e resumo automaticamente
          </p>
        </div>

        {/* Upload Area */}
        <AudioUploader
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />

        {/* Options */}
        <Collapsible open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-center gap-2">
                <Settings2 size={18} />
                <span>Opções de configuração</span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  isOptionsOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Idioma do áudio</Label>
                  <Select value={audioLanguage} onValueChange={setAudioLanguage}>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audioLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Idioma do resumo</Label>
                  <Select value={summaryLanguage} onValueChange={setSummaryLanguage}>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {summaryLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        {/* Submit Button */}
        <Button
          size="lg"
          disabled={!selectedFile || isLoading}
          onClick={handleTranscribe}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-white font-semibold py-6 text-lg disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              Processando...
            </div>
          ) : (
            'Transcrever e Resumir'
          )}
        </Button>
      </motion.div>

      <LoadingOverlay isLoading={isLoading} messages={currentMessage} />
    </div>
  )
}
