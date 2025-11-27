# Weather App

A modern, beautiful weather application built with React, TypeScript, Vite, and Material-UI. Get real-time weather information for any city around the world.

## Features

- 🌍 **City Search**: Search for any city with autocomplete suggestions
- 🌤️ **Real-time Weather**: Get current weather conditions, temperature, humidity, wind speed, and more
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📱 **Responsive**: Works perfectly on desktop and mobile devices
- ⚡ **Fast**: Built with Vite for lightning-fast development and builds
- 🔄 **State Management**: Uses Zustand for efficient state management
- 🎯 **Type Safe**: Full TypeScript support

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **OpenWeatherMap API** - Weather data

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your OpenWeatherMap API key:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
   - Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server

## API Integration

This app uses the OpenWeatherMap API:
- **Current Weather**: `/weather` endpoint
- **City Search**: `/geo/1.0/direct` endpoint for city suggestions

Make sure to:
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add it to your `.env` file as `VITE_WEATHER_API_KEY`

[Live Demo](https://myweatherappfree.netlify.app)
