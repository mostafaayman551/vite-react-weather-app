import { useState, useEffect, useRef } from 'react';
import { TextField, Box, List, ListItem, ListItemButton, CircularProgress, Paper, Typography } from '@mui/material';
import { SearchRounded, LocationOn } from '@mui/icons-material';
import { fetchWeather, fetchCitySuggestions } from '../services/weatherService';

interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  sys?: { country: string };
}

export const SearchBar = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 2) {
      setLoading(true);
      const results = await fetchCitySuggestions(value);
      setSuggestions(results);
      setShowSuggestions(true);
      setLoading(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (cityName: string, country?: string) => {
    const fullCityName = country ? `${cityName}, ${country}` : cityName;
    fetchWeather(fullCityName);
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }} ref={searchRef}>
      <TextField
        fullWidth
        placeholder="Search for a city..."
        value={input}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        InputProps={{
          startAdornment: <SearchRounded sx={{ mr: 1, color: 'action.active' }} />,
          endAdornment: loading && <CircularProgress size={20} />,
        }}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          },
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            width: '100%',
            mt: 1,
            maxHeight: 300,
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <List sx={{ py: 0 }}>
            {suggestions.map((city, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemButton
                  onClick={() => handleSelectCity(city.name, city.country || city.sys?.country)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  <LocationOn sx={{ mr: 1, color: '#667eea' }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {city.name}
                      {city.state && `, ${city.state}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {city.country || city.sys?.country}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};