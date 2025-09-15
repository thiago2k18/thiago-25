import React, { useState, useEffect } from 'react';
import { MapPin, Thermometer, Wind, Eye, Navigation, Plus, X } from 'lucide-react';

const InteractiveMap = ({ 
  weatherData = [], 
  pollutionData = [], 
  onLocationAdd, 
  onLocationRemove,
  isRealTimeActive 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '' });

  // Combinar dados de temperatura e poluição por localização
  const getCombinedData = (locationId) => {
    const weather = weatherData.find(w => w.id === locationId);
    const pollution = pollutionData.find(p => p.id === locationId);
    return { weather, pollution };
  };

  // Converter coordenadas para posições no mapa
  const getMapPosition = (lat, lng) => {
    // Converter coordenadas geográficas para posições relativas no mapa
    // Usando São Paulo como centro de referência (-23.5505, -46.6333)
    const centerLat = -23.5505;
    const centerLng = -46.6333;
    
    const x = 50 + (lng - centerLng) * 100; // Escala ajustada
    const y = 50 - (lat - centerLat) * 100; // Invertido para coordenadas de tela
    
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
  };

  // Obter cor do marcador baseado na temperatura e AQI
  const getMarkerColor = (weather, pollution) => {
    if (pollution && pollution.aqi > 0) {
      // Priorizar cor baseada na qualidade do ar
      if (pollution.aqi <= 50) return '#10B981'; // Verde
      if (pollution.aqi <= 100) return '#F59E0B'; // Amarelo
      if (pollution.aqi <= 150) return '#F97316'; // Laranja
      if (pollution.aqi <= 200) return '#EF4444'; // Vermelho
      if (pollution.aqi <= 300) return '#8B5CF6'; // Roxo
      return '#7F1D1D'; // Marrom escuro
    }
    
    if (weather && weather.temperature !== undefined) {
      // Cor baseada na temperatura
      if (weather.temperature < 10) return '#3B82F6'; // Azul (frio)
      if (weather.temperature < 20) return '#06B6D4'; // Ciano (fresco)
      if (weather.temperature < 30) return '#10B981'; // Verde (agradável)
      if (weather.temperature < 35) return '#F59E0B'; // Amarelo (quente)
      return '#EF4444'; // Vermelho (muito quente)
    }
    
    return '#6B7280'; // Cinza padrão
  };

  const handleMapClick = (event) => {
    if (!isRealTimeActive) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    // Converter posição relativa para coordenadas geográficas
    const centerLat = -23.5505;
    const centerLng = -46.6333;
    const lat = centerLat - (y - 50) / 100;
    const lng = centerLng + (x - 50) / 100;
    
    setNewLocation({
      name: `Local ${weatherData.length + 1}`,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6)
    });
    setShowAddForm(true);
  };

  const handleAddLocation = () => {
    if (newLocation.name && newLocation.lat && newLocation.lng) {
      const location = {
        id: Date.now(),
        name: newLocation.name,
        lat: parseFloat(newLocation.lat),
        lng: parseFloat(newLocation.lng)
      };
      
      onLocationAdd(location);
      setNewLocation({ name: '', lat: '', lng: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Map Title */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Mapa de Temperatura e Poluição</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm max-w-xs">
        <div className="text-xs text-gray-700">
          <p className="font-medium mb-1">Como usar:</p>
          <p>• Clique nos marcadores para ver detalhes</p>
          {isRealTimeActive && <p>• Clique no mapa para adicionar locais</p>}
        </div>
      </div>

      {/* Interactive Map Area */}
      <div 
        className="absolute inset-0 cursor-crosshair"
        onClick={handleMapClick}
        title={isRealTimeActive ? "Clique para adicionar um local" : "Ative o modo tempo real para interagir"}
      >
        {/* Location Markers */}
        {weatherData.map((location) => {
          const position = getMapPosition(location.position.lat, location.position.lng);
          const { weather, pollution } = getCombinedData(location.id);
          const markerColor = getMarkerColor(weather, pollution);
          
          return (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLocation(location);
              }}
            >
              {/* Location Marker */}
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-125 flex items-center justify-center"
                style={{ backgroundColor: markerColor }}
              >
                <Thermometer className="h-4 w-4 text-white" />
              </div>

              {/* Location Label */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {location.name}
                {weather && <div className="text-blue-600">{weather.temperature}°{weather.unit}</div>}
                {pollution && <div className="text-orange-600">AQI: {pollution.aqi}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <div className="text-xs font-medium text-gray-700 mb-2">Legenda</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Boa qualidade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600">Moderada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-600">Insalubre</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">Perigosa</span>
          </div>
        </div>
      </div>

      {/* Real-time Indicator */}
      {isRealTimeActive && (
        <div className="absolute bottom-4 right-4 bg-green-500 text-white rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <span className="text-xs font-medium">Tempo Real Ativo</span>
          </div>
        </div>
      )}

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center" onClick={() => setSelectedLocation(null)}>
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-800">{selectedLocation.name}</h3>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Weather Data */}
            {selectedLocation && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Thermometer className="h-4 w-4 mr-2" />
                    Dados Meteorológicos
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Temperatura: {selectedLocation.temperature}°{selectedLocation.unit}</div>
                    <div>Umidade: {selectedLocation.humidity}%</div>
                    <div>Vento: {selectedLocation.windSpeed} km/h</div>
                    <div>Código: {selectedLocation.weatherCode}</div>
                  </div>
                </div>

                {/* Pollution Data */}
                {(() => {
                  const pollution = pollutionData.find(p => p.id === selectedLocation.id);
                  if (pollution) {
                    return (
                      <div className="bg-orange-50 rounded-lg p-3">
                        <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Qualidade do Ar
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>AQI: {pollution.aqi}</div>
                          <div>PM2.5: {pollution.pm25}</div>
                          <div>PM10: {pollution.pm10}</div>
                          <div>O3: {pollution.o3}</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="text-xs text-gray-500">
                  Coordenadas: {selectedLocation.position.lat.toFixed(4)}, {selectedLocation.position.lng.toFixed(4)}
                </div>
                
                {isRealTimeActive && (
                  <button
                    onClick={() => {
                      onLocationRemove(selectedLocation.id);
                      setSelectedLocation(null);
                    }}
                    className="w-full px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Remover Local
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Location Form */}
      {showAddForm && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Adicionar Local</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do local"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newLocation.lat}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, lat: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="-23.5505"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newLocation.lng}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, lng: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="-46.6333"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLocation}
                className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;

