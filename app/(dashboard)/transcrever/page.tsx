'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronDown, Settings2, Loader2, Sparkles, Zap } from 'lucide-react'
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
import { generateTitle } from '@/lib/history'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://back-transcricao.vercel.app'

const audioLanguages = [
  { value: 'auto', label: 'Auto-detectar', flag: '🌐' },
  { value: 'pt', label: 'Português', flag: '🇧🇷' },
  { value: 'en', label: 'Inglês', flag: '🇺🇸' },
  { value: 'es', label: 'Espanhol', flag: '🇪🇸' },
  { value: 'fr', label: 'Francês', flag: '🇫🇷' },
  { value: 'de', label: 'Alemão', flag: '🇩🇪' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'ja', label: 'Japonês', flag: '🇯🇵' },
  { value: 'zh', label: 'Chinês', flag: '🇨🇳' },
]

const summaryLanguages = [
  { value: 'pt', label: 'Português', flag: '🇧🇷' },
  { value: 'en', label: 'Inglês', flag: '🇺🇸' },
]

const loadingMessages = [
  'Enviando áudio para processamento...',
  'Transcrevendo com Whisper AI...',
  'Analisando conteúdo...',
  'Gerando resumo inteligente com GPT-4...',
  'Quase lá...',
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
          timeout: 300000,
        }
      )

      const transcription = response.data.transcription || response.data.transcript || ''
      const title = generateTitle(transcription, selectedFile.name)

      const result = {
        id: crypto.randomUUID(),
        filename: selectedFile.name,
        title,
        transcription,
        summary: response.data.summary || '',
        language: response.data.language || audioLanguage,
        createdAt: new Date().toISOString(),
        fileSize: selectedFile.size,
        chatHistory: [],
      }

      setCurrentResult(result)
      toast.success('Transcrição concluída!')
      router.push('/resultado')
    } catch (error) {
      console.error('[v0] Transcription error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.error || 'Erro ao processar o áudio.'
        toast.error(message)
      } else {
        toast.error('Erro inesperado. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [selectedFile, audioLanguage, summaryLanguage, setCurrentResult, router])

  return (
    <div className="p-4 md:p-8 pb-24 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25"
          >
            <Sparkles size={28} className="text-white" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Nova Transcrição
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Faça upload do seu áudio e receba transcrição + resumo inteligente em segundos
          </p>
        </div>

        {/* Features Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            { icon: Zap, label: 'Whisper AI' },
            { icon: Sparkles, label: 'GPT-4 Resumo' },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm text-muted-foreground"
            >
              <feature.icon size={14} className="text-primary" />
              {feature.label}
            </div>
          ))}
        </motion.div>

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
              className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground rounded-xl h-12"
            >
              <div className="flex items-center gap-2">
                <Settings2 size={18} />
                <span>Configurações avançadas</span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  isOptionsOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-foreground text-sm font-medium">
                    Idioma do áudio
                  </Label>
                  <Select value={audioLanguage} onValueChange={setAudioLanguage}>
                    <SelectTrigger className="bg-background/50 border-border/50 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audioLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Auto-detectar funciona para 99+ idiomas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground text-sm font-medium">
                    Idioma do resumo
                  </Label>
                  <Select value={summaryLanguage} onValueChange={setSummaryLanguage}>
                    <SelectTrigger className="bg-background/50 border-border/50 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {summaryLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </span>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            size="lg"
            disabled={!selectedFile || isLoading}
            onClick={handleTranscribe}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-white font-semibold py-7 text-lg disabled:opacity-50 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 size={22} className="animate-spin" />
                Processando...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles size={22} />
                Transcrever e Resumir
              </div>
            )}
          </Button>
        </motion.div>

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground">
          Suporta MP3, WAV, M4A, WEBM, OGG, FLAC - Máximo 24MB
        </p>
      </motion.div>

      <LoadingOverlay isLoading={isLoading} messages={currentMessage} />
    </div>
  )
}
