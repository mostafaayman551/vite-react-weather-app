import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'your_api_key_here';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

export const getWeatherByCoords = (lat: number, lon: number) =>
  weatherAPI.get('/weather', { params: { lat, lon } });

export const getWeatherByCity = (city: string) =>
  weatherAPI.get('/weather', { params: { q: city } });

export const searchCities = (query: string) =>
  axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
    params: { q: query, limit: 5, appid: API_KEY },
  });

// Fetch weather for multiple cities
export const getWeatherForMultipleCities = async (cities: string[]) => {
  const promises = cities.map(city => 
    weatherAPI.get('/weather', { params: { q: city } })
      .then(res => res.data)
      .catch(() => null)
  );
  const results = await Promise.all(promises);
  return results.filter(Boolean);
};

// Get weather alerts and disasters (using One Call API for alerts)
export const getWeatherAlerts = (lat: number, lon: number) =>
  weatherAPI.get('/onecall', { 
    params: { 
      lat, 
      lon, 
      exclude: 'minutely,hourly,daily',
      appid: API_KEY 
    } 
  }).catch(() => ({ data: null }));

// Get forecast data with more details for rain and wind
export const getWeatherForecast = (lat: number, lon: number) =>
  weatherAPI.get('/forecast', { params: { lat, lon } });

// List of major cities around the world for temperature comparison
export const MAJOR_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'London', 'Paris', 'Berlin', 'Madrid', 'Rome',
  'Tokyo', 'Beijing', 'Shanghai', 'Mumbai', 'Delhi',
  'Moscow', 'Istanbul', 'Cairo', 'Sydney', 'Melbourne',
  'Toronto', 'Vancouver', 'São Paulo', 'Buenos Aires', 'Mexico City',
  'Dubai', 'Singapore', 'Bangkok', 'Jakarta', 'Manila',
  'Oslo', 'Stockholm', 'Helsinki', 'Reykjavik', 'Anchorage',
  'Miami', 'Las Vegas', 'Riyadh', 'Johannesburg', 'Lagos',
];