'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { MobileNav } from '@/components/mobile-nav'
import { AuthGuard } from '@/components/auth-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
          {children}
        </main>
        <MobileNav />
      </div>
    </AuthGuard>
  )
}
