import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Thermometer, Droplets, Wind } from 'lucide-react';

const WeatherChart = ({ weatherData, pollutionData }) => {
  // Preparar dados para o gráfico de temperatura
  const tempChartData = weatherData.map((location, index) => ({
    name: location.name.split(' - ')[1] || location.name,
    temperatura: location.temperature,
    umidade: location.humidity,
    vento: location.windSpeed,
    aqi: pollutionData[index]?.aqi || 0
  }));

  // Preparar dados para o gráfico de poluição
  const pollutionChartData = pollutionData.map(location => ({
    name: location.name.split(' - ')[1] || location.name,
    AQI: location.aqi,
    PM25: location.pm25,
    PM10: location.pm10,
    O3: location.o3
  }));

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#10B981';
    if (aqi <= 100) return '#F59E0B';
    if (aqi <= 150) return '#F97316';
    if (aqi <= 200) return '#EF4444';
    if (aqi <= 300) return '#8B5CF6';
    return '#7F1D1D';
  };

  const getTempColor = (temp) => {
    if (temp < 10) return '#3B82F6';
    if (temp < 20) return '#06B6D4';
    if (temp < 30) return '#10B981';
    if (temp < 35) return '#F59E0B';
    return '#EF4444';
  };

  if (!weatherData.length && !pollutionData.length) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="text-center text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aguardando dados para exibir gráficos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Temperature and Weather Chart */}
      {weatherData.length > 0 && (
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-blue-600" />
              Dados Meteorológicos
            </h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperatura" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  name="Temperatura (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="umidade" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 3 }}
                  name="Umidade (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="vento" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  name="Vento (km/h)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <Thermometer className="h-5 w-5 mx-auto mb-1 text-red-600" />
              <div className="text-sm font-medium text-red-800">Temperatura</div>
              <div className="text-xs text-red-600">Linha vermelha</div>
            </div>
            <div className="text-center p-3 bg-cyan-50 rounded-lg">
              <Droplets className="h-5 w-5 mx-auto mb-1 text-cyan-600" />
              <div className="text-sm font-medium text-cyan-800">Umidade</div>
              <div className="text-xs text-cyan-600">Linha azul</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Wind className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <div className="text-sm font-medium text-green-800">Vento</div>
              <div className="text-xs text-green-600">Linha verde</div>
            </div>
          </div>
        </div>
      )}

      {/* Air Quality Chart */}
      {pollutionData.length > 0 && (
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
              Qualidade do Ar
            </h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pollutionChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="AQI" 
                  fill="#F97316"
                  name="Índice de Qualidade do Ar"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="PM25" 
                  fill="#EF4444"
                  name="PM2.5"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="PM10" 
                  fill="#8B5CF6"
                  name="PM10"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="w-4 h-4 bg-orange-500 rounded mx-auto mb-1"></div>
              <div className="text-sm font-medium text-orange-800">AQI</div>
              <div className="text-xs text-orange-600">Índice geral</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
              <div className="text-sm font-medium text-red-800">PM2.5</div>
              <div className="text-xs text-red-600">Partículas finas</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="w-4 h-4 bg-purple-500 rounded mx-auto mb-1"></div>
              <div className="text-sm font-medium text-purple-800">PM10</div>
              <div className="text-xs text-purple-600">Partículas grossas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherChart;

