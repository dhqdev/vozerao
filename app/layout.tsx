import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'VozIA - Sua voz, transformada em conhecimento',
  description: 'Plataforma inteligente de transcrição e resumo de áudios usando IA. Transforme qualquer áudio em texto e resumo com precisão.',
  keywords: ['transcrição', 'áudio', 'IA', 'inteligência artificial', 'resumo', 'whisper', 'gpt'],
  authors: [{ name: 'VozIA' }],
}

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              background: '#1e1e2e',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  )
}
