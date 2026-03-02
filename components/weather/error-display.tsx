/**
 * Componente de feedback visual para estados de erro.
 * Exibe mensagens amigáveis para diferentes tipos de erro:
 * - Cidade não encontrada (404)
 * - Limite de requisições (429)
 * - Erro genérico de servidor (500)
 */

"use client"

import { AlertTriangle, CloudOff, RefreshCw } from "lucide-react"

interface ErrorDisplayProps {
  message: string
  onRetry?: () => void
  themeCard: string
  themeCardText: string
}

export function ErrorDisplay({
  message,
  onRetry,
  themeCard,
  themeCardText,
}: ErrorDisplayProps) {
  const isNotFound = message.includes("não encontrada")
  const isRateLimit = message.includes("Limite")

  return (
    <div
      className={`rounded-2xl p-6 border w-full max-w-md mx-auto flex flex-col items-center gap-4 ${themeCard}`}
      role="alert"
    >
      {isNotFound ? (
        <CloudOff className={`w-12 h-12 ${themeCardText} opacity-60`} />
      ) : (
        <AlertTriangle className={`w-12 h-12 ${themeCardText} opacity-60`} />
      )}

      <p className={`text-center text-lg font-medium ${themeCardText}`}>
        {message}
      </p>

      {isRateLimit && (
        <p className={`text-center text-sm ${themeCardText} opacity-60`}>
          A API gratuita possui um limite de requisições por minuto.
          Aguarde alguns instantes e tente novamente.
        </p>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className={`flex items-center gap-2 min-h-[44px] px-6 rounded-xl font-medium
            bg-white/20 backdrop-blur-sm border border-white/30
            hover:scale-105 active:scale-95 transition-all ${themeCardText}`}
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  )
}
