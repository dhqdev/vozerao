'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Copy, Download, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTranscriptionStore } from '@/stores/transcription-store'
import { saveToHistory } from '@/lib/history'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    },
  }),
}

export default function ResultadoPage() {
  const router = useRouter()
  const { currentResult, clearCurrentResult } = useTranscriptionStore()

  useEffect(() => {
    if (!currentResult) {
      router.push('/transcrever')
    }
  }, [currentResult, router])

  if (!currentResult) {
    return null
  }

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(`${type} copiado para a área de transferência!`)
  }

  const downloadTxt = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Download iniciado!')
  }

  const handleSaveToHistory = () => {
    saveToHistory(currentResult)
    toast.success('Salvo no histórico com sucesso!')
  }

  const handleNewTranscription = () => {
    clearCurrentResult()
    router.push('/transcrever')
  }

  const wordCount = currentResult.transcription.split(/\s+/).filter(Boolean).length
  const charCount = currentResult.transcription.length

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
              {currentResult.filename}
            </h1>
            {currentResult.language && (
              <Badge variant="secondary" className="bg-primary/20 text-primary shrink-0">
                {currentResult.language.toUpperCase()}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Transcrição */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                <FileText size={20} className="text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Transcrição Completa
              </h2>
            </div>

            <ScrollArea className="h-80 rounded-lg bg-background/50 p-4 mb-4">
              <p className="text-sm text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed">
                {currentResult.transcription}
              </p>
            </ScrollArea>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {wordCount} palavras • {charCount} caracteres
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(currentResult.transcription, 'Transcrição')}
                  className="flex-1 sm:flex-none"
                >
                  <Copy size={14} className="mr-1" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTxt(currentResult.transcription, `${currentResult.filename}-transcricao.txt`)}
                  className="flex-1 sm:flex-none"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Resumo */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-primary">
                <Sparkles size={20} className="text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Resumo Inteligente
              </h2>
            </div>

            <ScrollArea className="h-80 rounded-lg bg-background/50 p-4 mb-4">
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {currentResult.summary}
              </p>
            </ScrollArea>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
              <Badge variant="secondary" className="text-xs w-fit">
                Gerado por GPT-4o Mini
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(currentResult.summary, 'Resumo')}
                  className="flex-1 sm:flex-none"
                >
                  <Copy size={14} className="mr-1" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTxt(currentResult.summary, `${currentResult.filename}-resumo.txt`)}
                  className="flex-1 sm:flex-none"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Button
            variant="outline"
            onClick={handleNewTranscription}
            className="flex-1 sm:flex-none"
          >
            <ArrowLeft size={18} className="mr-2" />
            Nova Transcrição
          </Button>
          <Button
            onClick={handleSaveToHistory}
            className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
          >
            <Save size={18} className="mr-2" />
            Salvar no Histórico
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
