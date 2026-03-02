/**
 * Hook personalizado para gerenciar cache de requisições.
 * Evita chamadas repetidas à API para a mesma cidade
 * em um intervalo curto de tempo (padrão: 5 minutos).
 * 
 * Usa localStorage como camada de persistência.
 */

import type { CacheEntry } from "@/lib/types"

const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutos em milissegundos
const CACHE_PREFIX = "weather_cache_"

/**
 * Recupera um valor do cache se ainda for válido.
 * Retorna null se o cache estiver expirado ou não existir.
 */
export function getCachedData<T>(key: string, ttl: number = DEFAULT_TTL): T | null {
  if (typeof window === "undefined") return null

  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key)
    if (!cached) return null

    const entry: CacheEntry<T> = JSON.parse(cached)
    const isExpired = Date.now() - entry.timestamp > ttl

    if (isExpired) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }

    return entry.data
  } catch {
    return null
  }
}

/**
 * Armazena um valor no cache com timestamp atual.
 */
export function setCachedData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // Silencia erros de localStorage cheio
  }
}

/**
 * Gera uma chave de cache normalizada para uma cidade.
 */
export function getCacheKey(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, "_")
}
