import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import { fetchColdestCities, fetchHottestCities, fetchDisasters } from '../services/insightsService';
import { motion } from 'framer-motion';

export const WeatherStats = () => {
  const [stats, setStats] = useState({
    coldest: 0,
    hottest: 0,
    alerts: 0,
    loading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [coldest, hottest, disasters] = await Promise.all([
          fetchColdestCities(),
          fetchHottestCities(),
          fetchDisasters(),
        ]);

        setStats({
          coldest: coldest.length > 0 ? Math.round(coldest[0].temp) : 0,
          hottest: hottest.length > 0 ? Math.round(hottest[0].temp) : 0,
          alerts: disasters.length,
          loading: false,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadStats();
  }, []);

  if (stats.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} sx={{ color: 'white' }} />
      </Box>
    );
  }

  const statCards = [
    {
      label: 'Coldest City',
      value: `${stats.coldest}°C`,
      color: '#2196f3',
      icon: '🥶',
    },
    {
      label: 'Hottest City',
      value: `${stats.hottest}°C`,
      color: '#f44336',
      icon: '🔥',
    },
    {
      label: 'Active Alerts',
      value: stats.alerts.toString(),
      color: stats.alerts > 0 ? '#f57c00' : '#4caf50',
      icon: '⚠️',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={4} key={stat.label}>
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
                textAlign: 'center',
              }}
            >
              <CardContent>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {stat.icon}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

