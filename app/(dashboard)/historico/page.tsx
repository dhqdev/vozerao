'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  FileAudio, 
  Trash2, 
  Clock, 
  Mic, 
  AlertTriangle,
  MessageSquare,
  Globe
} from 'lucide-react'
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
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history

    const query = searchQuery.toLowerCase()
    return history.filter(
      (item) =>
        item.filename.toLowerCase().includes(query) ||
        item.title?.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query)
    )
  }, [history, searchQuery])

  const handleDelete = (id: string) => {
    removeFromHistory(id)
    setHistory(getHistory())
    toast.success('Transcrição removida')
  }

  const handleClearAll = () => {
    clearHistory()
    setHistory([])
    toast.success('Histórico limpo')
  }

  const openModal = (transcription: TranscriptionResult) => {
    setSelectedTranscription(transcription)
    setIsModalOpen(true)
  }

  return (
    <div className="p-4 md:p-8 pb-24 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Histórico
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {history.length} {history.length === 1 ? 'transcrição salva' : 'transcrições salvas'}
            </p>
          </div>

          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive border-border/50">
                  <Trash2 size={14} className="mr-2" />
                  Limpar tudo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-strong border-border/50">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-foreground">
                    <AlertTriangle size={20} className="text-destructive" />
                    Limpar histórico?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Esta ação não pode ser desfeita. Todas as transcrições serão removidas permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border/50">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAll}
                    className="bg-destructive hover:bg-destructive/90 text-white"
                  >
                    Limpar
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
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar por título, arquivo ou conteúdo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50"
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
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
                  <Card className="glass border-border/50 hover:border-primary/30 transition-all overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Main Content - Clickable */}
                        <button
                          onClick={() => openModal(item)}
                          className="flex-1 p-5 text-left hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 shrink-0">
                              <FileAudio size={24} className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="font-semibold text-foreground truncate">
                                  {item.title || item.filename}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-2">
                                {item.filename}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                {item.language && (
                                  <Badge variant="secondary" className="text-xs bg-primary/15 text-primary border-primary/20">
                                    <Globe size={10} className="mr-1" />
                                    {item.language.toUpperCase()}
                                  </Badge>
                                )}
                                <Badge variant="secondary" className="text-xs bg-secondary/50 text-muted-foreground">
                                  <Clock size={10} className="mr-1" />
                                  {formatShortDate(item.createdAt)}
                                </Badge>
                                {item.chatHistory && item.chatHistory.length > 0 && (
                                  <Badge variant="secondary" className="text-xs bg-accent/15 text-accent border-accent/20">
                                    <MessageSquare size={10} className="mr-1" />
                                    {item.chatHistory.length} msgs
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.summary}
                              </p>
                            </div>
                          </div>
                        </button>

                        {/* Actions */}
                        <div className="flex sm:flex-col items-center justify-end gap-2 p-3 sm:p-4 border-t sm:border-t-0 sm:border-l border-border/50 bg-secondary/20">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal(item)}
                            className="text-primary hover:text-accent hover:bg-primary/10"
                          >
                            Ver
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass-strong border-border/50">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">
                                  Remover transcrição?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  "{item.title || item.filename}" será removida permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-border/50">
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
          <Card className="glass border-border/50">
            <CardContent className="p-10 text-center">
              <Search size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-foreground font-medium mb-2">
                Nenhum resultado
              </p>
              <p className="text-muted-foreground text-sm">
                Tente buscar por outro termo
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass border-border/50">
            <CardContent className="p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                <FileAudio size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma transcrição salva
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Suas transcrições salvas aparecerão aqui
              </p>
              <Link href="/transcrever">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg shadow-primary/20">
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
