import axios from 'axios';

// In-memory cache
let cache = {
  data: null,
  timestamp: 0,
};
const CACHE_DURATION = 60 * 1000; // Cache for 60 seconds to match polling interval

export default async function handler(req, res) {
  const now = Date.now();

  // Check if cached data is still valid
  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    console.log('Returning cached crypto data');
    return res.status(200).json(cache.data);
  }

  try {
    // Fetch data from CoinGecko API
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin'
    );

    // Update cache
    cache = {
      data: response.data,
      timestamp: now,
    };
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching crypto data from CoinGecko:', error.message);
    if (error.response) {
      console.error('CoinGecko response status:', error.response.status);
      console.error('CoinGecko response data:', error.response.data);
    }
    // If we have cached data, return it as a fallback
    if (cache.data) {
      console.log('Returning stale cached crypto data due to error');
      return res.status(200).json(cache.data);
    }
    res.status(500).json({ error: 'Failed to fetch crypto data', details: error.message });
  }
}