import { useState } from 'react';
import { Container, Box, ThemeProvider, createTheme, CssBaseline, Alert, Snackbar, Typography, Tabs, Tab } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { InsightsView } from './components/InsightsView';
import { useWeatherStore } from './store/weatherStore';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { error, clearError, loading } = useWeatherStore();
  const [view, setView] = useState(0);

  const handleViewChange = (_event: React.SyntheticEvent, newValue: number) => {
    setView(newValue);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4,
          }}
        >
          <Container maxWidth={view === 1 ? 'lg' : 'sm'}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Weather App
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Tabs
                  value={view}
                  onChange={handleViewChange}
                  sx={{
                    '& .MuiTab-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      minHeight: 48,
                      '&.Mui-selected': {
                        color: 'white',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: 'white',
                      height: 3,
                    },
                  }}
                >
                  <Tab label="Search Weather" />
                  <Tab label="Weather Insights" />
                </Tabs>
              </Box>

              {view === 0 && (
                <>
                  <SearchBar />
                  {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <Typography sx={{ color: 'white' }}>Loading weather data...</Typography>
                    </Box>
                  )}
                  <WeatherCard />
                </>
              )}

              {view === 1 && <InsightsView />}
            </Box>
          </Container>
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={clearError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;