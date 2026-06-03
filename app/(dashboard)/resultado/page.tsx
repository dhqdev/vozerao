'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  Save, 
  ArrowLeft,
  MessageSquare,
  Clock,
  Globe,
  TrendingUp,
  Lightbulb,
  Target,
  CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TranscriptionChat } from '@/components/transcription-chat'
import { useTranscriptionStore, type ChatMessage } from '@/stores/transcription-store'
import { saveToHistory, updateHistory } from '@/lib/history'

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

// Parse summary into structured sections
function parseSummary(summary: string) {
  const sections = []
  
  // Try to identify key points
  const keyPointsMatch = summary.match(/pontos?\s*(principais?|chave|importantes?)[:.]?\s*([\s\S]*?)(?=\n\n|\n-|\n\d|\n•|$)/i)
  const actionItemsMatch = summary.match(/(ações?|tarefas?|próximos? passos?|to-?dos?)[:.]?\s*([\s\S]*?)(?=\n\n|$)/i)
  
  // Split by common patterns
  const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 10)
  
  return {
    mainIdea: sentences[0]?.trim() || summary.slice(0, 150),
    keyPoints: sentences.slice(1, 4).map(s => s.trim()),
    fullText: summary
  }
}

export default function ResultadoPage() {
  const router = useRouter()
  const { currentResult, clearCurrentResult, addChatMessage } = useTranscriptionStore()
  const [activeTab, setActiveTab] = useState('resumo')
  const [isSaved, setIsSaved] = useState(false)

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

  const handleSaveToHistory = () => {
    saveToHistory(currentResult)
    setIsSaved(true)
    toast.success('Salvo no histórico!')
  }

  const handleNewTranscription = () => {
    clearCurrentResult()
    router.push('/transcrever')
  }

  const handleAddChatMessage = (message: ChatMessage) => {
    addChatMessage(message)
    // Update in history if saved
    if (isSaved && currentResult) {
      updateHistory(currentResult.id, {
        chatHistory: [...(currentResult.chatHistory || []), message]
      })
    }
  }

  const wordCount = currentResult.transcription.split(/\s+/).filter(Boolean).length
  const charCount = currentResult.transcription.length
  const estimatedDuration = Math.ceil(wordCount / 150) // ~150 words per minute

  const summaryData = parseSummary(currentResult.summary)

  return (
    <div className="p-4 md:p-8 pb-24 lg:pb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <FileText size={22} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                    {currentResult.title}
                  </h1>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentResult.filename}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentResult.language && (
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/20">
                  <Globe size={12} className="mr-1" />
                  {currentResult.language.toUpperCase()}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-secondary text-muted-foreground">
                <Clock size={12} className="mr-1" />
                ~{estimatedDuration} min
              </Badge>
              <Badge variant="secondary" className="bg-secondary text-muted-foreground">
                {wordCount} palavras
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewTranscription}
              className="border-border/50"
            >
              <ArrowLeft size={16} className="mr-2" />
              Nova Transcrição
            </Button>
            <Button
              size="sm"
              onClick={handleSaveToHistory}
              disabled={isSaved}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={16} className="mr-2" />
                  Salvo
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Main Content - Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex glass-subtle rounded-xl p-1 h-auto">
            <TabsTrigger 
              value="resumo" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2.5 px-4 transition-all"
            >
              <Sparkles size={16} className="mr-2" />
              Resumo
            </TabsTrigger>
            <TabsTrigger 
              value="transcricao"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2.5 px-4 transition-all"
            >
              <FileText size={16} className="mr-2" />
              Transcrição
            </TabsTrigger>
            <TabsTrigger 
              value="chat"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2.5 px-4 transition-all"
            >
              <MessageSquare size={16} className="mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Resumo Tab */}
          <TabsContent value="resumo" className="mt-6">
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Main Insight Card */}
              <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                      <Lightbulb size={22} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Insight Principal
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Gerado por GPT-4o Mini
                      </p>
                    </div>
                  </div>

                  <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                    {summaryData.mainIdea}
                  </p>

                  {/* Key Points */}
                  {summaryData.keyPoints.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Target size={16} />
                        Pontos-Chave
                      </div>
                      <div className="grid gap-3">
                        {summaryData.keyPoints.map((point, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <TrendingUp size={12} className="text-primary" />
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              {point}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentResult.summary, 'Resumo')}
                    className="border-border/50"
                  >
                    <Copy size={14} className="mr-2" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTxt(currentResult.summary, `${currentResult.title}-resumo.txt`)}
                    className="border-border/50"
                  >
                    <Download size={14} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Full Summary */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Resumo Completo
                </h3>
                <ScrollArea className="h-48">
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {summaryData.fullText}
                  </p>
                </ScrollArea>
              </div>
            </motion.div>
          </TabsContent>

          {/* Transcrição Tab */}
          <TabsContent value="transcricao" className="mt-6">
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Transcrição Completa
                  </h2>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {charCount} caracteres
                </Badge>
              </div>

              <ScrollArea className="h-96 rounded-xl bg-background/50 p-4 mb-4">
                <p className="text-sm text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed">
                  {currentResult.transcription}
                </p>
              </ScrollArea>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(currentResult.transcription, 'Transcrição')}
                  className="border-border/50"
                >
                  <Copy size={14} className="mr-2" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTxt(currentResult.transcription, `${currentResult.title}-transcricao.txt`)}
                  className="border-border/50"
                >
                  <Download size={14} className="mr-2" />
                  Download
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-6">
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="glass rounded-2xl overflow-hidden h-[500px]"
            >
              <TranscriptionChat
                transcription={currentResult}
                onAddMessage={handleAddChatMessage}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
