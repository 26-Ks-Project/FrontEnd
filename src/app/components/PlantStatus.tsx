import { Leaf, Bug, AlertTriangle, CheckCircle, Swords } from 'lucide-react';
import { useNavigate } from 'react-router';

export interface PlantAlert {
  message: string;
  type: 'good' | 'danger';
}

interface PlantStatusProps {
  alerts: PlantAlert[];
}

export function PlantStatus({ alerts }: PlantStatusProps) {
  const hasIssue = alerts.some(a => a.type === 'danger');
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {hasIssue ? (
            <AlertTriangle size={22} className="text-red-600" />
          ) : (
            <Leaf size={22} className="text-green-600" />
          )}
          <h3 className={`font-semibold ${hasIssue ? 'text-red-800' : 'text-green-800'}`}>
            식물 상태 진단
          </h3>
        </div>
        <button
          onClick={() => navigate('/quest')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Swords size={16} />
          오늘의 퀘스트
        </button>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-start gap-2">
            {alert.type === 'good' ? (
              <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
            ) : (
              <Bug size={16} className="text-red-600 mt-0.5 shrink-0" />
            )}
            <span className={`text-sm ${alert.type === 'good' ? 'text-green-700' : 'text-red-700'}`}>
              {alert.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
