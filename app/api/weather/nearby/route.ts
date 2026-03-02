/**
 * Route Handler para buscar cidades próximas por coordenadas.
 * Usa o endpoint /find com cnt=5 para buscar cidades ao redor,
 * depois filtra a cidade principal, retornando até 3 vizinhas.
 */

import { NextRequest, NextResponse } from "next/server"
import { kelvinToCelsius } from "@/lib/weather-utils"
import type { NearbyCity } from "@/lib/types"

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
      `${OWM_BASE}/find?lat=${lat}&lon=${lon}&cnt=5&appid=${API_KEY}&lang=pt_br`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      return NextResponse.json(
        { message: `Erro da API: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    // Filtra cidades que estejam a pelo menos 0.01 grau de distância
    // da posição original para excluir a própria cidade buscada
    const parsedLat = parseFloat(lat)
    const parsedLon = parseFloat(lon)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nearbyCities: NearbyCity[] = data.list
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => {
        const distance = Math.sqrt(
          Math.pow(item.coord.lat - parsedLat, 2) +
          Math.pow(item.coord.lon - parsedLon, 2)
        )
        return distance > 0.01
      })
      .slice(0, 3)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ({
        name: item.name,
        country: item.sys.country,
        temp: kelvinToCelsius(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        conditionCode: item.weather[0].id,
      }))

    return NextResponse.json(nearbyCities)
  } catch {
    return NextResponse.json(
      { message: "Erro ao buscar cidades próximas." },
      { status: 500 }
    )
  }
}
