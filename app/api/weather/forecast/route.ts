/**
 * Route Handler para buscar a previsão horária (3h em 3h).
 * Retorna os próximos intervalos de previsão (até 6 horas).
 */

import { NextRequest, NextResponse } from "next/server"
import { kelvinToCelsius } from "@/lib/weather-utils"
import type { HourlyForecast } from "@/lib/types"

const API_KEY = process.env.OPENWEATHERMAP_API_KEY
const OWM_BASE = "https://api.openweathermap.org/data/2.5"

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat")
  const lon = request.nextUrl.searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json(
      { message: "Os parâmetros 'lat' e 'lon' são obrigatórios." },
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
      `${OWM_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=pt_br&cnt=4`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      return NextResponse.json(
        { message: `Erro da API: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    const forecast: HourlyForecast[] = data.list.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => ({
        dt: item.dt,
        temp: kelvinToCelsius(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        conditionCode: item.weather[0].id,
      })
    )

    return NextResponse.json(forecast)
  } catch {
    return NextResponse.json(
      { message: "Erro ao buscar previsão horária." },
      { status: 500 }
    )
  }
}
