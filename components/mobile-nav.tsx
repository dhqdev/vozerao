'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Mic, Clock, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/transcrever', icon: Mic, label: 'Gravar', isMain: true },
  { href: '/historico', icon: Clock, label: 'Histórico' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 pb-safe">
      <div className="glass-strong rounded-2xl mx-auto max-w-sm">
        <ul className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isMain = item.isMain

            if (isMain) {
              return (
                <li key={item.href} className="-mt-8">
                  <Link href={item.href}>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300',
                        isActive
                          ? 'bg-gradient-to-br from-primary to-accent shadow-primary/40'
                          : 'bg-gradient-to-br from-primary to-accent shadow-primary/20 opacity-90 hover:opacity-100'
                      )}
                    >
                      <Plus size={24} className="text-white" />
                    </motion.div>
                  </Link>
                </li>
              )
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-6 py-2 relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileNav"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon
                    size={22}
                    className={cn(
                      'transition-colors duration-200 relative z-10',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[10px] font-medium transition-colors duration-200 relative z-10',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
