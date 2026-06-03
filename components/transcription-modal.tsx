'use client'

import { FileText, Sparkles, Copy, Download, X, Globe, Clock, Target, TrendingUp, Lightbulb } from 'lucide-react'
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
    toast.success(`${type} copiado!`)
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
  const estimatedDuration = Math.ceil(wordCount / 150)

  // Parse summary for better display
  const summaryLines = data.summary.split(/[.!?]+/).filter(s => s.trim().length > 10)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border/50">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shrink-0">
                  <FileText size={22} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-foreground truncate mb-1">
                    {data.title || data.filename}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {data.filename}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.language && (
                      <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/20 text-xs">
                        <Globe size={10} className="mr-1" />
                        {data.language.toUpperCase()}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-secondary/50 text-muted-foreground text-xs">
                      <Clock size={10} className="mr-1" />
                      ~{estimatedDuration} min
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/50 text-muted-foreground text-xs">
                      {wordCount} palavras
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 rounded-xl hover:bg-secondary/50">
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 grid lg:grid-cols-2 gap-6 max-h-[calc(90vh-180px)] overflow-y-auto">
              {/* Resumo com estilo melhorado */}
              <div className="glass rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-primary">
                      <Lightbulb size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Resumo Inteligente</h3>
                      <p className="text-xs text-muted-foreground">Powered by GPT-4o Mini</p>
                    </div>
                  </div>

                  {/* Main insight */}
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={14} className="text-primary" />
                      <span className="text-xs font-medium text-primary">Insight Principal</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {summaryLines[0]?.trim()}.
                    </p>
                  </div>

                  {/* Key points */}
                  {summaryLines.length > 1 && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <TrendingUp size={12} />
                        Pontos-Chave
                      </div>
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {summaryLines.slice(1, 5).map((line, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30"
                            >
                              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[10px] font-bold text-accent">{i + 1}</span>
                              </div>
                              <p className="text-xs text-foreground/80 leading-relaxed">
                                {line.trim()}.
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(data.summary, 'Resumo')}
                      className="flex-1 border-border/50"
                    >
                      <Copy size={14} className="mr-1" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTxt(data.summary, `${data.title || data.filename}-resumo.txt`)}
                      className="flex-1 border-border/50"
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {/* Transcrição */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Transcrição</h3>
                    <p className="text-xs text-muted-foreground">{charCount} caracteres</p>
                  </div>
                </div>
                
                <ScrollArea className="h-64 rounded-xl bg-background/50 p-4 mb-4">
                  <p className="text-sm text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed">
                    {data.transcription}
                  </p>
                </ScrollArea>
                
                <div className="flex gap-2 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(data.transcription, 'Transcrição')}
                    className="flex-1 border-border/50"
                  >
                    <Copy size={14} className="mr-1" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTxt(data.transcription, `${data.title || data.filename}-transcricao.txt`)}
                    className="flex-1 border-border/50"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Criado em {formatDate(data.createdAt)}
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
              >
                Fechar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
