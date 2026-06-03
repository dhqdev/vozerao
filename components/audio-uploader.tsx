'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileAudio } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface AudioUploaderProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

const ACCEPTED_FORMATS = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/x-m4a': ['.m4a'],
  'audio/webm': ['.webm'],
  'audio/ogg': ['.ogg'],
  'audio/flac': ['.flac'],
}

const MAX_SIZE = 24 * 1024 * 1024 // 24MB

export function AudioUploader({ onFileSelect, selectedFile }: AudioUploaderProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onFileSelect(file)
        const url = URL.createObjectURL(file)
        setAudioUrl(url)
      }
    },
    [onFileSelect]
  )

  const removeFile = () => {
    onFileSelect(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize: MAX_SIZE,
    multiple: false,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              {...getRootProps()}
              className={`
                relative cursor-pointer rounded-xl border-2 border-dashed p-8 md:p-12
                transition-all duration-300 text-center
                ${
                  isDragActive
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                }
              `}
            >
              <input {...getInputProps()} />
              
              {isDragActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-primary"
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(124, 58, 237, 0.4)', '0 0 0 10px rgba(124, 58, 237, 0)']
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <Upload size={32} className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">
                    {isDragActive
                      ? 'Solte o arquivo aqui...'
                      : 'Arraste e solte um arquivo de áudio'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou clique para selecionar
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded-full bg-secondary">.mp3</span>
                  <span className="px-2 py-1 rounded-full bg-secondary">.wav</span>
                  <span className="px-2 py-1 rounded-full bg-secondary">.m4a</span>
                  <span className="px-2 py-1 rounded-full bg-secondary">.webm</span>
                  <span className="px-2 py-1 rounded-full bg-secondary">.ogg</span>
                  <span className="px-2 py-1 rounded-full bg-secondary">.flac</span>
                </div>
                <p className="text-xs text-muted-foreground">Máximo 24MB</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
                  <FileAudio size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <X size={20} />
              </Button>
            </div>

            {audioUrl && (
              <div className="mt-4">
                <audio
                  controls
                  src={audioUrl}
                  className="w-full h-12 rounded-lg"
                  style={{
                    filter: 'invert(1) hue-rotate(180deg)',
                  }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
