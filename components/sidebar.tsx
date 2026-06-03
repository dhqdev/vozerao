'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Mic, Clock, LogOut, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Logo } from './logo'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/transcrever', icon: Mic, label: 'Nova Transcrição' },
  { href: '/historico', icon: Clock, label: 'Histórico' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="hidden lg:flex flex-col h-screen w-72 fixed left-0 top-0 bg-background border-r border-border/50"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-border/50">
        <Logo size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden',
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon size={20} className="relative z-10" />
                  <span className="font-medium relative z-10">{item.label}</span>
                  {isActive && (
                    <Sparkles size={14} className="ml-auto relative z-10 opacity-70" />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </nav>

      {/* Pro Badge / CTA */}
      <div className="p-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
            <Sparkles size={18} className="text-white" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">VozIA Pro</p>
          <p className="text-xs text-muted-foreground mb-3">
            Transcrições ilimitadas
          </p>
          <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
            Upgrade
          </button>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair da conta</span>
        </button>
      </div>
    </motion.aside>
  )
}
