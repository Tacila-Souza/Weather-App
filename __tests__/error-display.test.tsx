/**
 * Testes automatizados para o componente ErrorDisplay.
 * Valida que o componente renderiza corretamente para diferentes
 * tipos de erro (cidade não encontrada, limite de requisições, genérico).
 * 
 * Para executar: npx vitest run
 */

import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ErrorDisplay } from "@/components/weather/error-display"

describe("ErrorDisplay", () => {
  const defaultProps = {
    message: "Erro genérico de teste",
    themeCard: "bg-white/50",
    themeCardText: "text-gray-900",
  }

  it("renderiza a mensagem de erro corretamente", () => {
    render(<ErrorDisplay {...defaultProps} />)
    expect(screen.getByText("Erro genérico de teste")).toBeInTheDocument()
  })

  it("possui role='alert' para acessibilidade", () => {
    render(<ErrorDisplay {...defaultProps} />)
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })

  it("exibe botão 'Tentar novamente' quando onRetry é fornecido", () => {
    const onRetry = vi.fn()
    render(<ErrorDisplay {...defaultProps} onRetry={onRetry} />)
    
    const button = screen.getByText("Tentar novamente")
    expect(button).toBeInTheDocument()
  })

  it("chama onRetry ao clicar no botão", () => {
    const onRetry = vi.fn()
    render(<ErrorDisplay {...defaultProps} onRetry={onRetry} />)
    
    fireEvent.click(screen.getByText("Tentar novamente"))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it("não exibe botão quando onRetry não é fornecido", () => {
    render(<ErrorDisplay {...defaultProps} />)
    expect(screen.queryByText("Tentar novamente")).not.toBeInTheDocument()
  })

  it("exibe mensagem adicional quando é erro de limite de requisições", () => {
    render(
      <ErrorDisplay
        {...defaultProps}
        message="Limite de requisições atingido."
      />
    )
    expect(
      screen.getByText(/API gratuita possui um limite/)
    ).toBeInTheDocument()
  })

  it("renderiza mensagem de cidade não encontrada corretamente", () => {
    render(
      <ErrorDisplay
        {...defaultProps}
        message='Cidade "XYZ" não encontrada.'
      />
    )
    expect(
      screen.getByText('Cidade "XYZ" não encontrada.')
    ).toBeInTheDocument()
  })
})
