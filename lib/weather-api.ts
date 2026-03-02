/**
 * Serviço de integração com a API OpenWeatherMap.
 * Todas as chamadas passam pelo Route Handler do Next.js para ocultar a chave da API.
 */

import type {
  CurrentWeather,
  HourlyForecast,
  NearbyCity,
} from "./types"

const BASE_URL = "/api/weather"

/**
 * Busca o clima atual de uma cidade pelo nome.
 * Converte Kelvin -> Celsius e mapeia os campos relevantes.
 */
export async function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  const res = await fetch(`${BASE_URL}/current?city=${encodeURIComponent(city)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Erro desconhecido" }))
    throw new Error(err.message || `Erro ${res.status}`)
  }
  return res.json()
}

/**
 * Busca a previsão horária (3h em 3h) para as próximas horas.
 * Retorna os próximos intervalos relevantes (3h e 6h).
 */
export async function fetchHourlyForecast(
  lat: number,
  lon: number
): Promise<HourlyForecast[]> {
  const res = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Erro desconhecido" }))
    throw new Error(err.message || `Erro ${res.status}`)
  }
  return res.json()
}

/**
 * Busca cidades próximas usando coordenadas geográficas.
 * Utiliza o endpoint /find com cnt=3 para retornar 3 cidades próximas.
 */
export async function fetchNearbyCities(
  lat: number,
  lon: number
): Promise<NearbyCity[]> {
  const res = await fetch(`${BASE_URL}/nearby?lat=${lat}&lon=${lon}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Erro desconhecido" }))
    throw new Error(err.message || `Erro ${res.status}`)
  }
  return res.json()
}
