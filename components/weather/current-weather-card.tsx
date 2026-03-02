/**
 * Card principal com o clima atual da cidade pesquisada.
 * Exibe temperatura, sensação térmica, mínima/máxima, umidade,
 * velocidade do vento e descrição climática.
 */

"use client"

import type { CurrentWeather } from "@/lib/types"
import { formatTemp, getWeatherIconUrl, capitalizeWords, formatTime } from "@/lib/weather-utils"
import { Droplets, Wind, Thermometer, Sunrise, Sunset } from "lucide-react"
import Image from "next/image"

interface CurrentWeatherCardProps {
  weather: CurrentWeather
  themeCard: string
  themeCardText: string
  themeAccent: string
}

export function CurrentWeatherCard({
  weather,
  themeCard,
  themeCardText,
  themeAccent,
}: CurrentWeatherCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 border w-full max-w-md mx-auto ${themeCard} transition-colors`}
    >
      {/* Cabeçalho: cidade e país */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className={`text-2xl font-bold ${themeCardText}`}>
            {weather.city}
          </h2>
          <p className={`text-sm ${themeCardText} opacity-70`}>
            {weather.country}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={getWeatherIconUrl(weather.icon)}
            alt={weather.description}
            width={80}
            height={80}
            className="drop-shadow-lg"
          />
        </div>
      </div>

      {/* Temperatura principal */}
      <div className="flex items-end gap-2 mb-1">
        <span className={`text-6xl font-bold tabular-nums tracking-tight ${themeCardText}`}>
          {formatTemp(weather.temp)}
        </span>
      </div>

      {/* Descrição */}
      <p className={`text-lg mb-4 ${themeAccent} font-medium`}>
        {capitalizeWords(weather.description)}
      </p>

      {/* Detalhes em grid */}
      <div className="grid grid-cols-2 gap-3">
        <DetailItem
          icon={<Thermometer className="w-4 h-4" />}
          label="Sensação"
          value={formatTemp(weather.feelsLike)}
          textClass={themeCardText}
        />
        <DetailItem
          icon={<Thermometer className="w-4 h-4" />}
          label="Mín / Máx"
          value={`${formatTemp(weather.tempMin)} / ${formatTemp(weather.tempMax)}`}
          textClass={themeCardText}
        />
        <DetailItem
          icon={<Droplets className="w-4 h-4" />}
          label="Umidade"
          value={`${weather.humidity}%`}
          textClass={themeCardText}
        />
        <DetailItem
          icon={<Wind className="w-4 h-4" />}
          label="Vento"
          value={`${weather.windSpeed} m/s`}
          textClass={themeCardText}
        />
        <DetailItem
          icon={<Sunrise className="w-4 h-4" />}
          label="Nascer do Sol"
          value={formatTime(weather.sunrise, weather.timezone)}
          textClass={themeCardText}
        />
        <DetailItem
          icon={<Sunset className="w-4 h-4" />}
          label="Pôr do Sol"
          value={formatTime(weather.sunset, weather.timezone)}
          textClass={themeCardText}
        />
      </div>
    </div>
  )
}

function DetailItem({
  icon,
  label,
  value,
  textClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  textClass: string
}) {
  return (
    <div className={`flex items-center gap-2 ${textClass}`}>
      <span className="opacity-60">{icon}</span>
      <div>
        <p className="text-xs opacity-60">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}
