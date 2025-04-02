# CryptoWeather Nexus

A modern, multi-page dashboard combining weather data, cryptocurrency information, and real-time notifications via WebSocket.

## Features
- **Dashboard**: Displays weather for New York, London, and Tokyo; crypto prices for Bitcoin, Ethereum, and Binance Coin; and top 5 crypto news headlines.
- **Detail Pages**: Weather history for cities and historical pricing for cryptos (limited by free API plans).
- **Real-Time Notifications**: WebSocket for live crypto price updates and simulated weather alerts.
- **Favorites**: Add/remove cities and cryptos to favorites (persisted in Redux state).
- **Responsive Design**: Built with Tailwind CSS for seamless adaptation across devices.
- **State Management**: Redux with async middleware (Thunk) for global state.
- **Deployment**: Deployed on Vercel (link provided below).

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd cryptoweather-nexus