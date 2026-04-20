import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  Plus,
  Eye,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import type { GameAccountRent, LoginTypeCode, SafeBoxType } from '@/types/account';
import {
  harvardCoinsToAssetsDisplay,
  loginTypeToDisplay,
  safeBoxToShortDisplay,
} from '@/utils/account';

// 筛选选项数据（与主页租号页面一致）
const filterOptions = {
  ranks: ['青铜', '白银', '黄金', '铂金', '钻石', '黑鹰', '三角洲巅峰'],
  safes: ['1×2基础安全箱', '2×2进阶安全箱', '2×3高级保险箱', '3×3顶级安全箱'],
  knives: ['暗星', '信条', '赤霄', '怜悯', '龙牙', '影锋', '黑海', '北极星', '电锯惊魂'],
  trainingLevels: ['1级', '2级', '3级', '4级', '5级', '6级', '7级'],
  rangeLevels: ['1级', '2级', '3级', '4级', '5级', '6级', '7级'],
};

// 干员皮肤数据（与主页租号页面一致）
const operatorSkins: Record<string, string[]> = {
  '红狼': ['蚀金玫瑰', '黑鹰坠落'],
  '威龙': ['凌霄戍卫', '蛟龙行动', '铁面判官', '壮志凌云', '吴彦祖'],
  '蜂医': ['送葬人无题密令', '黑鹰坠落', '危险物质'],
  '无名': ['夜鹰'],
  '乌鲁鲁': ['黑鹰坠落'],
  '牧羊人': ['黑鹰坠落', '街头之王'],
  '露娜': ['黑-天际线'],
  '蛊': ['能天使-午夜邮差'],
  '骇爪': ['维什戴尔', '水墨云图'],
};

// 账号数据类型（使用统一的 GameAccountRent）
const mockAccounts: GameAccountRent[] = [
  {
    id: 'SJZ307642',
    region: '广东省',
    server: 'QQ',
    loginType: 'account',
    rank: '钻石',
    harvardCoins: 5,
    totalAssets: 5,
    assetsDisplay: '5000万',
    level: 0,
    safeBox: '9grid',
    stamina: '7',
    awmAmmo: 70,
    trainingLevel: '7级',
    rangeLevel: '6级',
    knifeSkins: ['电锯惊魂', '暗星'],
    operatorSkins: { '露娜': ['黑-天际线'], '无名': ['夜鹰'] },
    price: 765,
    deposit: 559,
    note: '12格卡包，航天巴克...',
    status: 'active',
    createdAt: '2026-03-25',
    updatedAt: '2026-03-25',
  },
  {
    id: 'SJZ308521',
    region: '浙江省',
    server: '微信',
    loginType: 'qrcode',
    rank: '黑鹰',
    harvardCoins: 8,
    totalAssets: 8,
    assetsDisplay: '8000万',
    level: 0,
    safeBox: '9grid',
    stamina: '7',
    awmAmmo: 120,
    trainingLevel: '7级',
    rangeLevel: '7级',
    knifeSkins: ['怜悯', '影锋'],
    operatorSkins: {},
    price: 1280,
    deposit: 800,
    note: '全皮肤，满级干员',
    status: 'rented',
    createdAt: '2026-03-24',
    updatedAt: '2026-03-24',
  },
];

const statusMap = {
  active: { label: '可租赁', color: 'bg-green-500/20 text-green-400' },
  rented: { label: '已出租', color: 'bg-blue-500/20 text-blue-400' },
  disabled: { label: '已下架', color: 'bg-gray-500/20 text-gray-400' },
};

