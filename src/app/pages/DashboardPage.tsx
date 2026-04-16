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
    const fetchData = async () => {
      try {
        const data = await sensorService.getLatestSensorData(1);
        
        setTemperature(Number(data.temperature));
        setHumidity(Number(data.humidity));
        setSoilMoisture(Number(data.soilMoisture));
        setLightIntensity(Number(data.illuminance));
        setCurrentTime(new Date(data.createdAt));
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      }
    };

    if (authService.isLoggedIn()) {
      fetchData(); // Initial fetch
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleWatering = () => {
    toast.success('물주기 시작', { description: '자동 관수 시스템이 작동중입니다.', duration: 2000 });
    setTimeout(() => {
      setSoilMoisture(prev => Math.min(100, prev + 15));
      toast.success('물주기 완료', { description: '토양 수분이 증가했습니다.', duration: 2000 });
    }, 2000);
  };

  const handlePesticide = () => {
    toast.success('농약 살포 시작', { description: '자동 분무 시스템이 작동중입니다.', duration: 2000 });
    setTimeout(() => {
      toast.success('농약 살포 완료', { description: '병해충 방제가 완료되었습니다.', duration: 2000 });
    }, 2000);
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
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <Activity size={20} />
                  <span>시스템 정상 작동</span>
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
            imageUrl="https://images.unsplash.com/photo-1720487222334-f91d9d74c852?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwdmVnZXRhYmxlJTIwZ3Jvd2luZ3xlbnwxfHx8fDE3NzMyOTE5NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            timestamp={formatTime(currentTime)}
          />

          <div className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle size={24} className="text-green-600" />
              원격 제어
            </h2>
            <div className="space-y-3">
              <ControlButton title="물주기" icon={Droplet} color="blue" onActivate={handleWatering} />
              <ControlButton title="농약 뿌리기" icon={SprayCan} color="purple" onActivate={handlePesticide} />
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

          <SensorChart data={chartData} />

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
            <h3 className="text-lg font-bold mb-3">시스템 상태</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span>자동 관수: 활성화</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span>온도 제어: 활성화</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span>조명 제어: 자동</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span>환기 시스템: 정상</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}