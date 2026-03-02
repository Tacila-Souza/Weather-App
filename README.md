# 🌤️ Weather App - Previsão do Tempo Dinâmica

![Status](https://img.shields.io/badge/Status-Online-success?style=for-the-badge)

**🔗 Acesse a aplicação online:** [clique aqui!](https://weather-app-lemon-one-58.vercel.app/)

Uma aplicação web moderna e responsiva (Mobile-First) para consulta de informações climáticas, consumindo a API da OpenWeatherMap. A interface se adapta não apenas ao tamanho da tela, mas também ao horário local da cidade pesquisada.

## 🚀 Funcionalidades

- **Busca de Clima Atual:** Pesquise por qualquer cidade e obtenha a temperatura e condições atuais.
- **Previsão Estendida:** Histórico recente e previsão para as próximas horas.
- **Cidades Vizinhas:** Descubra rapidamente o clima em cidades próximas à localização principal.
- **Tema Dinâmico:** A cor de fundo da aplicação muda automaticamente (dia, entardecer, noite) com base no horário da cidade pesquisada.
- **Sistema de Cache (Avançado):** Armazenamento local de buscas recentes para otimizar o consumo da API e melhorar a performance.
- **Tratamento de Erros:** Feedbacks visuais claros para "Cidade não encontrada", carregamento e falhas na API.

## 🛠️ Tecnologias Utilizadas

- **Front-end:** React, TypeScript
- **Estilização:** Tailwind CSS (Mobile-First)
- **Consumo de API:** Axios ou Fetch API
- **Testes:** Vitest / Jest e React Testing Library
- **Fonte de Dados:** [OpenWeatherMap API](https://openweathermap.org/)

## 🏗️ Arquitetura do Repositório

- **Route Handlers:** 3 rotas de API (`/api/weather/current`, `/forecast`, `/nearby`) que protegem a chave da API no servidor, com cache de 5 minutos e tratamento de erros (404, 429, 500).
- **Componentes UI:** 6 componentes modulares (`SearchBar`, `CurrentWeatherCard`, `HourlyForecastSection`, `NearbyCities`, `ErrorDisplay`, `LoadingSkeleton`), todos orquestrados pelo componente principal `WeatherApp`.
- **Tema Dinâmico:** 4 variações (manhã, dia, entardecer, noite) baseadas no fuso horário da cidade pesquisada, com transições suaves via gradientes do Tailwind.
- **Otimização e Lógica:** Cache local com TTL de 5 minutos para evitar chamadas repetidas, e previsão horária combinando horas passadas (simuladas) com dados reais da API `/forecast`.

## ⚙️ Como executar este repositório

### Pré-requisitos
- Node.js instalado (versão 16 ou superior recomendada).
- Uma chave de API gratuita da [OpenWeatherMap](https://openweathermap.org/api).

### Passo a Passo para executar localmente



Siga os passos abaixo para rodar o projeto na sua máquina:

**1. Clone o repositório e acesse a pasta:**
```bash
git clone https://github.com/Tacila-Souza/Weather-App.git
```

**2. Instale as dependências:**
```bash
npm install
```
**3. Configure as variáveis de ambiente:**

Crie um arquivo chamado .env.local na raiz do projeto e adicione a sua chave da OpenWeatherMap:

```bash
OPENWEATHERMAP_API_KEY=sua_chave_de_api_aqui

```
**4. Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

**5. Acesse a aplicação:**
```bash
Abra o seu navegador e acesse http://localhost:3000
```




















