'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  isLoading: boolean
  messages?: string[]
}

export function LoadingOverlay({ isLoading, messages = [] }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-strong rounded-2xl p-8 max-w-sm w-full mx-4 text-center"
          >
            <div className="relative mx-auto w-16 h-16 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative flex items-center justify-center w-full h-full">
                <Loader2 size={40} className="text-primary animate-spin" />
              </div>
            </div>
            
            {messages.length > 0 && (
              <AnimatedText messages={messages} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AnimatedText({ messages }: { messages: string[] }) {
  return (
    <motion.div
      key={messages[0]}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-foreground font-medium"
    >
      {messages[0]}
    </motion.div>
  )
}
