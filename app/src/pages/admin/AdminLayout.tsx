import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Gamepad2,
  DollarSign,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Shield,
} from 'lucide-react';
import { ADMIN_CONFIG, isAuthenticated, clearAuth } from '@/config/admin';

const menuItems = [
  { path: `${ADMIN_CONFIG.ADMIN_PATH}/dashboard`, label: '仪表盘', icon: LayoutDashboard },
  { path: `${ADMIN_CONFIG.ADMIN_PATH}/rent-accounts`, label: '租号账号管理', icon: Gamepad2 },
  { path: `${ADMIN_CONFIG.ADMIN_PATH}/sell-accounts`, label: '出售账号管理', icon: DollarSign },
  { path: `${ADMIN_CONFIG.ADMIN_PATH}/users`, label: '用户管理', icon: Users },
  { path: `${ADMIN_CONFIG.ADMIN_PATH}/settings`, label: '系统设置', icon: Settings },
];

// 登录验证组件
function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // 立即检查登录状态
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      
      if (!authenticated) {
        // 未登录，清除所有认证信息并跳转到登录页
        clearAuth();
        navigate(ADMIN_CONFIG.ADMIN_PATH + '/login', { replace: true });
      } else {
        setIsAuth(true);
      }
      setIsChecking(false);
    };
    
    checkAuth();
    
    // 添加页面可见性检查（防止用户在其他标签页清除登录状态）
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!isAuthenticated()) {
          clearAuth();
          navigate(ADMIN_CONFIG.ADMIN_PATH + '/login', { replace: true });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);

  // 显示加载状态
  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">验证登录状态...</p>
        </div>
      </div>
    );
  }

  // 未登录不显示任何内容（会被重定向）
  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}

function AdminLayoutContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate(ADMIN_CONFIG.ADMIN_PATH + '/login', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-white/10 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-white font-bold">后台管理</h1>
            <p className="text-gray-500 text-xs">三角洲租号</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-white font-semibold hidden sm:block">
              {menuItems.find((item) => isActive(item.path))?.label || '后台管理'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-white/5 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="搜索..."
                className="bg-transparent text-white text-sm placeholder:text-gray-500 outline-none w-48"
              />
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <span className="text-white text-sm hidden sm:block">管理员</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AuthGuard>
      <AdminLayoutContent />
    </AuthGuard>
  );
}
