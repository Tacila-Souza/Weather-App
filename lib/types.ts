// Tipos principais para a Weather App

/** Dados de clima atual retornados pela API /weather */
export interface CurrentWeather {
  city: string
  country: string
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  /** Código de condição climática da OpenWeatherMap */
  conditionCode: number
  /** Timestamp UNIX do nascer do sol (hora local) */
  sunrise: number
  /** Timestamp UNIX do pôr do sol (hora local) */
  sunset: number
  /** Diferença em segundos em relação ao UTC */
  timezone: number
  lat: number
  lon: number
  /** Timestamp da última atualização */
  dt: number
}

/** Dados de previsão horária (intervalos de 3h da API /forecast) */
export interface HourlyForecast {
  dt: number
  temp: number
  description: string
  icon: string
  conditionCode: number
}

/** Dados resumidos de uma cidade vizinha */
export interface NearbyCity {
  name: string
  country: string
  temp: number
  description: string
  icon: string
  conditionCode: number
}

/** Estado geral do tempo da aplicação */
export interface WeatherState {
  current: CurrentWeather | null
  hourlyForecast: HourlyForecast[]
  /** Simulação das últimas 3 horas baseada em dados disponíveis */
  pastHours: HourlyForecast[]
  nearbyCities: NearbyCity[]
  isLoading: boolean
  error: string | null
}

/** Período do dia para tema dinâmico */
export type TimeOfDay = "morning" | "day" | "sunset" | "night"

/** Entrada do cache local */
export interface CacheEntry<T> {
  data: T
  timestamp: number
}
