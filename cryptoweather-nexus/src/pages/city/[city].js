import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../../redux/actions/weatherActions';

export default function CityDetail() {
  const router = useRouter();
  const { city } = router.query;
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather);

  useEffect(() => {
    if (city) {
      dispatch(fetchWeather([city]));
    }
  }, [city, dispatch]);

  if (!city) return <p>Loading...</p>;

  const cityWeather = weather.data.find((w) => w.name.toLowerCase() === city.toLowerCase());

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{city} Weather Details</h1>
      {weather.loading && <p>Loading...</p>}
      {weather.error && <p className="text-red-500">{weather.error}</p>}
      {cityWeather ? (
        <div className="card">
          <h2 className="text-xl font-semibold">{cityWeather.name}</h2>
          <p>Temperature: {(cityWeather.main.temp - 273.15).toFixed(2)}°C</p>
          <p>Humidity: {cityWeather.main.humidity}%</p>
          <p>Conditions: {cityWeather.weather[0].description}</p>
          {/* Placeholder for historical data */}
          <p className="mt-4">Historical data not available in free API plan.</p>
        </div>
      ) : (
        <p>No data available for {city}.</p>
      )}
    </div>
  );
}