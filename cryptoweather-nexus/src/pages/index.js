import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../redux/actions/weatherActions';
import { fetchNews } from '../redux/actions/newsActions';
import WeatherCard from '../components/WeatherCard';
import CryptoCard from '../components/CryptoCard';
import NewsCard from '../components/NewsCard';
import Footer from '../components/Footer';
import { addFavorite } from '../redux/actions/favoriteActions';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function Home({ addBottomAlert }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather);
  const news = useSelector((state) => state.news);

  const [newCity, setNewCity] = useState('');
  const [newCrypto, setNewCrypto] = useState('');
  const [cities, setCities] = useState(['New York', 'London', 'Tokyo']);
  const [cryptos, setCryptos] = useState(['bitcoin', 'ethereum', 'binance-coin']);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [cryptoSuggestions, setCryptoSuggestions] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [bottomAlerts, setBottomAlerts] = useState([]);
  const [topAlerts, setTopAlerts] = useState([]);
  const [cityButtonDisabled, setCityButtonDisabled] = useState(false);
  const [cryptoButtonDisabled, setCryptoButtonDisabled] = useState(false);
  const [cityClickCount, setCityClickCount] = useState(0);
  const [cryptoClickCount, setCryptoClickCount] = useState(0);
  const [lastCityClickTime, setLastCityClickTime] = useState(0);
  const [lastCryptoClickTime, setLastCryptoClickTime] = useState(0);

  const cityList = ['Paris', 'Sydney', 'Dubai', 'Bangalore', 'Toronto', 'Singapore', 'Berlin', 'Rome', 'Barcelona', 'New York', 'London', 'Tokyo'];
  const cryptoList = ['dogecoin', 'cardano', 'solana', 'litecoin', 'polkadot', 'chainlink', 'ripple', 'stellar', 'bitcoin', 'ethereum', 'binance-coin'];

  const addBottomAlertLocal = (message, type = 'success') => {
    const id = Date.now();
    setBottomAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setBottomAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  };

  const addTopAlert = (message, type = 'info') => {
    const id = Date.now();
    setTopAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setTopAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  };

  useEffect(() => {
    if (session) {
      axios.get('/api/user', { params: { userId: session.user.id } }).then((response) => {
        const userData = response.data;
        if (userData.cities) setCities(userData.cities);
        if (userData.cryptos) setCryptos(userData.cryptos);
        if (userData.favorites) {
          dispatch({ type: 'SET_FAVORITES', payload: userData.favorites });
        }
        addBottomAlertLocal('Login successful', 'success');
      }).catch(() => {
        addBottomAlertLocal('Login unsuccessful', 'error');
      });
    }
  }, [session, dispatch]);

  useEffect(() => {
    if (session) {
      axios.post('/api/user', {
        userId: session.user.id,
        cities,
        cryptos,
        favorites: { cities: [], cryptos: [] },
      });
    }
  }, [cities, cryptos, session]);

  useEffect(() => {
    if (!weather.data.length) dispatch(fetchWeather(cities));
    if (!news.data.length) dispatch(fetchNews());

    const weatherInterval = setInterval(() => {
      dispatch(fetchWeather(cities));
    }, 270000);

    const newsInterval = setInterval(() => {
      dispatch(fetchNews());
    }, 420000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(newsInterval);
    };
  }, [dispatch, cities]);

  const fetchCryptoData = useCallback(async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: cryptos.join(','),
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      });
      console.log('Fetched crypto data from CoinGecko:', response.data);
      setCryptoData(response.data);
    } catch (error) {
      console.error('Crypto fetch error:', error.message);
      addBottomAlertLocal('Failed to fetch crypto data', 'error');
    }
  }, [cryptos]);

  useEffect(() => {
    fetchCryptoData();
    const cryptoFetchInterval = setInterval(() => {
      console.log('Fetching crypto data every 5 minutes for:', cryptos);
      fetchCryptoData();
    }, 300000);

    const cryptoUpdateInterval = setInterval(() => {
      setCryptoData((prevData) =>
        prevData.map((item) => ({
          ...item,
          current_price: item.current_price * (1 + (Math.random() - 0.5) * 0.01),
        }))
      );
    }, 5000);

    const topAlertInterval = setInterval(() => {
      if (cryptoData.length > 0) {
        const topCrypto = cryptoData[0];
        const priceChange = topCrypto.price_change_percentage_24h || 0;
        if (Math.abs(priceChange) > 5) {
          addTopAlert(`${topCrypto.name} price moved by ${priceChange.toFixed(2)}%!`, priceChange > 0 ? 'success' : 'warning');
        }
      }
      if (weather.data.length > 0) {
        const heavyWeather = weather.data.find((w) => w.weather[0].main === 'Rain' && w.weather[0].description.includes('heavy'));
        if (heavyWeather) {
          addTopAlert(`Heavy rain in ${heavyWeather.name}!`, 'warning');
        }
      }
    }, 20000);

    return () => {
      clearInterval(cryptoFetchInterval);
      clearInterval(cryptoUpdateInterval);
      clearInterval(topAlertInterval);
    };
  }, [cryptos, fetchCryptoData]);

  const handleFavorite = useCallback((type, item) => {
    if (!session) {
      addBottomAlertLocal('You need to sign in to use this feature', 'warning');
      return;
    }
    dispatch(addFavorite(type, item));
    addBottomAlertLocal(`${item} added to favorites`, 'success');
  }, [dispatch, session]);

  const addCity = useCallback(() => {
    const now = Date.now();
    if (cityButtonDisabled) return;

    if (now - lastCityClickTime < 5000) {
      setCityClickCount((prev) => prev + 1);
      if (cityClickCount >= 4) {
        addBottomAlertLocal('Too many requests, please wait', 'warning');
        setCityButtonDisabled(true);
        setTimeout(() => {
          setCityButtonDisabled(false);
          setCityClickCount(0);
        }, 10000);
        return;
      }
    } else {
      setCityClickCount(1);
    }
    setLastCityClickTime(now);

    const trimmedCity = newCity.trim().toLowerCase() === 'benglore' ? 'bangalore' : newCity.trim().toLowerCase(); // Normalize to lowercase
    if (trimmedCity && !cities.includes(trimmedCity)) {
      if (!cityList.some((city) => city.toLowerCase() === trimmedCity)) {
        addBottomAlertLocal(`City "${trimmedCity}" doesn't exist`, 'error');
        return;
      }
      console.log('Adding city:', trimmedCity);
      const updatedCities = [...cities, trimmedCity];
      setCities(updatedCities);
      setNewCity('');
      setCitySuggestions([]);
      dispatch(fetchWeather(updatedCities))
        .then(() => addBottomAlertLocal(`City "${trimmedCity}" added successfully`, 'success'))
        .catch(() => addBottomAlertLocal(`Failed to add city "${trimmedCity}"`, 'error'));
    }
  }, [newCity, cities, cityButtonDisabled, cityClickCount, lastCityClickTime, dispatch]);

  const addCrypto = useCallback(() => {
    const now = Date.now();
    if (cryptoButtonDisabled) return;

    if (now - lastCryptoClickTime < 5000) {
      setCryptoClickCount((prev) => prev + 1);
      if (cryptoClickCount >= 4) {
        addBottomAlertLocal('Too many requests, please wait', 'warning');
        setCryptoButtonDisabled(true);
        setTimeout(() => {
          setCryptoButtonDisabled(false);
          setCryptoClickCount(0);
        }, 10000);
        return;
      }
    } else {
      setCryptoClickCount(1);
    }
    setLastCryptoClickTime(now);

    const trimmedCrypto = newCrypto.trim().toLowerCase();
    if (trimmedCrypto && !cryptos.includes(trimmedCrypto)) {
      if (!cryptoList.includes(trimmedCrypto)) {
        addBottomAlertLocal(`Crypto "${trimmedCrypto}" doesn't exist`, 'error');
        return;
      }
      console.log('Adding crypto:', trimmedCrypto);
      const updatedCryptos = [...cryptos, trimmedCrypto];
      setCryptos(updatedCryptos);
      setNewCrypto('');
      setCryptoSuggestions([]);
      fetchCryptoData();
      addBottomAlertLocal(`Crypto "${trimmedCrypto}" added successfully`, 'success');
    } else {
      addBottomAlertLocal(`Crypto "${trimmedCrypto}" already exists or invalid`, 'error');
    }
  }, [newCrypto, cryptos, cryptoButtonDisabled, cryptoClickCount, lastCryptoClickTime, fetchCryptoData]);

  const deleteCity = useCallback((cityToDelete) => {
    console.log('Deleting city:', cityToDelete);
    const updatedCities = cities.filter((city) => city !== cityToDelete);
    setCities(updatedCities);
    dispatch(fetchWeather(updatedCities));
    addBottomAlertLocal(`City "${cityToDelete}" deleted`, 'success');
  }, [cities, dispatch]);

  const deleteCrypto = useCallback((cryptoToDelete) => {
    console.log('Deleting crypto:', cryptoToDelete);
    const updatedCryptos = cryptos.filter((crypto) => crypto !== cryptoToDelete);
    setCryptos(updatedCryptos);
    fetchCryptoData();
    addBottomAlertLocal(`Crypto "${cryptoToDelete}" deleted`, 'success');
  }, [cryptos, fetchCryptoData]);

  const handleCityInputChange = useCallback((e) => {
    const value = e.target.value;
    setNewCity(value);
    if (value) {
      const filtered = cityList.filter((city) =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setCitySuggestions(filtered);
    } else {
      setCitySuggestions([]);
    }
  }, []);

  const handleCryptoInputChange = useCallback((e) => {
    const value = e.target.value;
    setNewCrypto(value);
    if (value) {
      const filtered = cryptoList.filter((crypto) =>
        crypto.toLowerCase().startsWith(value.toLowerCase())
      );
      setCryptoSuggestions(filtered);
    } else {
      setCryptoSuggestions([]);
    }
  }, []);

  const selectCity = useCallback((city) => {
    setNewCity(city);
    setCitySuggestions([]);
  }, []);

  const selectCrypto = useCallback((crypto) => {
    setNewCrypto(crypto);
    setCryptoSuggestions([]);
  }, []);

  return (
    <div className="container mx-auto p-6 flex flex-col min-h-screen">
      {/* Weather Section */}
      <div className="mb-12">
        <h2>Weather</h2>
        <div className="relative flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={newCity}
            onChange={handleCityInputChange}
            placeholder="Add a city (e.g., Paris, Sydney, Dubai)"
            className="flex-1 p-2 rounded-lg bg-gray-800 text-neon-blue placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          {citySuggestions.length > 0 && (
            <ul className="absolute top-12 left-0 w-full sm:w-1/2 bg-gray-800 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
              {citySuggestions.map((city) => (
                <li
                  key={city}
                  onClick={() => selectCity(city)}
                  className="p-2 hover:bg-gray-700 cursor-pointer text-neon-blue"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
          <button onClick={addCity} className={`button ${cityButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={cityButtonDisabled}>
            {cityButtonDisabled ? 'Blocked (10s)' : 'Add City'}
          </button>
        </div>
        {weather.loading && <div className="spinner"></div>}
        {weather.error && <p className="text-red-500 text-center">{weather.error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weather.data.map((cityWeather) => (
            <WeatherCard
              key={cityWeather.name}
              cityWeather={cityWeather}
              onFavorite={() => handleFavorite('cities', cityWeather.name)}
              onDelete={() => deleteCity(cityWeather.name)}
            />
          ))}
        </div>
      </div>

      {/* Crypto Section */}
      <div className="mb-12">
        <h2>Cryptocurrency</h2>
        <div className="relative flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={newCrypto}
            onChange={handleCryptoInputChange}
            placeholder="Add a crypto (e.g., dogecoin, cardano, solana)"
            className="flex-1 p-2 rounded-lg bg-gray-800 text-neon-blue placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          {cryptoSuggestions.length > 0 && (
            <ul className="absolute top-12 left-0 w-full sm:w-1/2 bg-gray-800 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
              {cryptoSuggestions.map((crypto) => (
                <li
                  key={crypto}
                  onClick={() => selectCrypto(crypto)}
                  className="p-2 hover:bg-gray-700 cursor-pointer text-neon-blue"
                >
                  {crypto}
                </li>
              ))}
            </ul>
          )}
          <button onClick={addCrypto} className={`button ${cryptoButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={cryptoButtonDisabled}>
            {cryptoButtonDisabled ? 'Blocked (10s)' : 'Add Crypto'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptoData.map((cryptoItem) => (
            <CryptoCard
              key={cryptoItem.id}
              cryptoData={cryptoItem}
              onFavorite={() => handleFavorite('cryptos', cryptoItem.id)}
              onDelete={() => deleteCrypto(cryptoItem.id)}
            />
          ))}
        </div>
      </div>

      {/* News Section */}
      <div className="mb-12">
        <h2>Crypto News</h2>
        {news.loading && <div className="spinner"></div>}
        {news.error || news.data.length === 0 ? (
          <p className="text-gray-500 text-center">No news available at the moment</p>
        ) : (
          <div className="flex flex-col gap-6">
            {news.data.slice(0, 5).map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Alerts */}
      <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-50">
        {bottomAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-gray-800 text-white p-4 rounded-lg shadow-lg animate-slide-up max-w-sm w-full text-center border-l-4 ${
              alert.type === 'success' ? 'border-neon-blue' : alert.type === 'error' ? 'border-red-500' : 'border-yellow-500'
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>

      {/* Top Right Alerts */}
      <div className="fixed top-16 right-4 flex flex-col gap-2 z-50">
        {topAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-gray-900 text-neon-blue p-3 rounded-lg shadow-lg animate-slide-down max-w-xs w-full border-t-4 ${
              alert.type === 'success' ? 'border-green-500' : alert.type === 'warning' ? 'border-red-500' : 'border-neon-blue'
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>

      <Footer className="mt-auto" />
    </div>
  );
}