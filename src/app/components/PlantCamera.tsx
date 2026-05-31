import React, { useEffect, useRef, useState } from 'react';
import { Camera, Wifi, WifiOff, VideoOff } from 'lucide-react';
import Hls from 'hls.js';

interface PlantCameraProps {
  streamUrl: string;
  className?: string;
}

export function PlantCamera({ streamUrl, className }: PlantCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 상태 관리: 스트리밍 활성화 여부 및 인터넷 연결 여부
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 1. 실시간 시계 및 인터넷 상태 모니터링
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. HLS 스트리밍 로직
  useEffect(() => {
    let hls: Hls;

    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 0,
          liveSyncDurationCount: 1,
          liveMaxLatencyDurationCount: 3,
          manifestLoadingMaxRetry: 3, // 너무 오래 시도하지 않고 에러 처리로 넘김
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        // 영상 신호 감지 성공 시
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsStreaming(true);
          video.play().catch(() => {
            video.muted = true;
            video.play();
          });
        });

        // 에러 발생 시 스트리밍 상태 해제
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setIsStreaming(false);
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          }
        });

        // 조각(Fragment) 로딩 실패 시 (파일이 삭제되었을 때 등)
        hls.on(Hls.Events.FRAG_LOAD_ERROR, () => {
          setIsStreaming(false);
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.onloadedmetadata = () => setIsStreaming(true);
        video.onerror = () => setIsStreaming(false);
      }
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [streamUrl]);

  const formatTime = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
  };

  /**
   * 상태에 따른 대각선(Slash) 오버레이 컴포넌트
   */
  const StatusIcon = ({ children, active, color }: { children: React.ReactNode, active: boolean, color: string }) => (
    <div className="relative flex items-center justify-center">
      {children}
      {!active && (
        <div 
          className="absolute w-[120%] h-[2px] bg-red-500 rotate-45 shadow-sm" 
          style={{ transform: 'rotate(-45deg)', borderRadius: '1px' }} 
        />
      )}
    </div>
  );

  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 border-green-300 shadow-2xl bg-black group h-[450px] ${className || ''}`}>
      {/* 📹 비디오 영역: 스트리밍이 안 될 때 시각적 피드백 */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isStreaming && isOnline ? 'opacity-90' : 'opacity-30 grayscale'
        }`}
        autoPlay
        muted
        playsInline
      />

      {/* 스트리밍 중단 시 중앙 안내 문구 (선택 사항) */}
      {!isStreaming && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 space-y-2">
          <VideoOff size={48} strokeWidth={1} />
          <p className="text-sm font-light tracking-widest">NO SIGNAL</p>
        </div>
      )}

      {/* 좌상단: LIVE 상태 배지 (신호 없을 시 작대기) */}
      <div className="absolute top-5 left-5">
        <div className={`bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border ${isStreaming ? 'border-white/20' : 'border-red-500/50'}`}>
          <StatusIcon active={isStreaming} color="red">
            <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-red-500 animate-ping' : 'bg-gray-500'}`} />
          </StatusIcon>
          <span className={`text-[11px] font-bold tracking-tighter ${isStreaming ? 'text-white' : 'text-gray-400'}`}>
            {isStreaming ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* 우상단: 와이파이 상태 (연결 끊길 시 작대기) */}
      <div className="absolute top-5 right-5">
        <div className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-colors ${isOnline ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
          <StatusIcon active={isOnline} color="white">
            <Wifi size={18} className={`text-white ${isOnline ? 'animate-pulse' : 'opacity-50'}`} />
          </StatusIcon>
        </div>
      </div>

      {/* 하단: 타임스탬프 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className={`text-[10px] font-black tracking-[0.2em] uppercase transition-colors ${isStreaming ? 'text-green-400' : 'text-red-400'}`}>
              {isStreaming ? 'Cam / Connected' : 'Cam / Signal Lost'}
            </span>
            <p className="text-xl font-mono text-white/90 tabular-nums">
              {formatTime(currentTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}