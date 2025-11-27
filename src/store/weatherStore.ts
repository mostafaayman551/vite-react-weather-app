import { create } from 'zustand';
import { WeatherData, SearchResult } from '../types/weather';

interface WeatherStore {
  weatherData: WeatherData | null;
  searchHistory: SearchResult[];
  loading: boolean;
  error: string | null;
  setWeatherData: (data: WeatherData) => void;
  addSearchHistory: (result: SearchResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  weatherData: null,
  searchHistory: [],
  loading: false,
  error: null,
  setWeatherData: (data) => set({ weatherData: data }),
  addSearchHistory: (result) =>
    set((state) => ({
      searchHistory: [result, ...state.searchHistory.slice(0, 4)],
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));