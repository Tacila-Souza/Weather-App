/**
 * Carrossel horizontal de cidades vizinhas.
 * Exibe exatamente 3 cidades próximas com visual diferenciado
 * (fundo com gradiente alaranjado para se distinguir da previsão horária).
 * No mobile, usa carrossel horizontal com snap.
 */

"use client"

import type { NearbyCity } from "@/lib/types"
import { formatTemp, getWeatherIconUrl, capitalizeWords } from "@/lib/weather-utils"
import { MapPin } from "lucide-react"
import Image from "next/image"

interface NearbyCitiesProps {
  cities: NearbyCity[]
  themeCard: string
  themeCardText: string
  themeAccent: string
}

export function NearbyCities({
  cities,
  themeCard,
  themeCardText,
  themeAccent,
}: NearbyCitiesProps) {
  // Limita a exatamente 3 cidades
  const displayCities = cities.slice(0, 3)

  if (displayCities.length === 0) return null

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`flex items-center gap-2 mb-3 ${themeCardText}`}>
        <MapPin className="w-5 h-5 opacity-70" />
        <h3 className="text-lg font-semibold">Cidades Vizinhas</h3>
      </div>

      {/* Mobile: carrossel horizontal / Desktop: grid de 3 colunas */}
      <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        {displayCities.map((city) => (
          <div
            key={city.name}
            className={`shrink-0 w-[calc(100vw-6rem)] snap-center
              md:w-auto md:shrink
              rounded-2xl p-4 border flex flex-col items-center gap-2
              ${themeCard} transition-colors
              bg-gradient-to-b from-amber-500/10 to-amber-500/5`}
          >
            <h4 className={`text-base font-bold ${themeCardText} text-center leading-tight`}>
              {city.name}
            </h4>
            <span className={`text-xs ${themeCardText} opacity-50 -mt-1`}>
              {city.country}
            </span>
            <Image
              src={getWeatherIconUrl(city.icon)}
              alt={city.description}
              width={56}
              height={56}
            />
            <span className={`text-2xl font-bold ${themeCardText}`}>
              {formatTemp(city.temp)}
            </span>
            <span className={`text-xs text-center ${themeAccent} leading-tight`}>
              {capitalizeWords(city.description)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
