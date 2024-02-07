import React, { useState, useEffect } from 'react';
import UserTable from './UserTable';
import { useNavigate } from 'react-router-dom';

import { AppBar, Toolbar, Typography, IconButton, Card, CardContent, Box, CircularProgress } from '@mui/material';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import { logOut } from './AuthService'; // Import the signOut function from AuthService

function HomePage() {
  const [weatherData, setWeather] = useState(null);
  const [name, setName] = useState('London');
  const navigate = useNavigate();

  const fetchWeatherData = async () => {
    const apiKey = 'cad99ecd576a508e22ed90e23d32af39';
    const city = 'London'; // Example city, can be dynamic
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);
 
  // Function to render weather icon based on weather conditions
  const renderWeatherIcon = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clear':
        return <WiDaySunny className="weatherIcon" />;
      case 'Clouds':
        return <WiCloudy className="weatherIcon" />;
      case 'Rain':
        return <WiRain className="weatherIcon" />;
      case 'Snow':
        return <WiSnow className="weatherIcon" />;
      case 'Thunderstorm':
        return <WiThunderstorm className="weatherIcon" />;
      default:
        return null;
    }
  };
  var tempCelsius;
  if(weatherData){
     tempCelsius = weatherData.main.temp - 273.15;
  }
  else{
     tempCelsius =  273.15;
  }
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/login'); // Redirect to the login page on successful signout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="root">
       <AppBar position="sticky"> {/* Changed from "static" to "sticky" */}
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          {/* Add your icon here */}
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Weather App
        </Typography>
        <IconButton color="inherit" onClick={handleSignOut}>
          Sign Out
        </IconButton>
      </Toolbar>
    </AppBar>
      <Box mt={2} p={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        {weatherData ? (
          <Card sx={{
            minWidth: 300,
            maxWidth: 450,
            background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
            borderRadius: '20px',
            boxShadow: '5px 5px 15px #aaaaaa',
            textAlign: 'center',
            padding: '20px',
            color: '#333',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', // Set your desired font here
          }}>
            <CardContent>
              <Box sx={{ fontSize: '5rem', color: '#1976d2' }}>
                {renderWeatherIcon(weatherData.weather[0].main)}
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: '2.5rem', mb: 2 }}>
              {name} {/* Display the place name here */}
            </Typography>
              <Typography variant="h5" component="div" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {Math.round(tempCelsius)}°C
              </Typography>
              <Typography sx={{ fontSize: '1.2rem', opacity: 0.7 }}>
                {weatherData.weather[0].description}
              </Typography>
              <Typography sx={{ fontSize: '1rem' }}>
                Wind: {weatherData.wind.speed} m/s
              </Typography>
              {weatherData.rain && (
                <Typography sx={{ fontSize: '1rem' }}>
                  Rain: {weatherData.rain["1h"]} mm
                </Typography>
              )}
              <Typography sx={{ fontSize: '1rem' }}>
                Humidity: {weatherData.main.humidity}%
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <CircularProgress />
        )}
      </Box>
      <Box mt={2} p={2}>
        <UserTable />
      </Box>
    </div>
  );
}

export default HomePage;
