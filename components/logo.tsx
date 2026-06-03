'use client'

import { Mic } from 'lucide-react'
import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

export function Logo({ size = 'md', showTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  }

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 44,
  }

  return (
    <motion.div 
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-lg opacity-50" />
          <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-xl">
            <Mic size={iconSizes[size]} className="text-white" />
          </div>
        </div>
        <span className={`font-bold ${sizeClasses[size]} text-foreground`}>
          Voz<span className="gradient-text">IA</span>
        </span>
      </div>
      {showTagline && (
        <motion.p 
          className="text-muted-foreground text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Sua voz, transformada em conhecimento.
        </motion.p>
      )}
    </motion.div>
  )
}
