import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Chip } from '@mui/material';
import { Thermostat, LocationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchColdestCities } from '../services/insightsService';
import { CityWeather } from '../types/weather';

interface ColdestCitiesProps {
  refreshKey?: number;
}

export const ColdestCities = ({ refreshKey }: ColdestCitiesProps) => {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchColdestCities();
    setCities(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
        🥶 10 Coldest Cities
      </Typography>
      <Grid container spacing={2}>
        {cities.map((city, index) => (
          <Grid item xs={12} sm={6} key={`${city.name}-${city.country}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ color: '#667eea', fontSize: 20 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {city.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {city.country}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      component="img"
                      src={getWeatherIcon(city.icon)}
                      alt={city.condition}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Thermostat sx={{ color: '#2196f3', fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
                      {Math.round(city.temp)}°C
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={`Min: ${Math.round(city.tempMin)}°C`}
                      size="small"
                      sx={{ background: '#e3f2fd', color: '#1976d2' }}
                    />
                    <Chip
                      label={`Max: ${Math.round(city.tempMax)}°C`}
                      size="small"
                      sx={{ background: '#e3f2fd', color: '#1976d2' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      {cities.length === 0 && (
        <Typography sx={{ color: 'white', textAlign: 'center', py: 4 }}>
          No data available
        </Typography>
      )}
    </Box>
  );
};

