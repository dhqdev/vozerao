'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ChatMessage, TranscriptionResult } from '@/stores/transcription-store'

interface TranscriptionChatProps {
  transcription: TranscriptionResult
  onAddMessage: (message: ChatMessage) => void
}

const suggestedQuestions = [
  'Quais são os pontos principais?',
  'Existe alguma ação pendente?',
  'Qual o tom geral da conversa?',
  'Resuma em 3 frases',
]

export function TranscriptionChat({ transcription, onAddMessage }: TranscriptionChatProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const messages = transcription.chatHistory || []

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const generateResponse = async (question: string): Promise<string> => {
    // Simulate AI response based on transcription content
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const content = transcription.transcription.toLowerCase()
    const summary = transcription.summary.toLowerCase()

    if (question.toLowerCase().includes('pontos principais') || question.toLowerCase().includes('principais')) {
      return `Com base na transcrição "${transcription.title}", identifiquei os seguintes pontos principais:\n\n• O conteúdo aborda temas relevantes mencionados no áudio\n• Foram discutidos aspectos importantes do contexto\n• A conversa apresenta informações úteis para análise\n\nO resumo já gerado captura bem a essência do conteúdo.`
    }

    if (question.toLowerCase().includes('ação') || question.toLowerCase().includes('pendente') || question.toLowerCase().includes('fazer')) {
      return `Analisando a transcrição, não identifiquei ações pendentes explícitas. No entanto, sugiro:\n\n• Revisar os pontos mencionados no resumo\n• Considerar próximos passos com base no contexto\n• Compartilhar o conteúdo com interessados se relevante`
    }

    if (question.toLowerCase().includes('tom') || question.toLowerCase().includes('sentimento')) {
      return `O tom geral da transcrição "${transcription.title}" parece ser:\n\n🎯 **Informativo** - O conteúdo apresenta informações de forma clara\n💬 **Conversacional** - Mantém um fluxo natural de comunicação\n📊 **Objetivo** - Foca em transmitir a mensagem principal`
    }

    if (question.toLowerCase().includes('resuma') || question.toLowerCase().includes('resumo') || question.toLowerCase().includes('3 frases')) {
      const sentences = transcription.summary.split('.').filter(s => s.trim()).slice(0, 3)
      return `Aqui está um resumo ultra-compacto:\n\n1. ${sentences[0]?.trim() || 'Conteúdo transcrito com sucesso'}.\n2. ${sentences[1]?.trim() || 'Informações relevantes foram capturadas'}.\n3. ${sentences[2]?.trim() || 'Análise disponível para consulta'}.`
    }

    // Default response
    return `Analisando sua pergunta sobre "${transcription.title}":\n\nCom base na transcrição de ${transcription.transcription.split(' ').length} palavras, posso ajudar a extrair informações específicas. A transcrição foi detectada no idioma ${transcription.language?.toUpperCase() || 'PT'} e já possui um resumo gerado.\n\nPosso ajudar com análises mais específicas se você tiver perguntas direcionadas sobre o conteúdo.`
  }

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    }

    onAddMessage(userMessage)
    setInput('')
    setIsLoading(true)

    try {
      const response = await generateResponse(messageText)
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      }

      onAddMessage(assistantMessage)
    } catch (error) {
      console.error('[v0] Chat error:', error)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Assistente VozIA</h3>
          <p className="text-xs text-muted-foreground">
            Pergunte sobre a transcrição
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
              <Bot size={28} className="text-primary" />
            </div>
            <p className="text-foreground font-medium mb-2">
              Converse sobre a transcrição
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Faça perguntas, peça análises ou extraia informações específicas do conteúdo.
            </p>
            
            {/* Suggested Questions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((q, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSend(q)}
                  className="px-3 py-2 rounded-lg bg-secondary/50 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'chat-message-user text-white'
                        : 'chat-message-ai text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <User size={16} className="text-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="chat-message-ai rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Analisando...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte algo sobre a transcrição..."
            className="flex-1 bg-secondary/50 border-border/50 focus:border-primary"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-4"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
