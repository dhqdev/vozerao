'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileAudio, Trash2, Clock, Mic, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { TranscriptionModal } from '@/components/transcription-modal'
import { getHistory, removeFromHistory, clearHistory } from '@/lib/history'
import { formatShortDate } from '@/lib/format-date'
import type { TranscriptionResult } from '@/stores/transcription-store'

export default function HistoricoPage() {
  const [history, setHistory] = useState<TranscriptionResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHistory(getHistory())
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history

    const query = searchQuery.toLowerCase()
    return history.filter(
      (item) =>
        item.filename.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query)
    )
  }, [history, searchQuery])

  const handleDelete = (id: string) => {
    removeFromHistory(id)
    setHistory(getHistory())
    toast.success('Transcrição removida do histórico')
  }

  const handleClearAll = () => {
    clearHistory()
    setHistory([])
    toast.success('Histórico limpo com sucesso')
  }

  const openModal = (transcription: TranscriptionResult) => {
    setSelectedTranscription(transcription)
    setIsModalOpen(true)
  }

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Histórico de Transcrições
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {history.length} {history.length === 1 ? 'transcrição salva' : 'transcrições salvas'}
            </p>
          </div>

          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 size={16} className="mr-2" />
                  Limpar histórico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-strong border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-foreground">
                    <AlertTriangle size={20} className="text-destructive" />
                    Limpar todo o histórico?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Esta ação não pode ser desfeita. Todas as suas transcrições salvas serão permanentemente removidas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAll}
                    className="bg-destructive hover:bg-destructive/90 text-white"
                  >
                    Sim, limpar tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar por nome do arquivo ou conteúdo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredHistory.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {filteredHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 shrink-0">
                            <FileAudio size={24} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-foreground truncate">
                                {item.filename}
                              </p>
                              {item.language && (
                                <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                                  {item.language.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Clock size={12} />
                              <span>{formatShortDate(item.createdAt)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {item.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal(item)}
                            className="flex-1 sm:flex-none text-primary hover:text-accent"
                          >
                            Ver detalhes
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none text-destructive hover:text-destructive"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass-strong border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">
                                  Remover transcrição?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  A transcrição "{item.filename}" será removida permanentemente do histórico.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-border">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-destructive hover:bg-destructive/90 text-white"
                                >
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : history.length > 0 ? (
          // Search with no results
          <Card className="glass border-border">
            <CardContent className="p-8 text-center">
              <Search size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                Nenhum resultado encontrado
              </p>
              <p className="text-muted-foreground text-sm">
                Tente buscar por outro termo
              </p>
            </CardContent>
          </Card>
        ) : (
          // Empty state
          <Card className="glass border-border">
            <CardContent className="p-8 text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 w-fit mx-auto mb-4">
                <FileAudio size={48} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma transcrição salva
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Suas transcrições salvas aparecerão aqui. Faça sua primeira transcrição agora!
              </p>
              <Link href="/transcrever">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white">
                  <Mic size={18} className="mr-2" />
                  Fazer primeira transcrição
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <TranscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedTranscription}
      />
    </div>
  )
}
