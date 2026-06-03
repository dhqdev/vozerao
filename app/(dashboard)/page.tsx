'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mic, FileText, Clock, Languages, ArrowRight, FileAudio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
    // Simulate loading and read from localStorage
    const timer = setTimeout(() => {
      setStats(getStats())
      setRecentTranscriptions(getHistory().slice(0, 5))
      setIsLoading(false)
    }, 500)

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
      color: 'from-primary to-accent',
    },
    {
      title: 'Minutos Processados',
      value: stats.totalMinutes,
      icon: Clock,
      color: 'from-accent to-primary',
    },
    {
      title: 'Idiomas Detectados',
      value: stats.languagesDetected,
      icon: Languages,
      color: 'from-primary to-accent',
    },
  ]

  return (
    <div className="p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 bg-gradient-to-br from-primary to-accent hidden lg:flex">
              <AvatarFallback className="bg-transparent text-white text-lg font-bold">
                {user?.name?.charAt(0) || 'D'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Olá, {user?.name || 'David'}!
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Bem-vindo de volta ao VozIA
              </p>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl p-6 md:p-8 text-center"
        >
          <motion.h2
            className="text-xl md:text-3xl font-bold text-foreground mb-4 text-balance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Transforme qualquer áudio em{' '}
            <span className="gradient-text">texto e resumo</span> com IA
          </motion.h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-pretty">
            Faça upload do seu arquivo de áudio e deixe nossa inteligência artificial
            transcrever e resumir o conteúdo automaticamente.
          </p>
          <Link href="/transcrever">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-white font-semibold px-8"
            >
              <Mic className="mr-2" size={20} />
              Nova Transcrição
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {statCards.map((stat, index) => (
            <Card key={stat.title} className="glass border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon size={16} className="text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <motion.p
                    className="text-3xl font-bold text-foreground"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Recent Transcriptions */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Transcrições Recentes
            </h3>
            {recentTranscriptions.length > 0 && (
              <Link href="/historico">
                <Button variant="ghost" size="sm" className="text-primary hover:text-accent">
                  Ver todas
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
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
                    className="glass border-border hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => openModal(transcription)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                          <FileAudio size={20} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-foreground truncate">
                              {transcription.filename}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatShortDate(transcription.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {transcription.summary.slice(0, 100)}
                            {transcription.summary.length > 100 ? '...' : ''}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-accent shrink-0"
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="glass border-border">
              <CardContent className="p-8 text-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 w-fit mx-auto mb-4">
                  <FileText size={32} className="text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Nenhuma transcrição ainda
                </p>
                <Link href="/transcrever">
                  <Button className="bg-gradient-to-r from-primary to-accent text-white">
                    Fazer primeira transcrição
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
