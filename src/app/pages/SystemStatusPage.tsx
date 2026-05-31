import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Activity, Thermometer, Droplets, Droplet, Sun, Zap, Sprout, Video, ShieldCheck, Play, RefreshCw, AlertTriangle, Terminal } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface StatusItemProps {
  label: string;
  status: 'active' | 'inactive' | 'error';
  icon: React.ComponentType<any>;
  description: string;
}

function StatusItem({ label, status, icon: IconComponent, description }: StatusItemProps) {
  const statusStyles = {
    active: {
      dot: 'bg-green-500',
      bg: 'bg-green-50 text-green-700 border-green-200',
      text: '정상 작동',
    },
    inactive: {
      dot: 'bg-amber-500',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      text: '대기 중',
    },
    error: {
      dot: 'bg-red-500 animate-ping',
      bg: 'bg-red-50 text-red-700 border-red-200',
      text: '점검 필요',
    },
  };

  const currentStyle = statusStyles[status] || statusStyles.inactive;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-150 bg-white hover:shadow-md hover:border-green-300 transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-green-50 text-green-600 border border-green-100">
          <IconComponent size={20} />
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-800 block">{label}</span>
          <span className="text-xs text-gray-400 block mt-0.5">{description}</span>
        </div>
      </div>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${currentStyle.bg}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${currentStyle.dot}`} />
        <span>{currentStyle.text}</span>
      </div>
    </div>
  );
}

export default function SystemStatusPage() {
  const navigate = useNavigate();
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[12:00:01] [INFO] IoT Gateway 연결 활성화 완료 (Base URL: http://localhost:8080/api/v1)',
    '[12:00:02] [INFO] 장치 진단 대기 중. 자가 진단을 실행해 주세요.',
  ]);

  const [systemStatus, setSystemStatus] = useState({
    sensors: {
      temperature: 'active' as const,
      humidity: 'active' as const,
      soilMoisture: 'active' as const,
      illuminance: 'active' as const,
    },
    actuators: {
      waterPump: 'active' as const,
      supplementPump: 'active' as const,
      camera: 'active' as const,
    }
  });

  const runSelfDiagnosis = async () => {
    if (isDiagnosing) return;

    setIsDiagnosing(true);
    setLogs([
      `[${new Date().toLocaleTimeString()}] [INFO] 스마트팜 자가 진단 시퀀스 시작...`,
      `[${new Date().toLocaleTimeString()}] [INFO] 로컬 게이트웨이 및 API 상태 점검 중...`
    ]);

    const steps = [
      { text: '[INFO] 온/습도 센서 상태 확인 중...', delay: 600 },
      { text: '[SUCCESS] DHT22 온도 센서 연결 성공 (정상 상태)', delay: 1000 },
      { text: '[SUCCESS] DHT22 습도 센서 연결 성공 (정상 상태)', delay: 1400 },
      { text: '[INFO] 토양 수분 센서 피드백 체크 중...', delay: 2000 },
      { text: '[SUCCESS] Capacitive 토양 수분 센서 값 수신 성공 (정상)', delay: 2500 },
      { text: '[INFO] BH1750 조도 센서 통신 채널 확인 중...', delay: 3000 },
      { text: '[SUCCESS] BH1750 조도 센서 데이터 수신 완료 (정상)', delay: 3400 },
      { text: '[INFO] 릴레이 및 밸브 디바이스 응답 상태 스캔...', delay: 4000 },
      { text: '[SUCCESS] 워터 펌프 릴레이 통신 연결 성공', delay: 4400 },
      { text: '[SUCCESS] 영양제 공급 솔레노이드 밸브 통신 연결 성공', delay: 4800 },
      { text: '[INFO] HLS 미디어 스트리밍 서버 상태 점검...', delay: 5400 },
      { text: '[SUCCESS] CCTV 카메라 스트리밍 채널 상태 안정 (정상)', delay: 5800 },
      { text: '[SUCCESS] 자가 진단 완료: 모든 센서 및 제어 장치가 정상 작동 중입니다. 🎉', delay: 6400 }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.text}`]);
        if (step.text.includes('자가 진단 완료')) {
          setIsDiagnosing(false);
          toast.success('자가 진단 완료', { description: '모든 시스템이 최적의 상태입니다.' });
        }
      }, step.delay);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-150 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors cursor-pointer text-green-700"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-green-800">시스템 상태 점검 및 진단</h1>
          </div>
          <button
            onClick={runSelfDiagnosis}
            disabled={isDiagnosing}
            className={`flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer ${
              isDiagnosing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
            }`}
          >
            {isDiagnosing ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Play size={16} />
            )}
            자가 진단 실행
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 왼쪽 컬럼 - 상태 요약 및 상세 리스트 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 상태 요약 개요 */}
            <div className="bg-white rounded-2xl border border-green-200 p-6 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
                  <ShieldCheck size={36} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">종합 진단 상태: 정상</h2>
                  <p className="text-sm text-gray-500 mt-0.5">총 7개 모듈 중 7개 활성화됨 (연결 가용성 100%)</p>
                </div>
              </div>
              <span className="px-4 py-1.5 bg-green-100 border border-green-200 rounded-full text-sm font-bold text-green-800">
                Healthy
              </span>
            </div>

            {/* 세부 장치 리스트 */}
            <div className="space-y-6">
              {/* 센서 모듈 */}
              <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-md">
                <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Activity size={18} className="text-green-600" />
                  센서 모듈 작동 상태
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatusItem label="온도 센서" status={systemStatus.sensors.temperature} icon={Thermometer} description="대기 온도 모니터링 (DHT22)" />
                  <StatusItem label="습도 센서" status={systemStatus.sensors.humidity} icon={Droplets} description="대기 습도 모니터링 (DHT22)" />
                  <StatusItem label="토양 수분 센서" status={systemStatus.sensors.soilMoisture} icon={Droplet} description="화분 토양 수분 모니터링" />
                  <StatusItem label="조도 센서" status={systemStatus.sensors.illuminance} icon={Sun} description="광량 조도 모니터링 (BH1750)" />
                </div>
              </div>

              {/* 제어 및 디바이스 */}
              <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-md">
                <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Zap size={18} className="text-green-600" />
                  제어 및 미디어 디바이스 상태
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatusItem label="워터 펌프" status={systemStatus.actuators.waterPump} icon={Zap} description="자동 관수 모터 펌프 릴레이" />
                  <StatusItem label="영양제 펌프" status={systemStatus.actuators.supplementPump} icon={Sprout} description="영양 공급 솔레노이드 밸브" />
                  <StatusItem label="CCTV 카메라" status={systemStatus.actuators.camera} icon={Video} description="HLS 라이브 비디오 채널 스트림" />
                </div>
              </div>
            </div>

          </div>

          {/* 오른쪽 컬럼 - 진단 로그 터미널 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-5 text-white flex flex-col h-[580px] sticky top-24">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Terminal size={18} />
                  <span className="text-sm font-semibold">디바이스 진단 로그 콘솔</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
              </div>

              {/* 터미널 로그 텍스트 영역 */}
              <div className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed space-y-2.5 pr-2 custom-scrollbar">
                {logs.map((log, idx) => {
                  let logColor = 'text-gray-300';
                  if (log.includes('[SUCCESS]')) logColor = 'text-green-400';
                  if (log.includes('[ERROR]')) logColor = 'text-red-400';
                  if (log.includes('[INFO]')) logColor = 'text-blue-400';

                  return (
                    <div key={idx} className={`${logColor}`}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
