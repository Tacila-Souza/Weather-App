/**
 * Route Handler para buscar o clima atual de uma cidade.
 * A chave da API fica segura no servidor.
 */

import { NextRequest, NextResponse } from "next/server"
import { kelvinToCelsius } from "@/lib/weather-utils"
import type { CurrentWeather } from "@/lib/types"

const API_KEY = process.env.OPENWEATHERMAP_API_KEY
const OWM_BASE = "https://api.openweathermap.org/data/2.5"

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city")

  if (!city) {
    return NextResponse.json(
      { message: "O parâmetro 'city' é obrigatório." },
      { status: 400 }
    )
  }

  if (!API_KEY) {
    return NextResponse.json(
      { message: "Chave da API não configurada no servidor." },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(
      `${OWM_BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&lang=pt_br`,
      { next: { revalidate: 300 } } // Cache de 5 minutos no servidor
    )

    if (res.status === 404) {
      return NextResponse.json(
        { message: `Cidade "${city}" não encontrada.` },
        { status: 404 }
      )
    }

    if (res.status === 429) {
      return NextResponse.json(
        { message: "Limite de requisições atingido. Tente novamente em alguns minutos." },
        { status: 429 }
      )
    }

    if (!res.ok) {
      return NextResponse.json(
        { message: `Erro da API: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    const weather: CurrentWeather = {
      city: data.name,
      country: data.sys.country,
      temp: kelvinToCelsius(data.main.temp),
      feelsLike: kelvinToCelsius(data.main.feels_like),
      tempMin: kelvinToCelsius(data.main.temp_min),
      tempMax: kelvinToCelsius(data.main.temp_max),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      conditionCode: data.weather[0].id,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      lat: data.coord.lat,
      lon: data.coord.lon,
      dt: data.dt,
    }

    return NextResponse.json(weather)
  } catch {
    return NextResponse.json(
      { message: "Erro ao conectar com o serviço de clima. Tente novamente." },
      { status: 500 }
    )
  }
}