export default function RentAccounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<GameAccountRent | null>(null);
  const [accounts, setAccounts] = useState<GameAccountRent[]>([]);

  // 从 localStorage 加载数据
  const loadAccounts = () => {
    try {
      const storedData = localStorage.getItem('rentAccounts');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAccounts([...parsedData, ...mockAccounts]);
      } else {
        setAccounts(mockAccounts);
      }
    } catch (error) {
      setAccounts(mockAccounts);
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
      account.rank.includes(searchQuery) ||
      account.assetsDisplay.includes(searchQuery) ||
      account.harvardCoins.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">租号账号管理</h1>
          <p className="text-gray-400 mt-1">管理平台上的所有租赁账号</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-black hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                添加账号
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>添加租号账号</DialogTitle>
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="搜索账号编号、段位、哈弗币数量等"
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
              <SelectItem value="active">可租赁</SelectItem>
              <SelectItem value="rented">已出租</SelectItem>
              <SelectItem value="disabled">已下架</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">总账号数</p>
          <p className="text-2xl font-bold text-white">{accounts.length}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">可租赁</p>
          <p className="text-2xl font-bold text-green-400">
            {accounts.filter((a) => a.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">已出租</p>
          <p className="text-2xl font-bold text-blue-400">
            {accounts.filter((a) => a.status === 'rented').length}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-4">
          <p className="text-gray-400 text-sm">已下架</p>
          <p className="text-2xl font-bold text-gray-400">
            {accounts.filter((a) => a.status === 'disabled').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">账号编号/区服</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">段位/哈弗币</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">安全箱</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">训练/靶场</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">AWM</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">刀皮</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">干员皮肤</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">价格/押金</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">状态</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 py-3">
                    <span className="text-primary font-mono text-xs">{account.id}</span>
                    <p className="text-gray-500 text-xs">{account.region}/{account.server}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-white text-xs">{account.rank}</p>
                    <p className="text-gray-500 text-xs">{account.assetsDisplay}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-gray-400 text-xs">{safeBoxToShortDisplay(account.safeBox)}</span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-gray-400 text-xs">训练{account.trainingLevel}</p>
                    <p className="text-gray-500 text-xs">靶场{account.rangeLevel}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-gray-400 text-xs">{account.awmAmmo}发</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-primary text-xs">{account.knifeSkins[0]}</span>
                    {account.knifeSkins.length > 1 && <p className="text-gray-500 text-xs">{account.knifeSkins.slice(1).join('、')}</p>}
                  </td>
                  <td className="px-3 py-3">
                    {Object.keys(account.operatorSkins).length > 0 ? (
                      <div className="space-y-1 max-w-[200px]">
                        {Object.entries(account.operatorSkins).map(([op, skins]) => (
                          <div key={op} className="text-xs">
                            <span className="text-primary">{op}</span>
                            <span className="text-gray-500">: </span>
                            <span className="text-gray-400">{skins.join('、')}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-primary font-bold text-xs">¥{account.price}</p>
                    <p className="text-gray-500 text-xs">押¥{account.deposit}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusMap[account.status].color}`}>
                      {statusMap[account.status].label}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <button 
                      onClick={() => {
                        setSelectedAccount(account);
                        setIsDetailOpen(true);
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">没有找到符合条件的账号</p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-gray-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>账号详情</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">账号编号</p>
                  <p className="text-white font-mono text-sm">{selectedAccount.id}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">区服</p>
                  <p className="text-white text-sm">{selectedAccount.region}/{selectedAccount.server}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-primary font-medium mb-3 text-sm">基本信息</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-gray-400 text-xs">段位</p><p className="text-white text-sm">{selectedAccount.rank}</p></div>
                  <div><p className="text-gray-400 text-xs">哈佛币</p><p className="text-white text-sm">{selectedAccount.harvardCoins}M</p></div>
                  <div><p className="text-gray-400 text-xs">安全箱</p><p className="text-white text-sm">{safeBoxToShortDisplay(selectedAccount.safeBox)}</p></div>
                  <div><p className="text-gray-400 text-xs">训练中心</p><p className="text-white text-sm">{selectedAccount.trainingLevel}</p></div>
                  <div><p className="text-gray-400 text-xs">靶场</p><p className="text-white text-sm">{selectedAccount.rangeLevel}</p></div>
                  <div><p className="text-gray-400 text-xs">AWM子弹</p><p className="text-white text-sm">{selectedAccount.awmAmmo}发</p></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-primary font-medium mb-3 text-sm">区服信息</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-gray-400 text-xs">地区</p><p className="text-white text-sm">{selectedAccount.region}</p></div>
                  <div><p className="text-gray-400 text-xs">服务器</p><p className="text-white text-sm">{selectedAccount.server}</p></div>
                  <div><p className="text-gray-400 text-xs">登录方式</p><p className="text-white text-sm">{loginTypeToDisplay(selectedAccount.loginType)}</p></div>
                </div>
              </div>

              {selectedAccount.knifeSkins.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-primary font-medium mb-2 text-sm">刀皮</h4>
                  <p className="text-white text-sm">{selectedAccount.knifeSkins.join('、')}</p>
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
                <h4 className="text-primary font-medium mb-2 text-sm">价格信息</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">租赁价格</p>
                    <p className="text-2xl font-bold text-primary">¥{selectedAccount.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">押金</p>
                    <p className="text-white text-sm">¥{selectedAccount.deposit}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 添加账号表单组件
function AddAccountForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    deposit: '',
    rank: '',
    harvardCoins: '',
    safeBox: '' as SafeBoxType | '',
    trainingLevel: '',
    rangeLevel: '',
    awmAmmo: '',
    region: '',
    server: '',
    loginType: '' as LoginTypeCode | '',
  });

  const [selectedKnives, setSelectedKnives] = useState<string[]>([]);
  const [selectedOperatorSkins, setSelectedOperatorSkins] = useState<Record<string, string[]>>({});
  const [expandedOperators, setExpandedOperators] = useState<Record<string, boolean>>({});

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

    const harvardCoins = parseFloat(formData.harvardCoins);

    // 构造提交数据（使用统一的 GameAccountRent）
    const submitData: GameAccountRent = {
      id: 'SJZ' + Date.now().toString().slice(-6),
      region: formData.region,
      server: formData.server,
      loginType: formData.loginType as LoginTypeCode,
      rank: (formData.rank as GameAccountRent['rank']) || '青铜',
      harvardCoins,
      totalAssets: harvardCoins,
      assetsDisplay: harvardCoinsToAssetsDisplay(harvardCoins),
      level: 0,
      safeBox: formData.safeBox as SafeBoxType,
      stamina: '7',
      awmAmmo: parseInt(formData.awmAmmo) || 0,
      trainingLevel: formData.trainingLevel || '1级',
      rangeLevel: formData.rangeLevel || '1级',
      knifeSkins: selectedKnives,
      operatorSkins: selectedOperatorSkins,
      price: parseFloat(formData.price) || 0,
      deposit: parseFloat(formData.deposit) || 0,
      note: '',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    // 保存到 localStorage
    try {
      const existingData = JSON.parse(localStorage.getItem('rentAccounts') || '[]');
      existingData.unshift(submitData);
      localStorage.setItem('rentAccounts', JSON.stringify(existingData));
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
            <Label className="text-sm text-gray-400">账号名称 <span className="text-red-500">*</span></Label>
            <Input
              placeholder="如：暗影部队"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                {filterOptions.ranks.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 价格信息 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">价格信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">租赁价格（元） <span className="text-red-500">*</span></Label>
            <Input
              type="number"
              placeholder="如：765"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">押金（元） <span className="text-red-500">*</span></Label>
            <Input
              type="number"
              placeholder="如：559"
              value={formData.deposit}
              onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
        </div>
      </div>

      {/* 账号资产 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">账号资产</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">哈弗币数量（M） <span className="text-red-500">*</span></Label>
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
            <Label className="text-sm text-gray-400">安全箱 <span className="text-red-500">*</span></Label>
            <Select value={formData.safeBox} onValueChange={(v) => setFormData({ ...formData, safeBox: v as SafeBoxType })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择安全箱" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {filterOptions.safes.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
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
            <Label className="text-sm text-gray-400">训练中心等级 <span className="text-red-500">*</span></Label>
            <Select value={formData.trainingLevel} onValueChange={(v) => setFormData({ ...formData, trainingLevel: v })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择等级" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {filterOptions.trainingLevels.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">靶场等级 <span className="text-red-500">*</span></Label>
            <Select value={formData.rangeLevel} onValueChange={(v) => setFormData({ ...formData, rangeLevel: v })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择等级" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {filterOptions.rangeLevels.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* AWM子弹 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">AWM子弹</h3>
        <div className="space-y-2">
          <Label className="text-sm text-gray-400">AWM子弹数量 <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="如：70"
              value={formData.awmAmmo}
              onChange={(e) => setFormData({ ...formData, awmAmmo: e.target.value })}
              className="bg-white/5 border-white/10 text-white pr-12"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">发</span>
          </div>
        </div>
      </div>

      {/* 刀皮选择 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">刀皮选择</h3>
        <div className="flex flex-wrap gap-2">
          {filterOptions.knives.map((knife) => (
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
                    <label key={skin} className="flex items-center gap-2 cursor-pointer group">
                      <Checkbox
                        checked={selectedOperatorSkins[operator]?.includes(skin) || false}
                        onCheckedChange={() => toggleOperatorSkin(operator, skin)}
                      />
                      <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                        {skin}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 区服信息 */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-primary font-medium mb-3">区服信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">地区 <span className="text-red-500">*</span></Label>
            <Input
              placeholder="如：广东省"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">服务器 <span className="text-red-500">*</span></Label>
            <Select value={formData.server} onValueChange={(v) => setFormData({ ...formData, server: v })} required>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="选择服务器" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="QQ">QQ</SelectItem>
                <SelectItem value="微信">微信</SelectItem>
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
              <SelectItem value="account">账密登录</SelectItem>
              <SelectItem value="qrcode">扫码登录</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
