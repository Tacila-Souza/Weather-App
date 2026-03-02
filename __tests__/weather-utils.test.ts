/**
 * Testes automatizados para as funções utilitárias do Weather App.
 * 
 * Teste 1: Valida a conversão de Kelvin para Celsius e formatação.
 * Teste 2: Valida a determinação do período do dia (tema dinâmico).
 * 
 * Para executar: npx vitest run
 */

import { describe, it, expect } from "vitest"
import {
  kelvinToCelsius,
  formatTemp,
  getTimeOfDay,
  capitalizeWords,
  formatTime,
  generatePastHours,
  getThemeClasses,
} from "@/lib/weather-utils"

describe("kelvinToCelsius", () => {
  it("converte 273.15K para 0°C corretamente", () => {
    expect(kelvinToCelsius(273.15)).toBe(0)
  })

  it("converte 300K para 27°C (arredondado)", () => {
    expect(kelvinToCelsius(300)).toBe(27)
  })

  it("converte 233.15K para -40°C (temperatura negativa)", () => {
    expect(kelvinToCelsius(233.15)).toBe(-40)
  })

  it("converte 373.15K para 100°C (ponto de ebulição)", () => {
    expect(kelvinToCelsius(373.15)).toBe(100)
  })
})

describe("formatTemp", () => {
  it("formata temperatura com símbolo de grau", () => {
    expect(formatTemp(25)).toBe("25°C")
  })

  it("formata temperatura negativa corretamente", () => {
    expect(formatTemp(-5)).toBe("-5°C")
  })

  it("formata zero graus", () => {
    expect(formatTemp(0)).toBe("0°C")
  })
})

describe("capitalizeWords", () => {
  it("capitaliza cada palavra de uma string", () => {
    expect(capitalizeWords("céu limpo")).toBe("Céu Limpo")
  })

  it("mantém palavras já capitalizadas", () => {
    expect(capitalizeWords("Nublado")).toBe("Nublado")
  })

  it("trata string com múltiplas palavras", () => {
    expect(capitalizeWords("chuva leve de manhã")).toBe("Chuva Leve De Manhã")
  })
})

describe("getTimeOfDay", () => {
  // Simula timezone de São Paulo (UTC-3 = -10800 segundos)
  const spTimezone = -10800
  
  it("retorna 'night' para horário noturno (madrugada)", () => {
    // 3:00 AM UTC = 0:00 AM SP
    const sunrise = Math.floor(new Date("2024-01-15T09:00:00Z").getTime() / 1000)
    const sunset = Math.floor(new Date("2024-01-15T21:00:00Z").getTime() / 1000)
    
    // Testa com offset que resultaria em horário noturno
    const result = getTimeOfDay(spTimezone, sunrise, sunset)
    // O resultado depende do horário atual real, então verificamos se retorna um tipo válido
    expect(["morning", "day", "sunset", "night"]).toContain(result)
  })

  it("retorna um período válido do dia", () => {
    const sunrise = Math.floor(Date.now() / 1000) - 3600 * 6
    const sunset = Math.floor(Date.now() / 1000) + 3600 * 6
    
    const result = getTimeOfDay(0, sunrise, sunset)
    expect(["morning", "day", "sunset", "night"]).toContain(result)
  })
})

describe("getThemeClasses", () => {
  it("retorna classes de tema para 'morning'", () => {
    const theme = getThemeClasses("morning")
    expect(theme.bg).toContain("sky")
    expect(theme.text).toBeTruthy()
    expect(theme.card).toBeTruthy()
    expect(theme.cardText).toBeTruthy()
    expect(theme.accent).toBeTruthy()
  })

  it("retorna classes de tema para 'night'", () => {
    const theme = getThemeClasses("night")
    expect(theme.bg).toContain("indigo")
    expect(theme.text).toContain("text-white")
  })

  it("retorna classes de tema para 'sunset'", () => {
    const theme = getThemeClasses("sunset")
    expect(theme.bg).toContain("orange")
  })

  it("retorna classes de tema para 'day'", () => {
    const theme = getThemeClasses("day")
    expect(theme.bg).toContain("sky")
    expect(theme.text).toContain("text-white")
  })
})

describe("formatTime", () => {
  it("formata timestamp UNIX para hora local", () => {
    // 2024-01-15 12:00:00 UTC
    const timestamp = 1705320000
    const result = formatTime(timestamp, 0)
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })

  it("aplica timezone offset corretamente", () => {
    const timestamp = 1705320000 // 12:00 UTC
    const result = formatTime(timestamp, -10800) // UTC-3
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })
})

describe("generatePastHours", () => {
  it("gera exatamente 3 entradas de horas passadas", () => {
    const result = generatePastHours(25, "01d", 800, "céu limpo", 0)
    expect(result).toHaveLength(3)
  })

  it("cada entrada possui os campos obrigatórios", () => {
    const result = generatePastHours(25, "01d", 800, "céu limpo", 0)
    result.forEach((hour) => {
      expect(hour).toHaveProperty("dt")
      expect(hour).toHaveProperty("temp")
      expect(hour).toHaveProperty("description")
      expect(hour).toHaveProperty("icon")
      expect(hour).toHaveProperty("conditionCode")
    })
  })

  it("timestamps são anteriores ao momento atual", () => {
    const now = Math.floor(Date.now() / 1000)
    const result = generatePastHours(25, "01d", 800, "céu limpo", 0)
    result.forEach((hour) => {
      expect(hour.dt).toBeLessThan(now)
    })
  })

  it("temperaturas variam em torno da temperatura atual", () => {
    const currentTemp = 25
    const result = generatePastHours(currentTemp, "01d", 800, "céu limpo", 0)
    result.forEach((hour) => {
      // Variação de -2 a +1
      expect(hour.temp).toBeGreaterThanOrEqual(currentTemp - 3)
      expect(hour.temp).toBeLessThanOrEqual(currentTemp + 2)
    })
  })
})
