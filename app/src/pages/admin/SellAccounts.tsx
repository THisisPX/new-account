import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  Filter,
  User,
  Shield,
  RefreshCw,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { GameAccountSell as SellAccount, SafeBoxType, StaminaLevel, LoginTypeCode } from '@/types/account';
import {
  safeBoxToDisplay,
  staminaToDisplay,
  loginTypeToDisplay,
  calculateRecyclePrice,
} from '@/utils/account';

// 选项数据（与主页出号页面一致）
const regions = ['QQ区', '微信区'];
const loginTypes = [
  { value: 'account', label: '账密登录' },
  { value: 'qrcode', label: '扫码登录' },
];
const ranks = ['青铜', '白银', '黄金', '铂金', '钻石', '黑鹰', '三角洲巅峰'];
const safeBoxes = [
  { value: '9grid', label: '9格安全箱 (3×3)' },
  { value: '6grid', label: '6格安全箱 (2×3)' },
  { value: 'other', label: '其它安全箱' },
];
const staminaLevels = [
  { value: '7', label: '7体' },
  { value: '5-6', label: '5-6体' },
  { value: '3-4', label: '3-4体' },
];
const trainingLevels = ['全部', '1级', '2级', '3级', '4级', '5级', '6级', '7级'];
const rangeLevels = ['全部', '1级', '2级', '3级', '4级', '5级', '6级', '7级'];
const awmAmmoRanges = ['全部', '0-20发', '21-50发', '51-100发', '100发以上'];
const banRecords = ['无封禁记录', '有封禁记录（已解封）', '有封禁记录（未解封）'];
const faceOptions = ['是本人', '不是本人'];

// 刀皮选项
const knifeSkins = ['暗星', '信条', '赤霄', '怜悯', '龙牙', '影锋', '黑海', '北极星', '电锯惊魂'];

// 干员皮肤选项
const operatorSkins: Record<string, string[]> = {
  '红狼': ['蚀金玫瑰', '黑鹰坠落'],
  '威龙': ['凌霄戍卫', '蛟龙行动', '铁面判官', '壮志凌云', '吴彦祖'],
  '蜂医': ['送葬人无题密令', '黑鹰坠落', '危险物质'],
  '无名': ['夜鹰'],
  '乌鲁鲁': ['黑鹰坠落'],
  '牧羊人': ['街头之王', '黑鹰坠落'],
  '露娜': ['黑-天际线'],
  '蛊': ['能天使-午夜邮差'],
  '骇爪': ['维什戴尔', '水墨云图'],
};

// Mock data using unified GameAccountSell type
const mockSellAccounts: SellAccount[] = [
  {
    id: 'SELL001',
    userId: 'USER001',
    userName: '陈浩然',
    region: 'QQ区',
    server: 'QQ',
    loginType: 'account',
    totalAssets: 300,
    harvardCoins: 237,
    level: 60,
    rank: '钻石',
    safeBox: '9grid',
    stamina: '7',
    trainingLevel: '7级',
    rangeLevel: '6级',
    awmAmmo: 70,
    banRecord: '无封禁记录',
    isOwnFace: true,
    superGuarantee: false,
    knifeSkins: [],
    operatorSkins: {},
    price: 608,
    note: '12格卡包，航天巴克...',
    status: 'pending',
    submittedAt: '2026-03-25',
    createdAt: '2026-03-25',
    updatedAt: '2026-03-25',
  },
  {
    id: 'SELL002',
    userId: 'USER002',
    userName: '李文博',
    region: '微信区',
    server: '微信',
    loginType: 'qrcode',
    totalAssets: 600,
    harvardCoins: 500,
    level: 65,
    rank: '黑鹰',
    safeBox: '9grid',
    stamina: '7',
    trainingLevel: '7级',
    rangeLevel: '7级',
    awmAmmo: 120,
    banRecord: '无封禁记录',
    isOwnFace: true,
    superGuarantee: true,
    knifeSkins: ['怜悯'],
    operatorSkins: { '威龙': ['凌霄戍卫'] },
    price: 1282,
    note: '全皮肤，满级干员',
    status: 'approved',
    submittedAt: '2026-03-24 10:15',
    createdAt: '2026-03-24',
    updatedAt: '2026-03-24',
  },
];

