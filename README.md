# CryptoWeather Nexus

A modern, multi-page dashboard combining weather data, cryptocurrency information, and real-time notifications, built as part of the Userology Software Engineer Intern - Frontend assignment. The app integrates weather data from OpenWeatherMap, cryptocurrency data from CoinGecko, and news headlines from NewsData.io, with a responsive design using Next.js, React, Redux, and Tailwind CSS.

## Live Demo
https://crypto-weather-nexus-vinayst04s-projects.vercel.app/

## Features
- **Dashboard Page**:
  - **Weather Section**: Displays temperature, humidity, and conditions for predefined cities (New York, London, Tokyo) with the ability to add more.
  - **Cryptocurrency Section**: Shows live price, 24h change, and market cap for Bitcoin, Ethereum, and Binance Coin, with options to add more.
  - **News Section**: Lists the top five crypto-related headlines with links to full articles.
- **Detail Pages**:
  - City details page for weather history (basic implementation).
  - Crypto details page for historical pricing (basic implementation).
- **Favorites System**:
  - Users can favorite cities and cryptos, with a sign-in check for non-signed users.
  - Favorites are persisted in Redux and displayed in the header.
- **Real-Time Notifications**:
  - Simulated WebSocket updates for price changes (due to CoinCap free-tier limitations).
  - Top-right alerts for significant price shifts (>5%) and heavy weather conditions.
  - Notifications include a type field (e.g., `price_alert`, `weather_alert`).
- **Responsive Design**:
  - Fully responsive layout using Tailwind CSS, adapting from mobile to desktop screens.
  - Light and dark mode with cool color schemes.
- **Error Handling**:
  - Loading and error states for API calls with fallback UI.
  - Bottom alerts for user actions (e.g., add/delete, favorites, rate limiting).

## Tech Stack
- **Framework**: Next.js (v13+) with file-based routing
- **Frontend**: React (hooks for state and lifecycle)
- **State Management**: Redux with Thunk for async actions
- **Styling**: Tailwind CSS
- **APIs**:
  - Weather: OpenWeatherMap
  - Crypto: CoinGecko
  - News: NewsData.io
- **Authentication**: NextAuth.js for Google sign-in
- **Deployment**: Vercel

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- API keys for:
  - OpenWeatherMap
  - CoinGecko (optional, free tier used)
  - NewsData.io
