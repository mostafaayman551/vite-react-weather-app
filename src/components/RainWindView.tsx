import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Grid, CircularProgress, Paper } from '@mui/material';
import { Air, WaterDrop, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchRainWindData } from '../services/insightsService';
import { ForecastItem } from '../types/weather';

export const RainWindView = () => {
  const [city, setCity] = useState('London');
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadForecast(city);
  }, []);

  const loadForecast = async (cityName: string) => {
    setLoading(true);
    const data = await fetchRainWindData(cityName);
    setForecast(data);
    setLoading(false);
  };

  const handleSearch = () => {
    if (city.trim()) {
      loadForecast(city.trim());
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
        🌧️ Rain & Wind Forecast
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            px: 4,
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Search
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      )}

      {!loading && forecast.length > 0 && (
        <Grid container spacing={2}>
          {forecast.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      {formatDate(item.dt_txt)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {formatTime(item.dt_txt)}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box
                        component="img"
                        src={getWeatherIcon(item.weather[0]?.icon || '01d')}
                        alt={item.weather[0]?.description}
                        sx={{ width: 50, height: 50 }}
                      />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {Math.round(item.main.temp)}°C
                      </Typography>
                    </Box>

                    <Paper
                      sx={{
                        p: 1.5,
                        mb: 1.5,
                        background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <WaterDrop sx={{ fontSize: 24 }} />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Rain
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {item.rain?.['3h']?.toFixed(1) || '0.0'} mm
                        </Typography>
                      </Box>
                    </Paper>

                    <Paper
                      sx={{
                        p: 1.5,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Air sx={{ fontSize: 24 }} />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Wind Speed
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {item.wind.speed.toFixed(1)} m/s
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {(item.wind.speed * 3.6).toFixed(1)} km/h
                        </Typography>
                      </Box>
                    </Paper>

                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #eee' }}>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        Humidity: {item.main.humidity}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && forecast.length === 0 && (
        <Typography sx={{ color: 'white', textAlign: 'center', py: 4 }}>
          No forecast data available
        </Typography>
      )}
    </Box>
  );
};

