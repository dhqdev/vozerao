'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mic, 
  FileText, 
  Clock, 
  Languages, 
  ArrowRight, 
  FileAudio,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TranscriptionModal } from '@/components/transcription-modal'
import { useAuthStore } from '@/stores/auth-store'
import { getHistory, getStats } from '@/lib/history'
import { formatShortDate } from '@/lib/format-date'
import type { TranscriptionResult } from '@/stores/transcription-store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ totalTranscriptions: 0, totalMinutes: 0, languagesDetected: 0 })
  const [recentTranscriptions, setRecentTranscriptions] = useState<TranscriptionResult[]>([])
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(getStats())
      setRecentTranscriptions(getHistory().slice(0, 5))
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const openModal = (transcription: TranscriptionResult) => {
    setSelectedTranscription(transcription)
    setIsModalOpen(true)
  }

  const statCards = [
    {
      title: 'Transcrições',
      value: stats.totalTranscriptions,
      icon: FileText,
      gradient: 'from-primary to-accent',
      description: 'Total realizadas',
    },
    {
      title: 'Minutos',
      value: stats.totalMinutes,
      icon: Clock,
      gradient: 'from-accent to-primary',
      description: 'Processados',
    },
    {
      title: 'Idiomas',
      value: stats.languagesDetected,
      icon: Languages,
      gradient: 'from-primary to-accent',
      description: 'Detectados',
    },
  ]

  return (
    <div className="p-4 md:p-8 pb-24 lg:pb-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <Avatar className="h-14 w-14 bg-gradient-to-br from-primary to-accent hidden sm:flex shadow-lg shadow-primary/20">
            <AvatarFallback className="bg-transparent text-white text-xl font-bold">
              {user?.name?.charAt(0) || 'D'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Olá, {user?.name || 'David'}!
            </h1>
            <p className="text-muted-foreground">
              Pronto para transformar áudio em texto?
            </p>
          </div>
        </motion.div>

        {/* Hero CTA */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-3xl p-6 md:p-10 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 via-accent/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary/15 text-primary border-primary/20 rounded-full px-3 py-1">
                  <Zap size={12} className="mr-1" />
                  Powered by AI
                </Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">
                Transforme qualquer áudio em{' '}
                <span className="gradient-text">texto e resumo</span>
              </h2>
              <p className="text-muted-foreground max-w-lg text-pretty">
                Upload rápido, transcrição precisa com Whisper AI e resumos inteligentes com GPT-4.
              </p>
            </div>
            
            <div className="shrink-0">
              <Link href="/transcrever">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 group"
                >
                  <Mic className="mr-2 group-hover:scale-110 transition-transform" size={22} />
                  Nova Transcrição
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {statCards.map((stat, index) => (
            <Card key={stat.title} className="glass border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon size={18} className="text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <div>
                    <motion.p
                      className="text-3xl font-bold text-foreground"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Recent Transcriptions */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                <TrendingUp size={18} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Recentes
              </h3>
            </div>
            {recentTranscriptions.length > 0 && (
              <Link href="/historico">
                <Button variant="ghost" size="sm" className="text-primary hover:text-accent group">
                  Ver todas
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : recentTranscriptions.length > 0 ? (
            <div className="space-y-3">
              {recentTranscriptions.map((transcription, index) => (
                <motion.div
                  key={transcription.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="glass border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => openModal(transcription)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 group-hover:from-primary/25 group-hover:to-accent/25 transition-colors">
                          <FileAudio size={22} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-semibold text-foreground truncate">
                              {transcription.title || transcription.filename}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatShortDate(transcription.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 truncate">
                            {transcription.filename}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {transcription.summary.slice(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="glass border-border/50">
              <CardContent className="p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={28} className="text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Comece agora
                </h4>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Faça sua primeira transcrição e veja a mágica acontecer
                </p>
                <Link href="/transcrever">
                  <Button className="bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20">
                    <Mic size={18} className="mr-2" />
                    Transcrever áudio
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>

      <TranscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedTranscription}
      />
    </div>
  )
}
