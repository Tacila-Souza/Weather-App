/**
 * Funções utilitárias para formatação e processamento de dados climáticos.
 */

import type { TimeOfDay, HourlyForecast } from "./types"

/** Converte temperatura de Kelvin para Celsius */
export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15)
}

/** Formata temperatura com símbolo de grau */
export function formatTemp(celsius: number): string {
  return `${celsius}°C`
}

/** Retorna URL do ícone da OpenWeatherMap (tamanho 2x) */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

/**
 * Determina o período do dia com base no horário local da cidade.
 * Usa o timezone offset da API para calcular o horário local correto.
 */
export function getTimeOfDay(
  timezoneOffset: number,
  sunrise: number,
  sunset: number
): TimeOfDay {
  // Calcula o horário UTC atual e aplica o offset da cidade
  const nowUtc = Math.floor(Date.now() / 1000)
  const localTime = nowUtc + timezoneOffset

  // Hora local (0-23)
  const localHour = new Date(localTime * 1000).getUTCHours()

  // Horários de nascer e pôr do sol em hora local
  const sunriseLocal = new Date((sunrise + timezoneOffset) * 1000).getUTCHours()
  const sunsetLocal = new Date((sunset + timezoneOffset) * 1000).getUTCHours()

  // Manhã: do nascer do sol até 12h
  if (localHour >= sunriseLocal && localHour < 12) return "morning"
  // Dia: de 12h até 1h antes do pôr do sol
  if (localHour >= 12 && localHour < sunsetLocal - 1) return "day"
  // Entardecer: 1h antes até 1h depois do pôr do sol
  if (localHour >= sunsetLocal - 1 && localHour <= sunsetLocal + 1) return "sunset"
  // Noite: restante
  return "night"
}

/**
 * Retorna as classes Tailwind para o tema dinâmico baseado no período do dia.
 */
export function getThemeClasses(timeOfDay: TimeOfDay): {
  bg: string
  text: string
  card: string
  cardText: string
  accent: string
  input: string
  footer: string
} {
  switch (timeOfDay) {
    case "morning":
      return {
        bg: "from-sky-300 via-sky-200 to-amber-200",
        text: "text-sky-900",
        card: "bg-white/70 backdrop-blur-md border-white/50",
        cardText: "text-sky-900",
        accent: "text-amber-700",
        input: "text-sky-900 placeholder:text-sky-900/50",
        footer: "text-sky-900/60",
      }
    case "day":
      return {
        bg: "from-sky-500 via-sky-400 to-sky-300",
        text: "text-white",
        card: "bg-white/50 backdrop-blur-md border-white/30",
        cardText: "text-sky-900",
        accent: "text-sky-700",
        input: "text-sky-900 placeholder:text-sky-900/50",
        footer: "text-white/70",
      }
    case "sunset":
      return {
        bg: "from-orange-400 via-rose-400 to-purple-500",
        text: "text-white",
        card: "bg-white/30 backdrop-blur-md border-white/20",
        cardText: "text-white",
        accent: "text-amber-200",
        input: "text-white placeholder:text-white/50",
        footer: "text-white/60",
      }
    case "night":
      return {
        bg: "from-indigo-950 via-slate-900 to-slate-800",
        text: "text-white",
        card: "bg-white/10 backdrop-blur-md border-white/10",
        cardText: "text-slate-100",
        accent: "text-indigo-300",
        input: "text-slate-100 placeholder:text-slate-100/50",
        footer: "text-slate-300/60",
      }
  }
}

/** Formata um timestamp UNIX para hora local (ex: "14:00") */
export function formatTime(timestamp: number, timezoneOffset: number): string {
  const localTime = new Date((timestamp + timezoneOffset) * 1000)
  const hours = localTime.getUTCHours().toString().padStart(2, "0")
  const minutes = localTime.getUTCMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

/** Capitaliza a primeira letra de cada palavra */
export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Gera dados simulados das últimas 3 horas com base no clima atual.
 * Como a API gratuita não fornece dados históricos, simulamos
 * uma variação leve de temperatura para as horas anteriores.
 */
export function generatePastHours(
  currentTemp: number,
  currentIcon: string,
  currentConditionCode: number,
  currentDescription: string,
  timezoneOffset: number
): HourlyForecast[] {
  const now = Math.floor(Date.now() / 1000)
  const pastHours: HourlyForecast[] = []

  for (let i = 3; i >= 1; i--) {
    // Pequena variação aleatória de -2 a +1 graus
    const variation = Math.round(Math.random() * 3) - 2
    pastHours.push({
      dt: now - i * 3600,
      temp: currentTemp + variation,
      description: currentDescription,
      icon: currentIcon,
      conditionCode: currentConditionCode,
    })
  }

  return pastHours
}
