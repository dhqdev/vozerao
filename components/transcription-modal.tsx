'use client'

import { FileText, Sparkles, Copy, Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import type { TranscriptionResult } from '@/stores/transcription-store'
import { formatDate } from '@/lib/format-date'

interface TranscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  data: TranscriptionResult | null
}

export function TranscriptionModal({ isOpen, onClose, data }: TranscriptionModalProps) {
  if (!data) return null

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

  const wordCount = data.transcription.split(/\s+/).filter(Boolean).length
  const charCount = data.transcription.length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-foreground">{data.filename}</h2>
                {data.language && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {data.language}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 grid md:grid-cols-2 gap-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Transcrição */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-primary" />
                  <h3 className="font-semibold text-foreground">Transcrição Completa</h3>
                </div>
                <ScrollArea className="h-64 rounded-lg bg-background/50 p-4">
                  <p className="text-sm text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed">
                    {data.transcription}
                  </p>
                </ScrollArea>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {wordCount} palavras • {charCount} caracteres
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(data.transcription, 'Transcrição')}
                    >
                      <Copy size={14} className="mr-1" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTxt(data.transcription, `${data.filename}-transcricao.txt`)}
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {/* Resumo */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} className="text-accent" />
                  <h3 className="font-semibold text-foreground">Resumo Inteligente</h3>
                </div>
                <ScrollArea className="h-64 rounded-lg bg-background/50 p-4">
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {data.summary}
                  </p>
                </ScrollArea>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <Badge variant="secondary" className="text-xs">
                    Gerado por GPT-4o Mini
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(data.summary, 'Resumo')}
                    >
                      <Copy size={14} className="mr-1" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTxt(data.summary, `${data.filename}-resumo.txt`)}
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Criado em {formatDate(data.createdAt)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