const statusMap = {
  pending: { label: '待审核', color: 'bg-yellow-500/20 text-yellow-400' },
  approved: { label: '已通过', color: 'bg-blue-500/20 text-blue-400' },
  completed: { label: '已完成', color: 'bg-green-500/20 text-green-400' },
  rejected: { label: '已拒绝', color: 'bg-red-500/20 text-red-400' },
};

export default function SellAccounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trainingFilter, setTrainingFilter] = useState('全部');
  const [rangeFilter, setRangeFilter] = useState('全部');
  const [awmAmmoFilter, setAwmAmmoFilter] = useState('全部');
  const [selectedAccount, setSelectedAccount] = useState<SellAccount | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [accounts, setAccounts] = useState<SellAccount[]>([]);
  
  const loadAccounts = () => {
    try {
      const storedData = localStorage.getItem('sellAccounts');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAccounts([...parsedData, ...mockSellAccounts]);
      } else {
        setAccounts(mockSellAccounts);
      }
    } catch (error) {
      setAccounts(mockSellAccounts);
    }
  };
  
  useEffect(() => {
    loadAccounts();
    const interval = setInterval(loadAccounts, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.rank.includes(searchQuery) ||
      account.harvardCoins.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    const matchesTraining = trainingFilter === '全部' || account.trainingLevel === trainingFilter;
    const matchesRange = rangeFilter === '全部' || account.rangeLevel === rangeFilter;
    
    let matchesAwmAmmo = true;
    if (awmAmmoFilter !== '全部') {
      const ammo = account.awmAmmo;
      switch (awmAmmoFilter) {
        case '0-20发':
          matchesAwmAmmo = ammo >= 0 && ammo <= 20;
          break;
        case '21-50发':
          matchesAwmAmmo = ammo >= 21 && ammo <= 50;
          break;
        case '51-100发':
          matchesAwmAmmo = ammo >= 51 && ammo <= 100;
          break;
        case '100发以上':
          matchesAwmAmmo = ammo > 100;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesTraining && matchesRange && matchesAwmAmmo;
  });

  const handleApprove = (account: SellAccount) => {
    const updatedAccounts = accounts.map(a => 
      a.id === account.id ? { ...a, status: 'approved' as const } : a
    );
    setAccounts(updatedAccounts);
    
    const storedData = JSON.parse(localStorage.getItem('sellAccounts') || '[]');
    const updatedStored = storedData.map((a: SellAccount) => 
      a.id === account.id ? { ...a, status: 'approved' } : a
    );
    localStorage.setItem('sellAccounts', JSON.stringify(updatedStored));
  };

  const handleReject = (account: SellAccount) => {
    const updatedAccounts = accounts.map(a => 
      a.id === account.id ? { ...a, status: 'rejected' as const } : a
    );
    setAccounts(updatedAccounts);
    
    const storedData = JSON.parse(localStorage.getItem('sellAccounts') || '[]');
    const updatedStored = storedData.map((a: SellAccount) => 
      a.id === account.id ? { ...a, status: 'rejected' } : a
    );
    localStorage.setItem('sellAccounts', JSON.stringify(updatedStored));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">出售账号管理</h1>
          <p className="text-gray-400 mt-1">管理用户提交的账号出售申请</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-black hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                添加申请
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>添加出售申请</DialogTitle>
              </DialogHeader>
              <AddAccountForm 
                onClose={() => setIsAddDialogOpen(false)} 
                onSuccess={() => {
                  loadAccounts();
                  setIsAddDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={loadAccounts}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="搜索账号编号、段位、哈弗币数量等"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white/5 border-white/10 text-white"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="rejected">已拒绝</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">训练中心</span>
            <Select value={trainingFilter} onValueChange={setTrainingFilter}>
              <SelectTrigger className="w-24 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {trainingLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">靶场</span>
            <Select value={rangeFilter} onValueChange={setRangeFilter}>
              <SelectTrigger className="w-24 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {rangeLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">AWM子弹数量</span>
            <Select value={awmAmmoFilter} onValueChange={setAwmAmmoFilter}>
              <SelectTrigger className="w-28 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {awmAmmoRanges.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">总申请数</p>
          <p className="text-2xl font-bold text-white">{accounts.length}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">待审核</p>
          <p className="text-2xl font-bold text-yellow-400">
            {accounts.filter((a) => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">已通过</p>
          <p className="text-2xl font-bold text-blue-400">
            {accounts.filter((a) => a.status === 'approved').length}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">已完成</p>
          <p className="text-2xl font-bold text-green-400">
            {accounts.filter((a) => a.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">申请编号/用户</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">区服/登录</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">资产/哈弗币</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">等级/段位</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">安全箱/体力</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">训练/靶场</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">AWM</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">刀皮</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">干员皮肤</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">封禁/人脸</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">质保</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">回收价格</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">状态</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 py-3">
                    <span className="text-primary font-mono text-xs">{account.id}</span>
                    <p className="text-white text-xs">{account.userName}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-gray-400 text-xs">{account.region}</p>
                    <p className="text-gray-500 text-xs">{loginTypeToDisplay(account.loginType)}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-white text-xs">{account.totalAssets}M</p>
                    <p className="text-gray-500 text-xs">{account.harvardCoins}M</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-white text-xs">{account.level}级</p>
                    <p className="text-gray-500 text-xs">{account.rank}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-gray-400 text-xs">{safeBoxToDisplay(account.safeBox)}</p>
                    <p className="text-gray-500 text-xs">{staminaToDisplay(account.stamina)}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-gray-400 text-xs">训练{account.trainingLevel}</p>
                    <p className="text-gray-500 text-xs">靶场{account.rangeLevel}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-gray-400 text-xs">{account.awmAmmo}发</span>
                  </td>
                  <td className="px-3 py-3">
                    {account.knifeSkins.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {account.knifeSkins.slice(0, 2).map(k => (
                          <span key={k} className="px-1 py-0.5 bg-primary/10 rounded text-xs text-primary">{k}</span>
                        ))}
                        {account.knifeSkins.length > 2 && (
                          <span className="text-gray-500 text-xs">+{account.knifeSkins.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {Object.keys(account.operatorSkins).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(account.operatorSkins).slice(0, 2).map(([op, skins]) => (
                          <span key={op} className="px-1 py-0.5 bg-white/5 rounded text-xs text-gray-400">
                            {op}:{skins.length}
                          </span>
                        ))}
                        {Object.keys(account.operatorSkins).length > 2 && (
                          <span className="text-gray-500 text-xs">+{Object.keys(account.operatorSkins).length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-gray-400 text-xs">{account.banRecord === '无封禁记录' ? '无' : '有'}</p>
                    <p className="text-gray-500 text-xs">{account.isOwnFace}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs ${account.superGuarantee ? 'text-green-400' : 'text-gray-500'}`}>
                      {account.superGuarantee ? '已开启' : '未开启'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-primary font-bold text-xs">¥{account.price.toFixed(0)}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusMap[account.status].color}`}>
                      {statusMap[account.status].label}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setIsDetailOpen(true);
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {account.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(account)}
                            className="p-1.5 hover:bg-green-500/20 rounded-lg text-gray-400 hover:text-green-400 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(account)}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">没有找到符合条件的申请</p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-gray-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>出售申请详情</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">申请编号</p>
                  <p className="text-white font-mono text-sm">{selectedAccount.id}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">提交时间</p>
                  <p className="text-white text-sm">{selectedAccount.submittedAt}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-primary font-medium mb-3 text-sm flex items-center gap-2">
                  <User className="w-4 h-4" /> 用户信息
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-gray-400 text-xs">用户名</p><p className="text-white text-sm">{selectedAccount.userName}</p></div>
                  <div><p className="text-gray-400 text-xs">用户ID</p><p className="text-white text-sm">{selectedAccount.userId}</p></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-primary font-medium mb-3 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" /> 账号信息
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-gray-400 text-xs">区服</p><p className="text-white text-sm">{selectedAccount.region}</p></div>
                  <div><p className="text-gray-400 text-xs">登录方式</p><p className="text-white text-sm">{loginTypeToDisplay(selectedAccount.loginType)}</p></div>
                  <div><p className="text-gray-400 text-xs">仓库总资产</p><p className="text-white text-sm">{selectedAccount.totalAssets}M</p></div>
                  <div><p className="text-gray-400 text-xs">哈弗币</p><p className="text-white text-sm">{selectedAccount.harvardCoins}M</p></div>
                  <div><p className="text-gray-400 text-xs">等级</p><p className="text-white text-sm">{selectedAccount.level}级</p></div>
                  <div><p className="text-gray-400 text-xs">段位</p><p className="text-white text-sm">{selectedAccount.rank}</p></div>
                  <div><p className="text-gray-400 text-xs">安全箱</p><p className="text-white text-sm">{safeBoxToDisplay(selectedAccount.safeBox)}</p></div>
                  <div><p className="text-gray-400 text-xs">体力</p><p className="text-white text-sm">{staminaToDisplay(selectedAccount.stamina)}</p></div>
                  <div><p className="text-gray-400 text-xs">训练中心</p><p className="text-white text-sm">{selectedAccount.trainingLevel}</p></div>
                  <div><p className="text-gray-400 text-xs">靶场</p><p className="text-white text-sm">{selectedAccount.rangeLevel}</p></div>
                  <div><p className="text-gray-400 text-xs">AWM子弹</p><p className="text-white text-sm">{selectedAccount.awmAmmo}发</p></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-primary font-medium mb-3 text-sm">其他信息</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-gray-400 text-xs">封禁记录</p><p className="text-white text-sm">{selectedAccount.banRecord}</p></div>
                  <div><p className="text-gray-400 text-xs">人脸是否本人</p><p className="text-white text-sm">{selectedAccount.isOwnFace ? '是' : '否'}</p></div>
                  <div><p className="text-gray-400 text-xs">超级质保</p><p className="text-white text-sm">{selectedAccount.superGuarantee ? '已开启' : '未开启'}</p></div>
                </div>
              </div>

              {selectedAccount.knifeSkins.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-primary font-medium mb-2 text-sm">刀皮</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAccount.knifeSkins.map((knife) => (
                      <span key={knife} className="px-2 py-1 bg-primary/10 rounded text-xs text-primary">{knife}</span>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(selectedAccount.operatorSkins).length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-primary font-medium mb-2 text-sm">干员皮肤</h4>
                  <div className="space-y-1">
                    {Object.entries(selectedAccount.operatorSkins).map(([op, skins]) => (
                      <div key={op}>
                        <p className="text-gray-400 text-xs">{op}</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {skins.map(skin => (
                            <span key={skin} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">{skin}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                <h4 className="text-primary font-medium mb-2 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> 回收价格
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">计算价格</p>
                    <p className="text-3xl font-bold text-primary">¥{selectedAccount.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">状态</p>
                    <span className={`px-3 py-1 rounded-full text-sm ${statusMap[selectedAccount.status].color}`}>
                      {statusMap[selectedAccount.status].label}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAccount.note && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-primary font-medium mb-2 text-sm">备注</h4>
                  <p className="text-gray-400 text-sm">{selectedAccount.note}</p>
                </div>
              )}

              {selectedAccount.status === 'pending' && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      handleApprove(selectedAccount);
                      setIsDetailOpen(false);
                    }}
                    className="flex-1 bg-green-500 text-white hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    通过审核
                  </Button>
                  <Button
                    onClick={() => {
                      handleReject(selectedAccount);
                      setIsDetailOpen(false);
                    }}
                    variant="outline"
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    拒绝申请
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 添加账号表单组件
function AddAccountForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState<{
    userName: string;
    region: string;
    loginType: LoginTypeCode | '';
    totalAssets: string;
    harvardCoins: string;
    level: string;
    rank: string;
    safeBox: SafeBoxType | '';
    stamina: StaminaLevel | '';
    trainingLevel: string;
    rangeLevel: string;
    awmAmmo: string;
    banRecord: string;
    isOwnFace: string;
    superGuarantee: boolean;
    note: string;
  }>({
    userName: '',
    region: '',
    loginType: '' as LoginTypeCode | '',
    totalAssets: '',
    harvardCoins: '',
    level: '',
    rank: '',
    safeBox: '' as SafeBoxType | '',
    stamina: '' as StaminaLevel | '',
    trainingLevel: '',
    rangeLevel: '',
    awmAmmo: '',
    banRecord: '',
    isOwnFace: '',
    superGuarantee: false,
    note: '',
  });
  
  const [selectedKnives, setSelectedKnives] = useState<string[]>([]);
  const [selectedOperatorSkins, setSelectedOperatorSkins] = useState<Record<string, string[]>>({});
  const [expandedOperators, setExpandedOperators] = useState<Record<string, boolean>>({});
  const [recyclePrice, setRecyclePrice] = useState<number | null>(null);

  // 计算回收价格
  useEffect(() => {
    const harvardCoins = parseFloat(formData.harvardCoins);
    const safeBox = formData.safeBox as SafeBoxType;
    const stamina = formData.stamina as StaminaLevel;

    if (harvardCoins && safeBox && stamina) {
      const result = calculateRecyclePrice(
        harvardCoins,
        safeBox,
        stamina,
        selectedKnives,
        selectedOperatorSkins
      );
      setRecyclePrice(result.recyclePrice);
    } else {
      setRecyclePrice(null);
    }
  }, [formData.harvardCoins, formData.safeBox, formData.stamina, selectedKnives, selectedOperatorSkins]);

  const toggleKnife = (knife: string) => {
    setSelectedKnives(prev => 
      prev.includes(knife) 
        ? prev.filter(k => k !== knife)
        : [...prev, knife]
    );
  };

  const toggleOperatorSkin = (operator: string, skin: string) => {
    setSelectedOperatorSkins(prev => {
      const current = prev[operator] || [];
      const updated = current.includes(skin)
        ? current.filter(s => s !== skin)
        : [...current, skin];
      return { ...prev, [operator]: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: SellAccount = {
      id: 'SELL' + Date.now().toString().slice(-6),
      userId: 'USER' + Math.floor(Math.random() * 10000),
      userName: formData.userName || '用户' + Math.floor(Math.random() * 10000),
      region: formData.region,
      server: formData.region === 'QQ区' ? 'QQ' : '微信',
      loginType: formData.loginType as LoginTypeCode,
      totalAssets: parseFloat(formData.totalAssets) || 0,
      harvardCoins: parseFloat(formData.harvardCoins) || 0,
      level: parseInt(formData.level) || 0,
      rank: (formData.rank as SellAccount['rank']) || '青铜',
      safeBox: formData.safeBox as SafeBoxType,
      stamina: formData.stamina as StaminaLevel,
      trainingLevel: formData.trainingLevel || '1级',
      rangeLevel: formData.rangeLevel || '1级',
      awmAmmo: parseInt(formData.awmAmmo) || 0,
      banRecord: formData.banRecord || '无封禁记录',
      isOwnFace: formData.isOwnFace === '是本人',
      superGuarantee: formData.superGuarantee,
      knifeSkins: selectedKnives,
      operatorSkins: selectedOperatorSkins,
      price: recyclePrice || 0,
      note: formData.note,
      status: 'pending',
      submittedAt: new Date().toLocaleString('zh-CN'),
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
    };
    
    try {
      const existingData = JSON.parse(localStorage.getItem('sellAccounts') || '[]');
      existingData.unshift(submitData);
      localStorage.setItem('sellAccounts', JSON.stringify(existingData));
      onSuccess();
    } catch (error) {
      alert('添加失败，请重试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* 基本信息 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">基本信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">用户名</Label>
            <Input
              placeholder="如：陈浩然"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">区服 <span className="text-red-500">*</span></Label>
            <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择区服" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 登录方式 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">登录方式</h3>
        <div className="space-y-2">
          <Select value={formData.loginType} onValueChange={(v) => setFormData({ ...formData, loginType: v as LoginTypeCode })} required>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择登录方式" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              {loginTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 账号资产 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">账号资产</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">仓库总资产 (M) <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="如：300"
                value={formData.totalAssets}
                onChange={(e) => setFormData({ ...formData, totalAssets: e.target.value })}
                className="bg-white/5 border-white/10 text-white pr-12"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">M</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">哈弗币数量 (M) <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="如：237"
                value={formData.harvardCoins}
                onChange={(e) => setFormData({ ...formData, harvardCoins: e.target.value })}
                className="bg-white/5 border-white/10 text-white pr-12"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">M</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">等级 <span className="text-red-500">*</span></Label>
            <Input
              type="number"
              placeholder="如：60"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">段位 <span className="text-red-500">*</span></Label>
            <Select value={formData.rank} onValueChange={(v) => setFormData({ ...formData, rank: v })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择段位" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {ranks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 安全箱和体力 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">安全箱和体力</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">安全箱等级 <span className="text-red-500">*</span></Label>
            <Select value={formData.safeBox} onValueChange={(v) => setFormData({ ...formData, safeBox: v as SafeBoxType })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择安全箱" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {safeBoxes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">体力等级 <span className="text-red-500">*</span></Label>
            <Select value={formData.stamina} onValueChange={(v) => setFormData({ ...formData, stamina: v as StaminaLevel })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择体力等级" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {staminaLevels.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 训练中心和靶场 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">训练中心和靶场</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">训练中心等级</Label>
            <Select value={formData.trainingLevel} onValueChange={(v) => setFormData({ ...formData, trainingLevel: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择等级" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {trainingLevels.filter(l => l !== '全部').map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">靶场等级</Label>
            <Select value={formData.rangeLevel} onValueChange={(v) => setFormData({ ...formData, rangeLevel: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择等级" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {rangeLevels.filter(l => l !== '全部').map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* AWM子弹 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">AWM子弹</h3>
        <div className="space-y-2">
          <Label className="text-sm text-gray-400">AWM子弹数量</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="如：70"
              value={formData.awmAmmo}
              onChange={(e) => setFormData({ ...formData, awmAmmo: e.target.value })}
              className="bg-white/5 border-white/10 text-white pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">发</span>
          </div>
        </div>
      </div>

      {/* 封禁记录和人脸 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">其他信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">封禁记录 <span className="text-red-500">*</span></Label>
            <Select value={formData.banRecord} onValueChange={(v) => setFormData({ ...formData, banRecord: v })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择封禁记录" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {banRecords.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">人脸是否自己的 <span className="text-red-500">*</span></Label>
            <Select value={formData.isOwnFace} onValueChange={(v) => setFormData({ ...formData, isOwnFace: v })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {faceOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 超级质保 */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="superGuarantee"
            checked={formData.superGuarantee}
            onCheckedChange={(checked) => setFormData({ ...formData, superGuarantee: checked as boolean })}
          />
          <Label htmlFor="superGuarantee" className="text-white cursor-pointer">
            开启超级质保 <span className="text-primary">(将收取6%服务费)</span>
          </Label>
        </div>
      </div>

      {/* 刀皮选择 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">刀皮选择</h3>
        <div className="flex flex-wrap gap-2">
          {knifeSkins.map((knife) => (
            <button
              key={knife}
              type="button"
              onClick={() => toggleKnife(knife)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 text-xs ${
                selectedKnives.includes(knife)
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                selectedKnives.includes(knife) ? 'bg-primary border-primary' : 'border-gray-500'
              }`}>
                {selectedKnives.includes(knife) && <span className="text-black text-xs">✓</span>}
              </div>
              {knife}
            </button>
          ))}
        </div>
      </div>

      {/* 干员皮肤选择 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">干员皮肤选择</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(operatorSkins).map(([operator, skins]) => (
            <div key={operator} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedOperators(prev => ({ ...prev, [operator]: !prev[operator] }))}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors"
              >
                <span className="text-white text-sm font-medium">{operator}</span>
                {expandedOperators[operator] ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedOperators[operator] && (
                <div className="px-3 pb-3 space-y-1">
                  {skins.map((skin) => (
                    <label key={skin} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedOperatorSkins[operator]?.includes(skin) || false}
                        onCheckedChange={() => toggleOperatorSkin(operator, skin)}
                      />
                      <span className="text-gray-400 text-sm">{skin}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 回收价格 */}
      {recyclePrice !== null && (
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
          <h4 className="text-primary font-medium mb-2">回收价格</h4>
          <p className="text-2xl font-bold text-primary">¥{recyclePrice.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">
            计算公式：(M数值 × 100) ÷ 比例
          </p>
        </div>
      )}

      {/* 备注 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">备注说明</h3>
        <Textarea
          placeholder="请输入账号的详细说明..."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="bg-white/5 border-white/10 text-white min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
          取消
        </Button>
        <Button type="submit" className="bg-primary text-black hover:bg-primary-dark">
          确认添加
        </Button>
      </div>
    </form>
  );
}
