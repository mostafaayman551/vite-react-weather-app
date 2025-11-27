import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Chip, Alert } from '@mui/material';
import { Warning, LocationOn, Whatshot, AcUnit, Cloud, Thunderstorm } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchDisasters } from '../services/insightsService';
import { WeatherAlert } from '../types/weather';

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'extreme':
      return '#d32f2f';
    case 'severe':
      return '#f57c00';
    case 'moderate':
      return '#fbc02d';
    default:
      return '#757575';
  }
};

const getSeverityIcon = (type: string) => {
  switch (type) {
    case 'heat':
      return <Whatshot sx={{ fontSize: 28 }} />;
    case 'cold':
      return <AcUnit sx={{ fontSize: 28 }} />;
    case 'storm':
      return <Thunderstorm sx={{ fontSize: 28 }} />;
    case 'rain':
      return <Cloud sx={{ fontSize: 28 }} />;
    default:
      return <Warning sx={{ fontSize: 28 }} />;
  }
};

interface DisastersViewProps {
  refreshKey?: number;
}

export const DisastersView = ({ refreshKey }: DisastersViewProps) => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchDisasters();
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshKey]);

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
        ⚠️ Weather Alerts & Disasters
      </Typography>

      {alerts.length === 0 ? (
        <Alert
          severity="success"
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            mb: 2,
          }}
        >
          No severe weather alerts detected at this time. Stay safe!
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {alerts.map((alert, index) => (
            <Grid item xs={12} md={6} key={alert.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          color: getSeverityColor(alert.severity),
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {getSeverityIcon(alert.type)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOn sx={{ fontSize: 18, color: '#667eea' }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {alert.city}, {alert.country}
                          </Typography>
                        </Box>
                        <Chip
                          label={alert.severity.toUpperCase()}
                          size="small"
                          sx={{
                            background: getSeverityColor(alert.severity),
                            color: 'white',
                            fontWeight: 600,
                            mb: 1,
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: getSeverityColor(alert.severity) }}>
                      {alert.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                      {alert.description}
                    </Typography>

                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                      <Typography variant="caption" sx={{ color: '#999', textTransform: 'capitalize' }}>
                        Type: {alert.type}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

