import { getWeatherForMultipleCities, getWeatherForecast, MAJOR_CITIES } from './api';
import { CityWeather, WeatherAlert, ForecastItem } from '../types/weather';

export const fetchColdestCities = async (): Promise<CityWeather[]> => {
  try {
    const citiesData = await getWeatherForMultipleCities(MAJOR_CITIES);
    const cities: CityWeather[] = citiesData
      .map((data: any) => ({
        name: data.name,
        country: data.sys?.country || 'N/A',
        temp: data.main.temp,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        condition: data.weather[0]?.main || 'Unknown',
        icon: data.weather[0]?.icon || '01d',
        lat: data.coord.lat,
        lon: data.coord.lon,
      }))
      .filter((city: CityWeather) => city.name && city.country !== 'N/A')
      .sort((a: CityWeather, b: CityWeather) => a.temp - b.temp)
      .slice(0, 10);
    return cities;
  } catch (error) {
    console.error('Error fetching coldest cities:', error);
    return [];
  }
};

export const fetchHottestCities = async (): Promise<CityWeather[]> => {
  try {
    const citiesData = await getWeatherForMultipleCities(MAJOR_CITIES);
    const cities: CityWeather[] = citiesData
      .map((data: any) => ({
        name: data.name,
        country: data.sys?.country || 'N/A',
        temp: data.main.temp,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        condition: data.weather[0]?.main || 'Unknown',
        icon: data.weather[0]?.icon || '01d',
        lat: data.coord.lat,
        lon: data.coord.lon,
      }))
      .filter((city: CityWeather) => city.name && city.country !== 'N/A')
      .sort((a: CityWeather, b: CityWeather) => b.temp - a.temp)
      .slice(0, 10);
    return cities;
  } catch (error) {
    console.error('Error fetching hottest cities:', error);
    return [];
  }
};

export const fetchDisasters = async (): Promise<WeatherAlert[]> => {
  try {
    // Fetch multiple cities and check for severe weather conditions
    const citiesData = await getWeatherForMultipleCities(MAJOR_CITIES);
    const alerts: WeatherAlert[] = [];

    citiesData.forEach((data: any) => {
      if (!data) return;

      const city = data.name;
      const country = data.sys?.country || 'Unknown';
      const condition = data.weather[0]?.main?.toLowerCase() || '';
      const windSpeed = data.wind?.speed || 0;
      const rain = data.rain?.['1h'] || data.rain?.['3h'] || 0;
      const temp = data.main?.temp || 0;

      // Detect severe weather conditions
      const severeConditions: WeatherAlert[] = [];

      // High wind speeds (gale/hurricane force)
      if (windSpeed > 15) {
        severeConditions.push({
          id: `${city}-wind-${Date.now()}`,
          title: 'High Wind Warning',
          description: `Extreme wind speeds detected: ${windSpeed.toFixed(1)} m/s (${(windSpeed * 3.6).toFixed(1)} km/h). Take caution.`,
          severity: windSpeed > 25 ? 'extreme' : windSpeed > 20 ? 'severe' : 'moderate',
          city,
          country,
          type: 'wind',
          coordinates: { lat: data.coord.lat, lon: data.coord.lon },
        });
      }

      // Heavy rain/flooding
      if (rain > 10) {
        severeConditions.push({
          id: `${city}-rain-${Date.now()}`,
          title: 'Heavy Rainfall Alert',
          description: `Heavy rainfall detected: ${rain.toFixed(1)} mm/h. Flood warning in effect.`,
          severity: rain > 30 ? 'extreme' : rain > 20 ? 'severe' : 'moderate',
          city,
          country,
          type: 'rain',
          coordinates: { lat: data.coord.lat, lon: data.coord.lon },
        });
      }

      // Extreme temperatures
      if (temp < -20) {
        severeConditions.push({
          id: `${city}-cold-${Date.now()}`,
          title: 'Extreme Cold Warning',
          description: `Extremely cold temperatures: ${temp.toFixed(1)}°C. Risk of hypothermia and frostbite.`,
          severity: temp < -30 ? 'extreme' : 'severe',
          city,
          country,
          type: 'cold',
          coordinates: { lat: data.coord.lat, lon: data.coord.lon },
        });
      }

      if (temp > 40) {
        severeConditions.push({
          id: `${city}-heat-${Date.now()}`,
          title: 'Extreme Heat Warning',
          description: `Dangerously high temperatures: ${temp.toFixed(1)}°C. Heat stroke risk. Stay hydrated.`,
          severity: temp > 45 ? 'extreme' : 'severe',
          city,
          country,
          type: 'heat',
          coordinates: { lat: data.coord.lat, lon: data.coord.lon },
        });
      }

      // Thunderstorms and severe weather
      if (condition.includes('thunder') || condition.includes('storm')) {
        severeConditions.push({
          id: `${city}-storm-${Date.now()}`,
          title: 'Severe Storm Warning',
          description: `Severe storm conditions detected. Seek shelter immediately.`,
          severity: 'severe',
          city,
          country,
          type: 'storm',
          coordinates: { lat: data.coord.lat, lon: data.coord.lon },
        });
      }

      alerts.push(...severeConditions);
    });

    // Sort by severity (extreme first)
    const severityOrder = { extreme: 0, severe: 1, moderate: 2, minor: 3, unknown: 4 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return alerts.slice(0, 20); // Return top 20 most severe
  } catch (error) {
    console.error('Error fetching disasters:', error);
    return [];
  }
};

export const fetchRainWindData = async (city: string): Promise<ForecastItem[]> => {
  try {
    // First get coordinates
    const { getWeatherByCity } = await import('./api');
    const { data: weatherData } = await getWeatherByCity(city);
    
    if (!weatherData) return [];

    // Get forecast
    const { data: forecastData } = await getWeatherForecast(
      weatherData.coord.lat,
      weatherData.coord.lon
    );

    return forecastData?.list?.slice(0, 8) || []; // Next 24 hours (8 * 3 hours)
  } catch (error) {
    console.error('Error fetching rain/wind data:', error);
    return [];
  }
};

