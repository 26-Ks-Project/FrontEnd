import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Thermometer, Droplets, Sun, Droplet, CheckCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function HistoryPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  // 선택한 날짜 기반 시뮬레이션 데이터
  const historyData = useMemo(() => {
    const seed = date ? date.split('-').reduce((a, b) => a + parseInt(b), 0) : 42;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed * 100 + i) * 10000;
      return x - Math.floor(x);
    };

    const chartData = Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      temperature: +(20 + seededRandom(i) * 8).toFixed(1),
      humidity: +(55 + seededRandom(i + 100) * 25).toFixed(1),
    }));

    const avgTemp = chartData.reduce((s, d) => s + d.temperature, 0) / 24;
    const avgHumidity = chartData.reduce((s, d) => s + d.humidity, 0) / 24;
    const soilMoisture = +(50 + seededRandom(200) * 40).toFixed(0);
    const light = +(400 + seededRandom(300) * 600).toFixed(0);

    const issues: string[] = [];
    if (avgTemp > 27) issues.push('평균 온도가 높았습니다. 환기가 부족했을 수 있습니다.');
    if (avgTemp < 18) issues.push('평균 온도가 낮았습니다. 보온이 필요했습니다.');
    if (avgHumidity > 80) issues.push('습도가 높아 병해충 발생 위험이 있었습니다.');
    if (soilMoisture < 50) issues.push('토양 수분이 부족했습니다. 관수가 필요했습니다.');

    return { chartData, avgTemp, avgHumidity, soilMoisture, light, issues };
  }, [date]);

  const formatDate = (d: string | undefined) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일`;
  };

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
            { label: '평균 온도', value: `${historyData.avgTemp.toFixed(1)}°C`, icon: Thermometer, color: 'text-red-500' },
            { label: '평균 습도', value: `${historyData.avgHumidity.toFixed(0)}%`, icon: Droplets, color: 'text-blue-500' },
            { label: '토양 수분', value: `${historyData.soilMoisture}%`, icon: Droplet, color: 'text-cyan-500' },
            { label: '조도', value: `${historyData.light} lux`, icon: Sun, color: 'text-yellow-500' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow text-center">
              <item.icon size={24} className={`${item.color} mx-auto mb-2`} />
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-lg font-bold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>

        {/* 차트 */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">온·습도 추이</h3>
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
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="온도 (°C)" dot={false} />
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} name="습도 (%)" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}