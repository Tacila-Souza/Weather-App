/**
 * Componente de previsão horária.
 * Exibe exatamente 3 cards com previsão das próximas horas.
 * No mobile, usa carrossel horizontal com snap.
 * No desktop, exibe os 3 cards lado a lado.
 */

"use client"

import type { HourlyForecast } from "@/lib/types"
import { formatTemp, getWeatherIconUrl, formatTime, capitalizeWords } from "@/lib/weather-utils"
import { Clock } from "lucide-react"
import Image from "next/image"

interface HourlyForecastProps {
  pastHours: HourlyForecast[]
  futureHours: HourlyForecast[]
  timezoneOffset: number
  themeCard: string
  themeCardText: string
  themeAccent: string
}

export function HourlyForecastSection({
  pastHours,
  futureHours,
  timezoneOffset,
  themeCard,
  themeCardText,
  themeAccent,
}: HourlyForecastProps) {
  // Combina e limita a exatamente 3 itens
  const allHours = [...pastHours, ...futureHours].slice(0, 3)

  if (allHours.length === 0) return null

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`flex items-center gap-2 mb-3 ${themeCardText}`}>
        <Clock className="w-5 h-5 opacity-70" />
        <h3 className="text-lg font-semibold">Previsão por Hora</h3>
      </div>

      {/* Mobile: carrossel horizontal / Desktop: grid de 3 colunas */}
      <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        {allHours.map((hour, index) => {
          const isPast = index < pastHours.length
          return (
            <div
              key={`${hour.dt}-${index}`}
              className={`shrink-0 w-[calc(100vw-6rem)] snap-center
                md:w-auto md:shrink
                rounded-2xl p-4 border flex flex-col items-center gap-2
                ${themeCard} transition-colors
                ${isPast ? "opacity-60" : ""}
                bg-gradient-to-b from-sky-500/10 to-sky-500/5`}
            >
              {isPast && (
                <span className={`text-[10px] font-medium uppercase tracking-wider ${themeCardText} opacity-50`}>
                  Passado
                </span>
              )}
              <span className={`text-sm font-bold ${themeAccent}`}>
                {formatTime(hour.dt, timezoneOffset)}
              </span>
              <Image
                src={getWeatherIconUrl(hour.icon)}
                alt={hour.description}
                width={56}
                height={56}
              />
              <span className={`text-2xl font-bold ${themeCardText}`}>
                {formatTemp(hour.temp)}
              </span>
              <span className={`text-xs text-center ${themeCardText} opacity-60 leading-tight`}>
                {capitalizeWords(hour.description)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
