import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import InteractiveMap from './components/InteractiveMap'
import DataStats from './components/DataStats'
import WeatherChart from './components/WeatherChart'
import { MapPin, Clock, Users, Play, Pause } from 'lucide-react'
import { useWeatherData } from './hooks/useWeatherData'
import { usePollutionData } from './hooks/usePollutionData'
import './App.css'

function App() {
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(3);
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: "São Paulo - Centro",
      lat: -23.5505,
      lng: -46.6333
    },
    {
      id: 2,
      name: "São Paulo - Paulista",
      lat: -23.5629,
      lng: -46.6544
    },
    {
      id: 3,
      name: "São Paulo - Vila Madalena",
      lat: -23.5475,
      lng: -46.6361
    }
  ]);

  // Hooks para dados de temperatura e poluição
  const { 
    weatherData, 
    isLoading: weatherLoading, 
    error: weatherError, 
    lastUpdate: weatherLastUpdate 
  } = useWeatherData(locations, isRealTimeActive, 60000); // Atualiza a cada 1 minuto

  const { 
    pollutionData, 
    isLoading: pollutionLoading, 
    error: pollutionError, 
    lastUpdate: pollutionLastUpdate 
  } = usePollutionData(locations, isRealTimeActive, 300000); // Atualiza a cada 5 minutos

  // Simular mudança no número de usuários conectados
  useEffect(() => {
    let interval;
    if (isRealTimeActive) {
      interval = setInterval(() => {
        setConnectedUsers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isRealTimeActive]);

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  const handleLocationAdd = (newLocation) => {
    setLocations(prev => [...prev, newLocation]);
  };

  const handleLocationRemove = (locationId) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
  };

  const lastUpdate = weatherLastUpdate || pollutionLastUpdate;
  const isLoading = weatherLoading || pollutionLoading;
  const hasError = weatherError || pollutionError;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Mapa de Temperatura e Poluição</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{connectedUsers} usuários online</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {isLoading ? 'Carregando...' : 
                   lastUpdate ? `Última atualização: ${lastUpdate.toLocaleTimeString()}` : 
                   'Aguardando dados...'}
                </span>
              </div>
              
              <Button 
                onClick={toggleRealTime}
                variant={isRealTimeActive ? "destructive" : "default"}
                className="flex items-center space-x-2"
              >
                {isRealTimeActive ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Parar Tempo Real</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Iniciar Tempo Real</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {hasError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">
              <p className="font-medium">Erro ao carregar dados:</p>
              {weatherError && <p className="text-sm">Temperatura: {weatherError}</p>}
              {pollutionError && <p className="text-sm">Poluição: {pollutionError}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Map */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Mapa Interativo</h2>
              <InteractiveMap
                weatherData={weatherData}
                pollutionData={pollutionData}
                onLocationAdd={handleLocationAdd}
                onLocationRemove={handleLocationRemove}
                isRealTimeActive={isRealTimeActive}
              />
            </div>
            
            {/* Charts Section */}
            <WeatherChart 
              weatherData={weatherData}
              pollutionData={pollutionData}
            />
          </div>

          {/* Right Column - Stats and Info */}
          <div>
            <DataStats 
              weatherData={weatherData}
              pollutionData={pollutionData}
              lastUpdate={lastUpdate}
              isRealTimeActive={isRealTimeActive}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
