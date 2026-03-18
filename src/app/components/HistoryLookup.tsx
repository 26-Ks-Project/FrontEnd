import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Search } from 'lucide-react';

export function HistoryLookup() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const handleLookup = () => {
    if (selectedDate) {
      navigate(`/history/${selectedDate}`);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar size={24} className="text-green-600" />
        이전 기록 조회
      </h2>
      <div className="space-y-3">
        <input
          type="date"
          value={selectedDate}
          max={today}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
        />
        <button
          onClick={handleLookup}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer"
        >
          <Search size={18} />
          조회하기
        </button>
      </div>
    </div>
  );
}
