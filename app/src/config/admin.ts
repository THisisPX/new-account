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
  
  // 管理员账号（生产环境应该从服务器获取）
  CREDENTIALS: {
    username: 'admin',
    // 生产环境密码：Delta@Rent#2024!Secure
    password: 'Delta@Rent#2024!Secure',
  },
  
  // JWT配置
  JWT: {
    // 密钥（随机生成）
    SECRET: 'dR7#kL9$mN2@vB5*wQ8^jH4&cF6',
    // 过期时间（小时）
    EXPIRES: 24,
  },
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('adminToken');
  const loginTime = localStorage.getItem('adminLoginTime');
  
  // 检查令牌是否存在
  if (!token) {
    return false;
  }
  
  // 检查令牌是否有效
  if (!verifyToken(token)) {
    clearAuth();
    return false;
  }
  
  // 检查登录是否过期
  if (loginTime) {
    const elapsed = Date.now() - parseInt(loginTime, 10);
    const maxAge = ADMIN_CONFIG.JWT.EXPIRES * 3600 * 1000;
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

// 验证JWT令牌
export const verifyToken = (token: string): boolean => {
  try {
    // 简单的令牌验证（生产环境应该使用真正的JWT库）
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return payload.exp > now;
  } catch {
    return false;
  }
};

// 生成JWT令牌
export const generateToken = (): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    sub: 'admin',
    iat: now,
    exp: now + ADMIN_CONFIG.JWT.EXPIRES * 3600,
  }));
  const signature = btoa(ADMIN_CONFIG.JWT.SECRET);
  
  return `${header}.${payload}.${signature}`;
};
