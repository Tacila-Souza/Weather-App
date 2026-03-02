/**
 * Componente de busca de cidade.
 * Input com botão de busca e suporte a Enter.
 * No mobile, exibe apenas o ícone para evitar overflow.
 */

"use client"

import { useState, type FormEvent } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (city: string) => void
  isLoading: boolean
  themeCard: string
  themeText: string
  themeInput: string
}

export function SearchBar({ onSearch, isLoading, themeCard, themeText, themeInput }: SearchBarProps) {
  const [query, setQuery] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md mx-auto px-2">
      <div className={`flex-1 flex items-center gap-2 rounded-xl px-4 py-2 border ${themeCard} transition-colors min-w-0`}>
        <Search className={`w-5 h-5 ${themeText} opacity-60 shrink-0`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cidade..."
          className={`flex-1 bg-transparent outline-none text-base min-h-[44px] font-sans min-w-0 ${themeInput}`}
          aria-label="Nome da cidade"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className={`shrink-0 min-w-[48px] min-h-[48px] md:min-w-0 md:px-6 rounded-xl font-medium transition-all
          flex items-center justify-center gap-2
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
          bg-white/20 backdrop-blur-sm border border-white/30 ${themeText}`}
        aria-label="Buscar"
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Search className="w-5 h-5 md:hidden" />
            <span className="hidden md:inline">Buscar</span>
          </>
        )}
      </button>
    </form>
  )
}
