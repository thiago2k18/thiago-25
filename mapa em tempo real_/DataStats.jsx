import React from 'react';
import { Thermometer, Eye, MapPin, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const DataStats = ({ weatherData, pollutionData, lastUpdate, isRealTimeActive }) => {
  // Calcular estatísticas de temperatura
  const tempStats = weatherData.length > 0 ? {
    avg: Math.round(weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length),
    min: Math.min(...weatherData.map(w => w.temperature)),
    max: Math.max(...weatherData.map(w => w.temperature)),
    unit: weatherData[0]?.unit || '°C'
  } : { avg: 0, min: 0, max: 0, unit: '°C' };

  // Calcular estatísticas de poluição
  const pollutionStats = pollutionData.length > 0 ? {
    avgAQI: Math.round(pollutionData.reduce((sum, p) => sum + p.aqi, 0) / pollutionData.length),
    minAQI: Math.min(...pollutionData.map(p => p.aqi)),
    maxAQI: Math.max(...pollutionData.map(p => p.aqi)),
    goodQuality: pollutionData.filter(p => p.aqi <= 50).length,
    poorQuality: pollutionData.filter(p => p.aqi > 150).length
  } : { avgAQI: 0, minAQI: 0, maxAQI: 0, goodQuality: 0, poorQuality: 0 };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600 bg-green-50';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-50';
    if (aqi <= 150) return 'text-orange-600 bg-orange-50';
    if (aqi <= 200) return 'text-red-600 bg-red-50';
    if (aqi <= 300) return 'text-purple-600 bg-purple-50';
    return 'text-red-800 bg-red-100';
  };

  const getTempColor = (temp) => {
    if (temp < 10) return 'text-blue-600 bg-blue-50';
    if (temp < 20) return 'text-cyan-600 bg-cyan-50';
    if (temp < 30) return 'text-green-600 bg-green-50';
    if (temp < 35) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Status do Sistema</h2>
          <div className={`w-3 h-3 rounded-full ${isRealTimeActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        </div>
        <p className="text-muted-foreground text-sm">
          {isRealTimeActive 
            ? "Sistema ativo - Recebendo atualizações em tempo real" 
            : "Sistema pausado - Clique em 'Iniciar Tempo Real' para ativar"
          }
        </p>
        {lastUpdate && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <Clock className="h-3 w-3" />
            <span>Última atualização: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Temperature Stats */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-blue-600" />
            Estatísticas de Temperatura
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`text-center p-3 rounded-lg ${getTempColor(tempStats.avg)}`}>
            <div className="text-2xl font-bold">{tempStats.avg}{tempStats.unit}</div>
            <div className="text-sm">Média</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">{weatherData.length}</div>
            <div className="text-sm text-muted-foreground">Locais</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Mínima</span>
            </div>
            <span className="font-semibold">{tempStats.min}{tempStats.unit}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <span className="text-sm">Máxima</span>
            </div>
            <span className="font-semibold">{tempStats.max}{tempStats.unit}</span>
          </div>
        </div>
      </div>

      {/* Pollution Stats */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center">
            <Eye className="h-5 w-5 mr-2 text-orange-600" />
            Qualidade do Ar
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`text-center p-3 rounded-lg ${getAQIColor(pollutionStats.avgAQI)}`}>
            <div className="text-2xl font-bold">{pollutionStats.avgAQI}</div>
            <div className="text-sm">AQI Médio</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">{pollutionData.length}</div>
            <div className="text-sm text-muted-foreground">Estações</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Boa qualidade</span>
            </div>
            <span className="font-semibold text-green-700">{pollutionStats.goodQuality}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-red-50 rounded">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Qualidade ruim</span>
            </div>
            <span className="font-semibold text-red-700">{pollutionStats.poorQuality}</span>
          </div>

          {pollutionStats.minAQI > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-semibold">{pollutionStats.minAQI}</div>
                <div className="text-xs text-muted-foreground">AQI Mín</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-semibold">{pollutionStats.maxAQI}</div>
                <div className="text-xs text-muted-foreground">AQI Máx</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Como usar</h2>
        <div className="space-y-2 text-muted-foreground text-sm">
          <p>• Clique nos marcadores no mapa para ver informações detalhadas</p>
          <p>• Use o botão "Iniciar Tempo Real" para ativar atualizações automáticas</p>
          <p>• Clique no mapa para adicionar novos locais (modo tempo real)</p>
          <p>• Cores dos marcadores indicam qualidade do ar e temperatura</p>
          <p>• Dados de temperatura via Open-Meteo (sem API key necessária)</p>
          <p>• Dados de poluição via AQICN (token demo - limitado)</p>
        </div>
      </div>
    </div>
  );
};

export default DataStats;

