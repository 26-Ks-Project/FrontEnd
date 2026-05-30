import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SensorAvgResponse } from '../../service/sensorService';
import { Thermometer, Droplets, Droplet, Sun } from 'lucide-react';
import { cn } from './ui/utils';

interface SensorChartProps {
  data: SensorAvgResponse[];
}

type MetricType = 'temperature' | 'humidity' | 'soilMoisture' | 'illuminance';

interface MetricConfig {
  key: keyof SensorAvgResponse;
  label: string;
  color: string;
  unit: string;
  icon: any;
}

const METRIC_CONFIGS: Record<MetricType, MetricConfig> = {
  temperature: {
    key: 'avgTemperature',
    label: '온도',
    color: '#ef4444',
    unit: '°C',
    icon: Thermometer,
  },
  humidity: {
    key: 'avgHumidity',
    label: '습도',
    color: '#3b82f6',
    unit: '%',
    icon: Droplets,
  },
  soilMoisture: {
    key: 'avgSoilMoisture',
    label: '토양 수분',
    color: '#06b6d4',
    unit: '%',
    icon: Droplet,
  },
  illuminance: {
    key: 'avgIlluminance',
    label: '조도',
    color: '#f59e0b',
    unit: 'lux',
    icon: Sun,
  },
};

export function SensorChart({ data }: SensorChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperature');
  const config = METRIC_CONFIGS[selectedMetric];

  return (
    <div className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-lg min-h-[400px] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800">오늘의 {config.label} 추이</h3>
        
        <div className="flex flex-wrap gap-2">
          {(Object.entries(METRIC_CONFIGS) as [MetricType, MetricConfig][]).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                selectedMetric === key
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="timeRange" 
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                unit={config.unit}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}${config.unit}`, config.label]}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#1e293b' }}
              />
              <Line 
                type="monotone" 
                dataKey={config.key} 
                stroke={config.color} 
                strokeWidth={3}
                dot={{ r: 4, fill: config.color, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 py-20 text-center">
            <p className="text-sm font-medium">표시할 데이터가 없습니다.</p>
            <p className="text-sm font-medium">잠시 후 다시 시도하거나 센서 상태를 확인해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}