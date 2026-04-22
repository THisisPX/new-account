// 后台管理配置
// 生产环境请修改这些配置

export const ADMIN_CONFIG = {
  // 后台路径 - 修改这个让后台更难被发现
  // 当前路径：/x9k7m3p2（随机生成）
  ADMIN_PATH: '/x9k7m3p2',

  // 登录配置
  LOGIN: {
    // 最大登录失败次数
    MAX_ATTEMPTS: 5,
    // 锁定时间（分钟）
    LOCKOUT_DURATION: 30,
    // 是否启用验证码
    ENABLE_CAPTCHA: true,
  },

  // API 配置
  API_URL: 'http://localhost:3001/api',
};

// 检查是否已登录（通过检查 localStorage 中的 token）
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem('adminToken');
  const loginTime = localStorage.getItem('adminLoginTime');

  // 检查令牌是否存在
  if (!token) {
    return false;
  }

  // 检查登录是否过期（24小时）
  if (loginTime) {
    const elapsed = Date.now() - parseInt(loginTime, 10);
    const maxAge = 24 * 3600 * 1000; // 24 hours
    if (elapsed > maxAge) {
      clearAuth();
      return false;
    }
  }

  return true;
};

// 清除登录状态
export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminLoginTime');
  localStorage.removeItem('loginAttempts');
  localStorage.removeItem('lastAttemptTime');
};

// 获取存储的登录失败次数
export const getLoginAttempts = (): number => {
  if (typeof window === 'undefined') return 0;
  const attempts = localStorage.getItem('loginAttempts');
  return attempts ? parseInt(attempts, 10) : 0;
};

// 增加登录失败次数
export const incrementLoginAttempts = (): void => {
  if (typeof window === 'undefined') return;
  const attempts = getLoginAttempts() + 1;
  localStorage.setItem('loginAttempts', attempts.toString());
  localStorage.setItem('lastAttemptTime', Date.now().toString());
};

// 重置登录失败次数
export const resetLoginAttempts = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('loginAttempts');
  localStorage.removeItem('lastAttemptTime');
};

// 检查是否被锁定
export const isLockedOut = (): boolean => {
  if (typeof window === 'undefined') return false;
  const attempts = getLoginAttempts();
  if (attempts >= ADMIN_CONFIG.LOGIN.MAX_ATTEMPTS) {
    const lastAttempt = localStorage.getItem('lastAttemptTime');
    if (lastAttempt) {
      const elapsed = Date.now() - parseInt(lastAttempt, 10);
      const lockoutDuration = ADMIN_CONFIG.LOGIN.LOCKOUT_DURATION * 60 * 1000;
      if (elapsed < lockoutDuration) {
        return true;
      }
      // 锁定时间已过，重置
      resetLoginAttempts();
    }
  }
  return false;
};

// 获取剩余锁定时间（分钟）
export const getRemainingLockoutTime = (): number => {
  if (typeof window === 'undefined') return 0;
  const lastAttempt = localStorage.getItem('lastAttemptTime');
  if (lastAttempt) {
    const elapsed = Date.now() - parseInt(lastAttempt, 10);
    const lockoutDuration = ADMIN_CONFIG.LOGIN.LOCKOUT_DURATION * 60 * 1000;
    const remaining = lockoutDuration - elapsed;
    return Math.max(0, Math.ceil(remaining / 60000));
  }
  return 0;
};

// 生成简单的验证码
export const generateCaptcha = (): { question: string; answer: string } => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let answer: number;
  if (operation === '+') {
    answer = num1 + num2;
  } else {
    answer = num1 - num2;
  }

  return {
    question: `${num1} ${operation} ${num2} = ?`,
    answer: answer.toString(),
  };
};
