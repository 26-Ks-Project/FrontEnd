import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface ControlButtonProps {
  title: string;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'green';
  onActivate: () => void;
}

export function ControlButton({ title, icon: Icon, color, onActivate }: ControlButtonProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    onActivate();
    setTimeout(() => setIsActive(false), 2000);
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-600 hover:bg-blue-700',
      active: 'bg-blue-700 scale-95',
    },
    purple: {
      bg: 'bg-purple-600 hover:bg-purple-700',
      active: 'bg-purple-700 scale-95',
    },
    green: {
      bg: 'bg-green-600 hover:bg-green-700',
      active: 'bg-green-700 scale-95',
    },
  };

  return (
    <button
      onClick={handleClick}
      disabled={isActive}
      className={`
        w-full p-6 rounded-xl text-white font-semibold
        flex items-center justify-center gap-3
        transition-all duration-300
        ${isActive ? colorClasses[color].active : colorClasses[color].bg}
        ${isActive ? 'cursor-not-allowed' : 'hover:shadow-xl'}
      `}
    >
      <Icon size={24} className={isActive ? 'animate-pulse' : ''} />
      <span className="text-lg">{isActive ? '실행 중...' : title}</span>
    </button>
  );
}
