import { useState } from 'react';
import { Box, Tabs, Tab, Container, IconButton, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { ColdestCities } from './ColdestCities';
import { HottestCities } from './HottestCities';
import { RainWindView } from './RainWindView';
import { DisastersView } from './DisastersView';
import { WeatherStats } from './WeatherStats';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`insights-tabpanel-${index}`}
      aria-labelledby={`insights-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const InsightsView = () => {
  const [value, setValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flex: 1,
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              minHeight: 64,
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
          <Tab label="Coldest Cities" />
          <Tab label="Hottest Cities" />
          <Tab label="Rain & Wind" />
          <Tab label="Disasters & Alerts" />
        </Tabs>
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={handleRefresh}
            sx={{
              color: 'white',
              ml: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <WeatherStats />
      
      <TabPanel value={value} index={0}>
        <ColdestCities refreshKey={refreshKey} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HottestCities refreshKey={refreshKey} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RainWindView />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <DisastersView refreshKey={refreshKey} />
      </TabPanel>
    </Container>
  );
};

