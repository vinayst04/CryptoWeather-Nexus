import Tilt from 'react-parallax-tilt';

export default function WeatherCard({ cityWeather, onFavorite, onDelete }) {
  // Convert temperature from Kelvin to Celsius
  const tempCelsius = (cityWeather.main.temp - 273.15).toFixed(2);

  return (
    <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable={true} glareMaxOpacity={0.3} glareColor="#00f7ff">
      <div className={`weather-card ${cityWeather.name.toLowerCase().replace(' ', '-')}`}>
        <h3 className="text-xl font-semibold">{cityWeather.name}</h3>
        <p>Temperature: {tempCelsius}°C</p> {/* Converted to Celsius */}
        <p>Weather: {cityWeather.weather[0].description}</p>
        <p>Humidity: {cityWeather.main.humidity}%</p>
        <button onClick={onFavorite} className="button mt-2 mr-2">Add to Favorites</button>
        <button onClick={onDelete} className="button mt-2 bg-red-600 hover:bg-red-700">Delete</button>
      </div>
    </Tilt>
  );
}