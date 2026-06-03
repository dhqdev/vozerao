'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Sparkles, Zap, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'

interface LoginForm {
  username: string
  password: string
}

const features = [
  { icon: Zap, label: 'Whisper AI', description: 'Transcrição precisa' },
  { icon: Sparkles, label: 'GPT-4', description: 'Resumos inteligentes' },
  { icon: Shield, label: 'Seguro', description: 'Dados protegidos' },
]

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = login(data.username, data.password)
    
    if (success) {
      toast.success('Bem-vindo de volta!')
      router.push('/')
    } else {
      toast.error('Credenciais inválidas.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Features (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Logo size="lg" showTagline />
            
            <h1 className="text-3xl xl:text-4xl font-bold text-foreground mt-8 mb-4 text-balance">
              Transforme áudio em{' '}
              <span className="gradient-text">conhecimento</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-md text-pretty">
              Transcrição automática com inteligência artificial de última geração. 
              Resumos inteligentes em segundos.
            </p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl glass"
                >
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary to-accent">
                    <feature.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{feature.label}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          <div className="glass-strong rounded-3xl p-8 md:p-10 shadow-2xl">
            {/* Logo - Mobile only */}
            <div className="mb-8 lg:hidden">
              <Logo size="md" showTagline />
            </div>

            {/* Header */}
            <div className="mb-8 lg:text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Entrar na conta
              </h2>
              <p className="text-muted-foreground">
                Acesse sua conta para continuar
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground text-sm font-medium">
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  className="h-12 bg-secondary/30 border-border/50 focus:border-primary rounded-xl"
                  {...register('username', { required: 'Usuário é obrigatório' })}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    className="h-12 bg-secondary/30 border-border/50 focus:border-primary pr-12 rounded-xl"
                    {...register('password', { required: 'Senha é obrigatória' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn size={18} />
                    Entrar
                  </div>
                )}
              </Button>
            </form>

            {/* Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border/50"
            >
              <p className="text-center text-sm text-muted-foreground">
                Credenciais de teste:{' '}
                <code className="px-2 py-0.5 rounded bg-primary/15 text-primary font-mono text-xs">
                  DavidLegal
                </code>{' '}
                /{' '}
                <code className="px-2 py-0.5 rounded bg-primary/15 text-primary font-mono text-xs">
                  123
                </code>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
