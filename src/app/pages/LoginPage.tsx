import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sprout, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    // 데모용: 아무 값이나 입력하면 로그인
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-200 p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-600 p-4 rounded-2xl mb-4">
            <Sprout size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">스마트팜 제어 시스템</h1>
          <p className="text-gray-500 mt-1">로그인하여 시작하세요</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input
              type="text"
              value={id}
              onChange={(e) => { setId(e.target.value); setError(''); }}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors pr-12"
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            로그인
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          데모 버전: 아무 값이나 입력하여 로그인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
