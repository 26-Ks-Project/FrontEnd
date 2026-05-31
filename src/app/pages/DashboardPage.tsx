import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Thermometer,
  Droplets,
  Sun,
  Sprout,
  Activity,
  Droplet,
  SprayCan,
  AlertCircle,
  LogOut,
  Video,
  Zap,
} from 'lucide-react';
import { SensorCard } from '../components/SensorCard';
import { ControlButton } from '../components/ControlButton';
import { PlantCamera } from '../components/PlantCamera';
import { SensorChart } from '../components/SensorChart';
import { PlantStatus, PlantAlert } from '../components/PlantStatus';
import { HistoryLookup } from '../components/HistoryLookup';
import { toast, Toaster } from 'sonner';
import { sensorService } from '../../service/sensorService';
import { authService } from '../../service/authService';
import { controlService } from '../../service/controlService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [temperature, setTemperature] = useState(24.5);
  const [humidity, setHumidity] = useState(65);
  const [soilMoisture, setSoilMoisture] = useState(72);
  const [lightIntensity, setLightIntensity] = useState(850);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const [chartData] = useState(() => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        id: i,
        time: `${String(i).padStart(2, '0')}:00`,
        temperature: +(22 + Math.random() * 4).toFixed(1),
        humidity: +(60 + Math.random() * 15).toFixed(1),
      });
    }
    return data;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sensorService.getLatestSensorData(1);
        
        setTemperature(Number(data.temperature));
        setHumidity(Number(data.humidity));
        setSoilMoisture(Number(data.soilMoisture));
        setLightIntensity(Number(data.illuminance));
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      }
    };

    if (authService.isLoggedIn()) {
      fetchData(); // Initial fetch
      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleWatering = async () => {
    try {
      toast.info('물주기 명령 전송 중...', { duration: 1500 });
      await controlService.controlWaterPump(1);
      setSoilMoisture(prev => Math.min(100, prev + 15));
      toast.success('물주기 완료', { description: '관수 시스템 제어 완료', duration: 2000 });
    } catch (error) {
      console.error('Failed to control water pump:', error);
      toast.error('물주기 제어에 실패했습니다.');
    }
  };

  const handleSupplement = async () => {
    try {
      toast.info('영양제 공급 명령 전송 중...', { duration: 1500 });
      await controlService.controlSupplement(1);
      toast.success('영양제 공급 완료', { description: '영양제 제어 완료', duration: 2000 });
    } catch (error) {
      console.error('Failed to control supplement:', error);
      toast.error('영양제 공급 제어에 실패했습니다.');
    }
  };

  const getSensorStatus = (value: number, min: number, max: number): 'good' | 'warning' | 'danger' => {
    if (value < min || value > max) return 'danger';
    if (value < min + (max - min) * 0.1 || value > max - (max - min) * 0.1) return 'warning';
    return 'good';
  };

  const plantAlerts: PlantAlert[] = useMemo(() => {
    const alerts: PlantAlert[] = [];
    if (soilMoisture < 40) {
      alerts.push({ message: '토양 수분이 매우 낮습니다. 식물이 시들 수 있으니 물을 주세요!', type: 'danger' });
    }
    if (temperature > 30) {
      alerts.push({ message: '온도가 너무 높습니다. 식물이 열 스트레스를 받고 있습니다.', type: 'danger' });
    }
    if (temperature < 15) {
      alerts.push({ message: '온도가 너무 낮습니다. 식물이 냉해를 입을 수 있습니다.', type: 'danger' });
    }
    if (humidity > 85) {
      alerts.push({ message: '습도가 높아 병해충 발생 위험이 있습니다. 환기가 필요합니다.', type: 'danger' });
    }
    if (lightIntensity < 300) {
      alerts.push({ message: '조도가 부족합니다. 보광이 필요합니다.', type: 'danger' });
    }
    if (alerts.length === 0) {
      alerts.push({ message: '식물이 건강하게 잘 자라고 있습니다. 걱정하지 마세요! 🌱', type: 'good' });
    }
    return alerts;
  }, [soilMoisture, temperature, humidity, lightIntensity]);

  const formatTime = (date: Date) =>
    date.toLocaleString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <Toaster position="top-right" richColors />

      {/* 헤더 섹션 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-xl">
                <Sprout size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">스마트팜 제어 시스템</h1>
                <p className="text-gray-600 mt-1">실시간 모니터링 및 자동 제어</p>  
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-green-600 font-semibold">
                    <Activity size={20} />
                    <span>시스템 정상 작동</span>
                  </div>
                  <button
                    onClick={() => navigate('/system-status')}
                    className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    상태 점검
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatTime(currentTime)}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                title="로그아웃"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 컬럼 (카메라, 제어, 기록) */}
        <div className="lg:col-span-1 space-y-6">
          <PlantCamera 
            streamUrl="http://192.168.137.10/hls/stream.m3u8" 
            timestamp={formatTime(currentTime)} 
            className="md:h-[412px]"
          />

          <div className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle size={24} className="text-green-600" />
              원격 제어
            </h2>
            <div className="space-y-3">
              <ControlButton title="물주기" icon={Droplet} color="blue" onActivate={handleWatering} />
              <ControlButton title="영양제 주기" icon={Sprout} color="green" onActivate={handleSupplement} />
            </div>
          </div>

          <HistoryLookup />
        </div>

        {/* 오른쪽 컬럼 (진단, 센서, 차트) */}
        <div className="lg:col-span-2 space-y-6">
          <PlantStatus alerts={plantAlerts} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SensorCard title="온도" value={temperature.toFixed(1)} unit="°C" icon={Thermometer} status={getSensorStatus(temperature, 20, 28)} min={20} max={28} />
            <SensorCard title="습도" value={humidity.toFixed(0)} unit="%" icon={Droplets} status={getSensorStatus(humidity, 50, 80)} min={50} max={80} />
            <SensorCard title="토양 수분" value={soilMoisture.toFixed(0)} unit="%" icon={Droplet} status={getSensorStatus(soilMoisture, 60, 85)} min={60} max={85} />
            <SensorCard title="조도" value={lightIntensity.toFixed(0)} unit="lux" icon={Sun} status={getSensorStatus(lightIntensity, 500, 1000)} min={500} max={1000} />
          </div>

          <SensorChart data={chartData} className="md:h-[464px]" />
        </div>
      </div>
    </div>
  );
}