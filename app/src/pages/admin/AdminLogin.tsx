import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, Lock, User, AlertTriangle, RefreshCw } from 'lucide-react';
import {
  ADMIN_CONFIG,
  incrementLoginAttempts,
  resetLoginAttempts,
  isLockedOut,
  getRemainingLockoutTime,
  generateCaptcha,
  isAuthenticated,
} from '@/config/admin';
import { adminApi } from '@/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState({ question: '', answer: '' });
  const [lockoutTime, setLockoutTime] = useState(0);

  // 初始化验证码
  useEffect(() => {
    refreshCaptcha();
    checkLockout();
    
    // 如果已经登录，直接跳转到后台
    if (isAuthenticated()) {
      navigate(ADMIN_CONFIG.ADMIN_PATH + '/dashboard', { replace: true });
    }
  }, [navigate]);

  // 检查锁定状态
  const checkLockout = () => {
    if (isLockedOut()) {
      setLockoutTime(getRemainingLockoutTime());
      const interval = setInterval(() => {
        const remaining = getRemainingLockoutTime();
        setLockoutTime(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 60000);
      return () => clearInterval(interval);
    }
  };

  // 刷新验证码
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData(prev => ({ ...prev, captcha: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 检查是否被锁定
    if (isLockedOut()) {
      setError(`登录失败次数过多，请 ${lockoutTime} 分钟后重试`);
      return;
    }

    // 验证验证码
    if (ADMIN_CONFIG.LOGIN.ENABLE_CAPTCHA && formData.captcha !== captcha.answer) {
      setError('验证码错误');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      const result = await adminApi.login(formData.username, formData.password);
      // 登录成功
      resetLoginAttempts();
      localStorage.setItem('adminToken', result.token);
      localStorage.setItem('adminLoginTime', Date.now().toString());
      // 跳转到后台首页
      navigate(ADMIN_CONFIG.ADMIN_PATH + '/dashboard', { replace: true });
    } catch (err: any) {
      // 登录失败
      incrementLoginAttempts();

      if (isLockedOut()) {
        setError(`登录失败次数过多，请 ${ADMIN_CONFIG.LOGIN.LOCKOUT_DURATION} 分钟后重试`);
        setLockoutTime(ADMIN_CONFIG.LOGIN.LOCKOUT_DURATION);
      } else {
        setError(err.message || '用户名或密码错误');
      }
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">后台管理系统</h1>
          <p className="text-gray-400 mt-2">三角洲租号平台管理后台</p>
        </div>

        {/* Lockout Warning */}
        {lockoutTime > 0 && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">账号已锁定</p>
                <p className="text-red-400/70 text-sm">
                  登录失败次数过多，请 {lockoutTime} 分钟后重试
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label className="text-gray-300">用户名</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  disabled={lockoutTime > 0}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-gray-300">密码</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  disabled={lockoutTime > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Captcha */}
            {ADMIN_CONFIG.LOGIN.ENABLE_CAPTCHA && (
              <div className="space-y-2">
                <Label className="text-gray-300">验证码</Label>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="请输入答案"
                    value={formData.captcha}
                    onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    disabled={lockoutTime > 0}
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-primary font-mono font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
                    disabled={lockoutTime > 0}
                  >
                    {captcha.question}
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-black hover:bg-primary-dark font-semibold py-6"
              disabled={isLoading || lockoutTime > 0}
            >
              {isLoading ? '登录中...' : lockoutTime > 0 ? `请 ${lockoutTime} 分钟后重试` : '登录'}
            </Button>
          </form>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div className="text-yellow-400/80 text-sm">
                <p className="font-medium">安全提示</p>
                <p>请勿在公共网络登录后台</p>
                <p>登录失败 5 次将锁定 30 分钟</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2024 三角洲租号 · 后台管理系统
        </p>
      </div>
    </div>
  );
}
