/**
 * Componente de loading com animação de pulso.
 * Exibe um skeleton do card de clima enquanto os dados carregam.
 */

"use client"

import { Cloud } from "lucide-react"

interface LoadingSkeletonProps {
  themeCard: string
  themeCardText: string
}

export function LoadingSkeleton({ themeCard, themeCardText }: LoadingSkeletonProps) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      {/* Card principal skeleton */}
      <div className={`rounded-2xl p-6 border ${themeCard} animate-pulse`}>
        <div className="flex items-center justify-center flex-col gap-3">
          <Cloud className={`w-16 h-16 ${themeCardText} opacity-30 animate-bounce`} />
          <p className={`text-lg font-medium ${themeCardText} opacity-60`}>
            Carregando...
          </p>
        </div>
        <div className="mt-4 space-y-3">
          <div className={`h-8 rounded-lg bg-current opacity-10 w-2/3`} />
          <div className={`h-4 rounded-lg bg-current opacity-10 w-1/2`} />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className={`h-12 rounded-lg bg-current opacity-10`} />
            <div className={`h-12 rounded-lg bg-current opacity-10`} />
            <div className={`h-12 rounded-lg bg-current opacity-10`} />
            <div className={`h-12 rounded-lg bg-current opacity-10`} />
          </div>
        </div>
      </div>
    </div>
  )
}
