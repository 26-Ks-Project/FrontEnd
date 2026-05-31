import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Thermometer, Droplets, Sun, Droplet, CheckCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { sensorService, SensorHistoryResponse } from '../../service/sensorService';

type MetricType = 'temperature' | 'humidity' | 'soilMoisture' | 'illuminance';

export default function HistoryPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sensorHistory, setSensorHistory] = useState<SensorHistoryResponse | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperature');

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      if (!date) return;
      setLoading(true);
      setError(null);
      try {
        const data = await sensorService.getSensorHistory(1, date);
        if (active) {
          setSensorHistory(data);
        }
      } catch (err: any) {
        console.error('Failed to fetch sensor history:', err);
        if (active) {
          setError('센서 기록 데이터를 불러오는 데 실패했습니다.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchHistory();
    return () => {
      active = false;
    };
  }, [date]);

  const historyData = useMemo(() => {
    if (!sensorHistory) {
      return null;
    }

    // Support both logs or data keys from backend response DTOs
    const logs: any[] = sensorHistory.logs || (sensorHistory as any).data || [];
    if (logs.length === 0) {
      return null;
    }

    // Add developer debug log to inspect response contents in browser devtools
    console.log('Parsed history logs:', logs);

    const intervalLabels = [
      '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
      '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
    ];

    const getHourFromCreatedAt = (createdAt: any): number => {
      if (createdAt === null || createdAt === undefined) return 0;
      
      // Case 1: Array representation [2026, 5, 31, 14, 59, 35]
      if (Array.isArray(createdAt)) {
        return typeof createdAt[3] === 'number' ? createdAt[3] : 0;
      }
      
      // Case 2: Object representation { year: 2026, hour: 14, ... }
      if (typeof createdAt === 'object') {
        if (typeof createdAt.hour === 'number') {
          return createdAt.hour;
        }
        if (typeof createdAt.hour === 'string') {
          return parseInt(createdAt.hour, 10) || 0;
        }
      }
      
      // Case 3: String representation
      if (typeof createdAt === 'string') {
        const match = createdAt.match(/(?:T|\s)(\d{2}):/);
        if (match) {
          return parseInt(match[1], 10);
        }

        try {
          const dateObj = new Date(createdAt);
          if (!isNaN(dateObj.getTime())) {
            return dateObj.getHours();
          }
        } catch (e) {
          // ignore
        }
      }
      
      // Case 4: Number representation
      if (typeof createdAt === 'number') {
        try {
          const dateObj = new Date(createdAt < 99999999999 ? createdAt * 1000 : createdAt);
          return dateObj.getHours();
        } catch (e) {
          // ignore
        }
      }
      
      return 0;
    };

    const chartData = intervalLabels.map((time, idx) => {
      const startHour = idx * 2;
      const endHour = startHour + 1;

      const bucketLogs = logs.filter(log => {
        const h = getHourFromCreatedAt(log.createdAt);
        return h === startHour || h === endHour;
      });

      // Safely check and convert values
      const validTemps = bucketLogs.map(log => log.temperature).filter(v => v !== null && v !== undefined).map(Number);
      const validHumids = bucketLogs.map(log => log.humidity).filter(v => v !== null && v !== undefined).map(Number);
      const validSoils = bucketLogs.map(log => log.soilMoisture).filter(v => v !== null && v !== undefined).map(Number);
      const validLights = bucketLogs.map(log => log.illuminance).filter(v => v !== null && v !== undefined).map(Number);

      if (validTemps.length === 0 && validHumids.length === 0 && validSoils.length === 0 && validLights.length === 0) {
        return {
          time,
          temperature: null,
          humidity: null,
          soilMoisture: null,
          illuminance: null,
        };
      }

      return {
        time,
        temperature: validTemps.length > 0 ? parseFloat((validTemps.reduce((sum, v) => sum + v, 0) / validTemps.length).toFixed(1)) : null,
        humidity: validHumids.length > 0 ? parseFloat((validHumids.reduce((sum, v) => sum + v, 0) / validHumids.length).toFixed(1)) : null,
        soilMoisture: validSoils.length > 0 ? parseFloat((validSoils.reduce((sum, v) => sum + v, 0) / validSoils.length).toFixed(1)) : null,
        illuminance: validLights.length > 0 ? parseFloat((validLights.reduce((sum, v) => sum + v, 0) / validLights.length).toFixed(0)) : null,
      };
    });

    const validTemps = logs.map(log => log.temperature).filter(v => v !== null && v !== undefined).map(Number);
    const validHumids = logs.map(log => log.humidity).filter(v => v !== null && v !== undefined).map(Number);
    const validSoils = logs.map(log => log.soilMoisture).filter(v => v !== null && v !== undefined).map(Number);
    const validLights = logs.map(log => log.illuminance).filter(v => v !== null && v !== undefined).map(Number);

    const avgTemp = validTemps.length > 0 ? validTemps.reduce((sum, v) => sum + v, 0) / validTemps.length : 0;
    const avgHumidity = validHumids.length > 0 ? validHumids.reduce((sum, v) => sum + v, 0) / validHumids.length : 0;
    const avgSoilMoisture = validSoils.length > 0 ? validSoils.reduce((sum, v) => sum + v, 0) / validSoils.length : 0;
    const avgLight = validLights.length > 0 ? validLights.reduce((sum, v) => sum + v, 0) / validLights.length : 0;

    const issues: string[] = [];
    if (avgTemp > 27) issues.push('평균 온도가 높았습니다. 환기가 부족했을 수 있습니다.');
    if (avgTemp < 18) issues.push('평균 온도가 낮았습니다. 보온이 필요했습니다.');
    if (avgHumidity > 80) issues.push('습도가 높아 병해충 발생 위험이 있었습니다.');
    if (avgSoilMoisture < 50) issues.push('토양 수분이 부족했습니다. 관수가 필요했습니다.');

    // Support both standard isAbnormal or abnormal fields generated by Jackson
    const hasAbnormalLog = logs.some(log => log.isAbnormal === true || log.abnormal === true);
    if (hasAbnormalLog) {
      issues.push('일부 센서 데이터에서 비정상적인 감지 수치가 확인되었습니다.');
    }

    return {
      chartData,
      avgTemp,
      avgHumidity,
      soilMoisture: avgSoilMoisture,
      light: avgLight,
      issues,
    };
  }, [sensorHistory]);

  const formatDate = (d: string | undefined) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일`;
  };

  const getChartTitle = () => {
    switch (selectedMetric) {
      case 'temperature':
        return '온도 추이';
      case 'humidity':
        return '습도 추이';
      case 'soilMoisture':
        return '토양 수분 추이';
      case 'illuminance':
        return '조도 추이';
      default:
        return '센서 데이터 추이';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl border-2 border-green-200 p-8 shadow-lg max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">기록 데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error || !historyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6 text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">데이터 오류</h2>
          <p className="text-gray-600 mb-6">
            {error || `${formatDate(date)}에 해당하는 센서 기록이 존재하지 않습니다.`}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
            >
              대시보드로 돌아가기
            </button>
            {error && (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
              >
                다시 시도
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const hasIssues = historyData.issues.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-green-700 hover:text-green-900 mb-6 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">대시보드로 돌아가기</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{formatDate(date)} 식물 상태 기록</h1>
        </div>

        {/* 상태 요약 */}
        <div className={`rounded-xl border-2 p-5 shadow-lg mb-6 ${hasIssues ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
          <div className="flex items-center gap-2 mb-3">
            {hasIssues ? <AlertTriangle size={22} className="text-red-600" /> : <CheckCircle size={22} className="text-green-600" />}
            <h3 className={`font-semibold ${hasIssues ? 'text-red-800' : 'text-green-800'}`}>
              {hasIssues ? '주의가 필요했던 날입니다' : '식물이 건강하게 잘 자란 날입니다'}
            </h3>
          </div>
          {hasIssues ? (
            <ul className="space-y-1">
              {historyData.issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-1">•</span>{issue}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-700">모든 센서 값이 정상 범위 내에 있었습니다. 걱정하지 마세요! 🌱</p>
          )}
        </div>

        {/* 센서 요약 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { key: 'temperature' as MetricType, label: '평균 온도', value: `${historyData.avgTemp.toFixed(1)}°C`, icon: Thermometer, color: 'text-red-500', activeClass: 'border-red-500 bg-red-50/30' },
            { key: 'humidity' as MetricType, label: '평균 습도', value: `${historyData.avgHumidity.toFixed(0)}%`, icon: Droplets, color: 'text-blue-500', activeClass: 'border-blue-500 bg-blue-50/30' },
            { key: 'soilMoisture' as MetricType, label: '토양 수분', value: `${historyData.soilMoisture.toFixed(0)}%`, icon: Droplet, color: 'text-cyan-500', activeClass: 'border-cyan-500 bg-cyan-50/30' },
            { key: 'illuminance' as MetricType, label: '조도', value: `${historyData.light.toFixed(0)} lux`, icon: Sun, color: 'text-yellow-500', activeClass: 'border-yellow-500 bg-yellow-50/30' },
          ].map((item) => {
            const isActive = selectedMetric === item.key;
            return (
              <div
                key={item.label}
                onClick={() => setSelectedMetric(item.key)}
                className={`rounded-xl p-4 shadow text-center cursor-pointer transition-all duration-200 border-2 ${
                  isActive
                    ? `${item.activeClass} shadow-md scale-102 font-semibold`
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <item.icon size={24} className={`${item.color} mx-auto mb-2`} />
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-lg font-bold text-gray-800">{item.value}</p>
              </div>
            );
          })}
        </div>

        {/* 차트 */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">{getChartTitle()}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" stroke="#666" style={{ fontSize: '12px' }} interval={1}/>
              <YAxis stroke="#666" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              {selectedMetric === 'temperature' && (
                <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={3} name="온도 (°C)" dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} connectNulls />
              )}
              {selectedMetric === 'humidity' && (
                <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={3} name="습도 (%)" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} connectNulls />
              )}
              {selectedMetric === 'soilMoisture' && (
                <Line type="monotone" dataKey="soilMoisture" stroke="#06b6d4" strokeWidth={3} name="토양 수분 (%)" dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} connectNulls />
              )}
              {selectedMetric === 'illuminance' && (
                <Line type="monotone" dataKey="illuminance" stroke="#eab308" strokeWidth={3} name="조도 (lux)" dot={{ r: 4, fill: '#eab308', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} connectNulls />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}