import { useState, useEffect, useCallback } from 'react';

// Hook para buscar dados de temperatura usando Open-Meteo API
export const useWeatherData = (locations = [], isActive = false, updateInterval = 60000) => {
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    if (!locations.length) return;

    setIsLoading(true);
    setError(null);

    try {
      const weatherPromises = locations.map(async (location) => {
        const { lat, lng, name } = location;
        
        // Open-Meteo API - não requer chave de API
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados para ${name}: ${response.status}`);
        }

        const data = await response.json();
        
        return {
          id: location.id,
          name: location.name,
          position: { lat, lng },
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
          unit: data.current_units.temperature_2m,
          lastUpdate: new Date().toISOString()
        };
      });

      const results = await Promise.all(weatherPromises);
      setWeatherData(results);
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('Erro ao buscar dados meteorológicos:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [locations]);

  // Buscar dados iniciais
  useEffect(() => {
    if (locations.length > 0) {
      fetchWeatherData();
    }
  }, [fetchWeatherData]);

  // Atualizar dados em tempo real
  useEffect(() => {
    if (!isActive || !locations.length) return;

    const interval = setInterval(() => {
      fetchWeatherData();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isActive, fetchWeatherData, updateInterval]);

  const addLocation = useCallback((location) => {
    // Esta função será implementada no componente pai
    // para adicionar novas localizações
  }, []);

  const removeLocation = useCallback((locationId) => {
    // Esta função será implementada no componente pai
    // para remover localizações
  }, []);

  return {
    weatherData,
    isLoading,
    error,
    lastUpdate,
    addLocation,
    removeLocation,
    refreshData: fetchWeatherData
  };
};

