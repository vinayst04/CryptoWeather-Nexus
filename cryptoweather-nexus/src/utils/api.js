import axios from 'axios';

const OPENWEATHERMAP_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const NEWSDATA_API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

export const getWeather = async (cities) => {
  const promises = cities.map(async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch weather for ${city}`);
    }
  });
  return Promise.all(promises);
};

export const getCrypto = async () => {
  try {
    const response = await axios.get('/api/crypto');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch crypto data');
  }
};

export const getNews = async () => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&q=cryptocurrency`
    );
    return response.data.results;
  } catch (error) {
    throw new Error('Failed to fetch news');
  }
};