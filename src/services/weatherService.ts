import { getWeatherByCity, searchCities } from './api';
import { useWeatherStore } from '../store/weatherStore';

export const fetchWeather = async (city: string) => {
  const store = useWeatherStore.getState();
  store.setLoading(true);
  store.clearError();
  
  try {
    const { data } = await getWeatherByCity(city);
    store.setWeatherData(data);
    store.addSearchHistory({ name: data.name, lat: data.coord.lat, lon: data.coord.lon, country: data.sys.country });
  } catch (error: any) {
    store.setError(error.response?.data?.message || 'Failed to fetch weather');
  } finally {
    store.setLoading(false);
  }
};

export const fetchCitySuggestions = async (query: string) => {
  try {
    const { data } = await searchCities(query);
    return Array.isArray(data) ? data.map((city: any) => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
      sys: { country: city.country }
    })) : [];
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    return [];
  }
};