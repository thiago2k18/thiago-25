import { useState, useEffect, useCallback } from 'react';

// Hook para buscar dados de poluição usando AQICN API
export const usePollutionData = (locations = [], isActive = false, updateInterval = 300000) => {
  const [pollutionData, setPollutionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchPollutionData = useCallback(async () => {
    if (!locations.length) return;

    setIsLoading(true);
    setError(null);

    try {
      const pollutionPromises = locations.map(async (location) => {
        const { lat, lng, name } = location;
        
        // AQICN API - usando token demo para demonstração
        // Em produção, substitua por uma chave de API real
        const response = await fetch(
          `https://api.waqi.info/feed/geo:${lat};${lng}/?token=demo`
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados de poluição para ${name}: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status !== 'ok') {
          throw new Error(`API retornou erro para ${name}: ${data.data || 'Dados não disponíveis'}`);
        }

        return {
          id: location.id,
          name: location.name,
          position: { lat, lng },
          aqi: data.data.aqi || 0,
          dominentpol: data.data.dominentpol || 'N/A',
          pm25: data.data.iaqi?.pm25?.v || 0,
          pm10: data.data.iaqi?.pm10?.v || 0,
          o3: data.data.iaqi?.o3?.v || 0,
          no2: data.data.iaqi?.no2?.v || 0,
          so2: data.data.iaqi?.so2?.v || 0,
          co: data.data.iaqi?.co?.v || 0,
          stationName: data.data.city?.name || name,
          lastUpdate: new Date().toISOString()
        };
      });

      const results = await Promise.all(pollutionPromises);
      setPollutionData(results);
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('Erro ao buscar dados de poluição:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [locations]);

  // Buscar dados iniciais
  useEffect(() => {
    if (locations.length > 0) {
      fetchPollutionData();
    }
  }, [fetchPollutionData]);

  // Atualizar dados em tempo real
  useEffect(() => {
    if (!isActive || !locations.length) return;

    const interval = setInterval(() => {
      fetchPollutionData();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isActive, fetchPollutionData, updateInterval]);

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: 'Bom', color: 'green' };
    if (aqi <= 100) return { level: 'Moderado', color: 'yellow' };
    if (aqi <= 150) return { level: 'Insalubre para grupos sensíveis', color: 'orange' };
    if (aqi <= 200) return { level: 'Insalubre', color: 'red' };
    if (aqi <= 300) return { level: 'Muito insalubre', color: 'purple' };
    return { level: 'Perigoso', color: 'maroon' };
  };

  return {
    pollutionData,
    isLoading,
    error,
    lastUpdate,
    refreshData: fetchPollutionData,
    getAQILevel
  };
};

