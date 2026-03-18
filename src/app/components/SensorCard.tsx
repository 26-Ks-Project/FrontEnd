import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: LucideIcon;
  status: 'good' | 'warning' | 'danger';
  min?: number;
  max?: number;
}

export function SensorCard({ title, value, unit, icon: Icon, status, min, max }: SensorCardProps) {
  const statusColors = {
    good: 'bg-green-500/10 border-green-500/20 text-green-700',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700',
    danger: 'bg-red-500/10 border-red-500/20 text-red-700',
  };

  const iconColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${statusColors[status]} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-70 mb-1">{title}</p>
          <p className="text-3xl font-bold mb-1">
            {value}
            <span className="text-lg ml-1">{unit}</span>
          </p>
          {min !== undefined && max !== undefined && (
            <p className="text-xs opacity-60 mt-2">
              정상 범위: {min}{unit} - {max}{unit}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white/50 ${iconColors[status]}`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}
