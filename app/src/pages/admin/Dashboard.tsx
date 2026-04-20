import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Gamepad2,
  DollarSign,
  ShoppingCart,
  Eye,
  Clock,
} from 'lucide-react';

const stats = [
  {
    title: '总用户数',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-500/20 text-blue-400',
  },
  {
    title: '租号账号数',
    value: '56',
    change: '+5',
    trend: 'up',
    icon: Gamepad2,
    color: 'bg-primary/20 text-primary',
  },
  {
    title: '出售账号数',
    value: '23',
    change: '+3',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500/20 text-green-400',
  },
  {
    title: '今日订单',
    value: '18',
    change: '-2',
    trend: 'down',
    icon: ShoppingCart,
    color: 'bg-purple-500/20 text-purple-400',
  },
];

const recentActivities = [
  { id: 1, type: 'rent', message: '用户 陈** 租赁了账号 SJZ307642', time: '5分钟前' },
  { id: 2, type: 'sell', message: '用户 李** 提交了出售申请', time: '15分钟前' },
  { id: 3, type: 'user', message: '新用户 王** 注册成功', time: '30分钟前' },
  { id: 4, type: 'rent', message: '用户 张** 租赁了账号 SJZ308521', time: '1小时前' },
  { id: 5, type: 'sell', message: '账号 SJZ310256 已通过审核', time: '2小时前' },
];

const pendingTasks = [
  { id: 1, title: '待审核出售账号', count: 5, priority: 'high' },
  { id: 2, title: '待处理租赁订单', count: 3, priority: 'medium' },
  { id: 3, title: '用户反馈待回复', count: 8, priority: 'low' },
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            欢迎回来，管理员
          </h1>
          <p className="text-gray-400 mt-1">
            今天是 {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-mono text-primary">
            {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900/50 rounded-xl border border-white/10 p-6 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm">较昨日</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-gray-900/50 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">最近活动</h3>
            <button className="text-primary text-sm hover:underline">查看全部</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'rent'
                      ? 'bg-primary/20 text-primary'
                      : activity.type === 'sell'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {activity.type === 'rent' ? (
                    <Gamepad2 className="w-5 h-5" />
                  ) : activity.type === 'sell' ? (
                    <DollarSign className="w-5 h-5" />
                  ) : (
                    <Users className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white">{activity.message}</p>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">待处理任务</h3>
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
              {pendingTasks.reduce((acc, t) => acc + t.count, 0)} 项
            </span>
          </div>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <span className="text-white">{task.title}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.priority === 'high'
                      ? 'bg-red-500/20 text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {task.count}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-gray-400 text-sm mb-4">快捷操作</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                添加租号账号
              </button>
              <button className="p-3 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                审核出售账号
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl border border-primary/30 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">今日访问量</p>
              <p className="text-2xl font-bold text-white">3,456</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 rounded-xl border border-blue-500/30 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">今日订单金额</p>
              <p className="text-2xl font-bold text-white">¥12,580</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500/20 to-green-500/5 rounded-xl border border-green-500/30 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">本月收益</p>
              <p className="text-2xl font-bold text-white">¥156,890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
