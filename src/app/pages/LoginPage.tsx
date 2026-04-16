import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sprout, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../service/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authService.isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError('로그인에 실패했습니다. 정보를 확인해주세요.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="이메일을 입력하세요"
              disabled={isLoading}
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
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
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
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer flex justify-center items-center`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          이메일과 비밀번호를 입력하여 로그인을 완료하세요.
        </p>
      </div>
    </div>
  );
}
