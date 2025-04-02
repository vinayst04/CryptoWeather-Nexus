import axios from 'axios';

export default async function handler(req, res) {
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({ error: 'Missing ids parameter' });
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error.message);
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded, please try again later' });
    } else {
      res.status(500).json({ error: 'Failed to fetch CoinGecko data', details: error.message });
    }
  }
}