import { motion } from 'framer-motion';
import { Card, CardContent, Box, Typography, Grid, Paper } from '@mui/material';
import { Thermostat, Compress, Air, WaterDrop } from '@mui/icons-material';
import { useWeatherStore } from '../store/weatherStore';

const getWeatherIcon = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const getWeatherEmoji = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('cloud')) return '☁️';
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
  if (conditionLower.includes('thunder')) return '⛈️';
  if (conditionLower.includes('snow')) return '❄️';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
  return '☀️';
};

export const WeatherCard = () => {
  const { weatherData } = useWeatherStore();

  if (!weatherData) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: 'white',
        }}
      >
        <Typography variant="h6">Search for a city to see weather information</Typography>
      </Paper>
    );
  }

  const temp = Math.round(weatherData.main.temp);
  const condition = weatherData.weather[0].main;
  const iconCode = weatherData.weather[0].icon;
  const minTemp = Math.round(weatherData.main.temp_min);
  const maxTemp = Math.round(weatherData.main.temp_max);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
            {weatherData.name}, {weatherData.sys.country}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={getWeatherIcon(iconCode)}
                alt={condition}
                sx={{ width: 100, height: 100 }}
                onError={(e: any) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <Typography
                component="span"
                sx={{ fontSize: 64, display: 'none' }}
              >
                {getWeatherEmoji(condition)}
              </Typography>
              <Box>
                <Typography variant="h2" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {temp}°C
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', textTransform: 'capitalize' }}>
                  {weatherData.weather[0].description}
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>
                  {minTemp}° / {maxTemp}°
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Air sx={{ fontSize: 28 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Wind Speed
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {weatherData.wind.speed} m/s
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <WaterDrop sx={{ fontSize: 28 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Humidity
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {weatherData.main.humidity}%
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 2,
                  background: 'rgba(102, 126, 234, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Thermostat sx={{ fontSize: 28, color: '#667eea' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Feels like
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    {Math.round(weatherData.main.feels_like)}°C
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 2,
                  background: 'rgba(102, 126, 234, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Compress sx={{ fontSize: 28, color: '#667eea' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Pressure
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    {weatherData.main.pressure} hPa
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};