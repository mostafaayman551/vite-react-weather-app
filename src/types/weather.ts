export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  coord: { lon: number; lat: number };
  weather: Weather[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
  rain?: { '1h'?: number; '3h'?: number };
  snow?: { '1h'?: number; '3h'?: number };
}

export interface SearchResult {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

export interface CityWeather {
  name: string;
  country: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  lat: number;
  lon: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor' | 'unknown';
  city: string;
  country: string;
  type: string;
  coordinates: { lat: number; lon: number };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Weather[];
  wind: { speed: number; deg: number };
  rain?: { '3h'?: number };
  clouds: { all: number };
  dt_txt: string;
}