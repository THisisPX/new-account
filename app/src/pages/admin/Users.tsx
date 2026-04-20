import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Gamepad2,
  DollarSign,
  Filter,
} from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  phone: string;
  status: 'active' | 'banned' | 'inactive';
  registerDate: string;
  lastLogin: string;
  rentCount: number;
  sellCount: number;
  totalSpent: number;
}

const mockUsers: UserData[] = [
  {
    id: 'USER001',
    username: '陈浩然',
    email: 'chen@example.com',
    phone: '138****8888',
    status: 'active',
    registerDate: '2024-01-15',
    lastLogin: '2026-03-25 14:30',
    rentCount: 12,
    sellCount: 2,
    totalSpent: 3456,
  },
  {
    id: 'USER002',
    username: '李文博',
    email: 'li@example.com',
    phone: '139****6666',
    status: 'active',
    registerDate: '2024-02-20',
    lastLogin: '2026-03-24 10:15',
    rentCount: 8,
    sellCount: 1,
    totalSpent: 2180,
  },
  {
    id: 'USER003',
    username: '王梓轩',
    email: 'wang@example.com',
    phone: '137****9999',
    status: 'inactive',
    registerDate: '2024-03-10',
    lastLogin: '2026-02-15 18:20',
    rentCount: 3,
    sellCount: 0,
    totalSpent: 890,
  },
  {
    id: 'USER004',
    username: '刘子涵',
    email: 'liu@example.com',
    phone: '136****7777',
    status: 'banned',
    registerDate: '2024-04-05',
    lastLogin: '2026-01-20 09:00',
    rentCount: 5,
    sellCount: 1,
    totalSpent: 1560,
  },
];

const statusMap = {
  active: { label: '正常', color: 'bg-green-500/20 text-green-400' },
  inactive: { label: '未激活', color: 'bg-gray-500/20 text-gray-400' },
  banned: { label: '已封禁', color: 'bg-red-500/20 text-red-400' },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleBan = (user: UserData) => {
    console.log('封禁用户:', user.id);
    // 处理封禁逻辑
  };

  const handleUnban = (user: UserData) => {
    console.log('解封用户:', user.id);
    // 处理解封逻辑
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">用户管理</h1>
          <p className="text-gray-400 mt-1">管理平台所有用户信息</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="搜索用户ID、用户名或邮箱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">正常</SelectItem>
              <SelectItem value="inactive">未激活</SelectItem>
              <SelectItem value="banned">已封禁</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">总用户数</p>
          <p className="text-2xl font-bold text-white">{mockUsers.length}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">正常用户</p>
          <p className="text-2xl font-bold text-green-400">
            {mockUsers.filter((u) => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">未激活</p>
          <p className="text-2xl font-bold text-gray-400">
            {mockUsers.filter((u) => u.status === 'inactive').length}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">已封禁</p>
          <p className="text-2xl font-bold text-red-400">
            {mockUsers.filter((u) => u.status === 'banned').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">用户ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">用户信息</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">联系方式</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">交易统计</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">状态</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">注册时间</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-primary font-mono">{user.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-gray-500 text-sm">最后登录: {user.lastLogin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-white text-sm flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-500" />
                        {user.email}
                      </p>
                      <p className="text-white text-sm flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-500" />
                        {user.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-white text-sm flex items-center gap-2">
                        <Gamepad2 className="w-3 h-3 text-gray-500" />
                        租赁: {user.rentCount}次
                      </p>
                      <p className="text-white text-sm flex items-center gap-2">
                        <DollarSign className="w-3 h-3 text-gray-500" />
                        出售: {user.sellCount}次
                      </p>
                      <p className="text-primary text-sm font-medium">
                        总消费: ¥{user.totalSpent}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusMap[user.status].color}`}>
                      {statusMap[user.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.registerDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDetailOpen(true);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.status === 'banned' ? (
                        <button
                          onClick={() => handleUnban(user)}
                          className="p-2 hover:bg-green-500/20 rounded-lg text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBan(user)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">没有找到符合条件的用户</p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-gray-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>用户详情</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedUser.username}</h3>
                  <p className="text-gray-400">{selectedUser.id}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${statusMap[selectedUser.status].color}`}>
                    {statusMap[selectedUser.status].label}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">联系方式</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      邮箱
                    </p>
                    <p className="text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      手机号
                    </p>
                    <p className="text-white">{selectedUser.phone}</p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">账号信息</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      注册时间
                    </p>
                    <p className="text-white">{selectedUser.registerDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">最后登录</p>
                    <p className="text-white">{selectedUser.lastLogin}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Stats */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">交易统计</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <p className="text-gray-400 text-sm">租赁次数</p>
                    <p className="text-2xl font-bold text-primary">{selectedUser.rentCount}</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <p className="text-gray-400 text-sm">出售次数</p>
                    <p className="text-2xl font-bold text-green-400">{selectedUser.sellCount}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                    <p className="text-gray-400 text-sm">总消费</p>
                    <p className="text-2xl font-bold text-blue-400">¥{selectedUser.totalSpent}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {selectedUser.status === 'banned' ? (
                  <Button
                    onClick={() => {
                      handleUnban(selectedUser);
                      setIsDetailOpen(false);
                    }}
                    className="flex-1 bg-green-500 text-white hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    解封用户
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleBan(selectedUser);
                      setIsDetailOpen(false);
                    }}
                    variant="outline"
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    封禁用户
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
