/**
 * Componente principal do Weather App.
 * Orquestra a busca de dados, gerencia o estado global,
 * aplica o tema dinâmico baseado no horário da cidade
 * e coordena todos os subcomponentes.
 */

"use client"

import { useState, useCallback } from "react"
import type { CurrentWeather, HourlyForecast, NearbyCity, TimeOfDay } from "@/lib/types"
import { fetchCurrentWeather, fetchHourlyForecast, fetchNearbyCities } from "@/lib/weather-api"
import { getTimeOfDay, getThemeClasses, generatePastHours } from "@/lib/weather-utils"
import { getCachedData, setCachedData, getCacheKey } from "@/hooks/use-weather-cache"
import { SearchBar } from "@/components/weather/search-bar"
import { CurrentWeatherCard } from "@/components/weather/current-weather-card"
import { HourlyForecastSection } from "@/components/weather/hourly-forecast"
import { NearbyCities } from "@/components/weather/nearby-cities"
import { ErrorDisplay } from "@/components/weather/error-display"
import { LoadingSkeleton } from "@/components/weather/loading-skeleton"
import { CloudSun } from "lucide-react"

export function WeatherApp() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([])
  const [pastHours, setPastHours] = useState<HourlyForecast[]>([])
  const [nearbyCities, setNearbyCities] = useState<NearbyCity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastCity, setLastCity] = useState("")

  // Determina o período do dia para o tema dinâmico
  const timeOfDay: TimeOfDay = current
    ? getTimeOfDay(current.timezone, current.sunrise, current.sunset)
    : "day"

  const theme = getThemeClasses(timeOfDay)

  /**
   * Busca completa dos dados meteorológicos.
   * Primeiro verifica o cache, depois faz as chamadas à API.
   */
  const handleSearch = useCallback(async (city: string) => {
    setIsLoading(true)
    setError(null)
    setLastCity(city)

    const cacheKey = getCacheKey(city)

    // Verifica cache para dados recentes
    const cachedCurrent = getCachedData<CurrentWeather>(`current_${cacheKey}`)
    const cachedForecast = getCachedData<HourlyForecast[]>(`forecast_${cacheKey}`)
    const cachedNearby = getCachedData<NearbyCity[]>(`nearby_${cacheKey}`)
    const cachedPast = getCachedData<HourlyForecast[]>(`past_${cacheKey}`)

    if (cachedCurrent && cachedForecast && cachedNearby && cachedPast) {
      setCurrent(cachedCurrent)
      setHourlyForecast(cachedForecast)
      setNearbyCities(cachedNearby)
      setPastHours(cachedPast)
      setIsLoading(false)
      return
    }

    try {
      // 1. Busca clima atual
      const weatherData = await fetchCurrentWeather(city)
      setCurrent(weatherData)
      setCachedData(`current_${cacheKey}`, weatherData)

      // 2. Gera dados simulados das últimas 3 horas
      const pastData = generatePastHours(
        weatherData.temp,
        weatherData.icon,
        weatherData.conditionCode,
        weatherData.description,
        weatherData.timezone
      )
      setPastHours(pastData)
      setCachedData(`past_${cacheKey}`, pastData)

      // 3. Busca previsão horária e cidades vizinhas em paralelo
      const [forecastData, nearbyData] = await Promise.all([
        fetchHourlyForecast(weatherData.lat, weatherData.lon),
        fetchNearbyCities(weatherData.lat, weatherData.lon),
      ])

      setHourlyForecast(forecastData)
      setNearbyCities(nearbyData)
      setCachedData(`forecast_${cacheKey}`, forecastData)
      setCachedData(`nearby_${cacheKey}`, nearbyData)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado. Tente novamente."
      setError(message)
      setCurrent(null)
      setHourlyForecast([])
      setPastHours([])
      setNearbyCities([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRetry = useCallback(() => {
    if (lastCity) {
      handleSearch(lastCity)
    }
  }, [lastCity, handleSearch])

  return (
    <div
      className={`min-h-screen overflow-x-hidden bg-gradient-to-br ${theme.bg} transition-colors duration-700 ease-in-out`}
    >
      <main className="flex flex-col items-center gap-6 px-4 py-8 md:py-12 lg:gap-8">
        {/* Header */}
        <header className="flex flex-col items-center gap-2 mb-2">
          <div className="flex items-center gap-3">
            <CloudSun className={`w-8 h-8 ${theme.text}`} />
            <h1 className={`text-3xl md:text-4xl font-bold ${theme.text} text-balance`}>
              Weather App
            </h1>
          </div>
          <p className={`text-sm ${theme.text} opacity-70`}>
            Previsão do tempo em tempo real
          </p>
        </header>

        {/* Busca */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          themeCard={theme.card}
          themeText={theme.text}
          themeInput={theme.input}
        />

        {/* Estado de carregamento */}
        {isLoading && (
          <LoadingSkeleton themeCard={theme.card} themeCardText={theme.cardText} />
        )}

        {/* Estado de erro */}
        {error && !isLoading && (
          <ErrorDisplay
            message={error}
            onRetry={handleRetry}
            themeCard={theme.card}
            themeCardText={theme.cardText}
          />
        )}

        {/* Conteúdo principal */}
        {current && !isLoading && !error && (
          <div className="flex flex-col items-center gap-6 w-full lg:grid lg:grid-cols-2 lg:gap-8 lg:max-w-4xl lg:items-start">
            {/* Coluna esquerda: Card principal */}
            <div className="w-full flex flex-col gap-6">
              <CurrentWeatherCard
                weather={current}
                themeCard={theme.card}
                themeCardText={theme.cardText}
                themeAccent={theme.accent}
              />
            </div>

            {/* Coluna direita: Previsões e vizinhos */}
            <div className="w-full flex flex-col gap-6">
              <HourlyForecastSection
                pastHours={pastHours}
                futureHours={hourlyForecast}
                timezoneOffset={current.timezone}
                themeCard={theme.card}
                themeCardText={theme.cardText}
                themeAccent={theme.accent}
              />

              <NearbyCities
                cities={nearbyCities}
                themeCard={theme.card}
                themeCardText={theme.cardText}
                themeAccent={theme.accent}
              />
            </div>
          </div>
        )}

        {/* Estado inicial - sem busca */}
        {!current && !isLoading && !error && (
          <div className={`flex flex-col items-center gap-4 mt-8 ${theme.text} opacity-60`}>
            <CloudSun className="w-20 h-20" />
            <p className="text-lg text-center text-balance">
              Pesquise uma cidade para ver a previsão do tempo
            </p>
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className={`text-center py-4 text-xs ${theme.footer}`}>
        <p>Dados fornecidos por OpenWeatherMap</p>
      </footer>
    </div>
  )
}
