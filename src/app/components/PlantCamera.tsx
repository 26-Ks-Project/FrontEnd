import { Camera, Wifi } from 'lucide-react';

interface PlantCameraProps {
  imageUrl: string;
  timestamp: string;
}

export function PlantCamera({ imageUrl, timestamp }: PlantCameraProps) {
  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-green-200 shadow-lg">
      <img 
        src={imageUrl} 
        alt="식물 상태" 
        className="w-full h-[400px] object-cover"
      />
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Camera size={18} />
        <span className="text-sm font-medium">실시간 모니터링</span>
      </div>
      <div className="absolute top-4 right-4 bg-green-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center gap-2">
        <Wifi size={16} className="animate-pulse" />
        <span className="text-xs font-medium">온라인</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white px-4 py-4">
        <p className="text-sm">마지막 업데이트: {timestamp}</p>
      </div>
    </div>
  );
}
