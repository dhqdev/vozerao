'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { Logo } from './logo'
import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border"
      >
        <div className="flex items-center justify-between px-4 h-16">
          <Logo size="sm" />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-accent">
                <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || 'D'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name || 'David'}
              </span>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sair</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </motion.header>
    </TooltipProvider>
  )
}
