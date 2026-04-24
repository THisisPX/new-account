import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Shield,
  Sword,
  Target,
  DollarSign,
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RentContactModal from '@/components/RentContactModal';
import type { GameAccountRent as Account } from '@/types/account';
import {
  safeBoxToShortDisplay,
} from '@/utils/account';
import { rentAccountApi } from '@/api';

gsap.registerPlugin(ScrollTrigger);

// 筛选选项数据
const filterOptions = {
  harvardCoins: ['全部', '0-50M', '50-100M', '100-200M', '200-300M', '300-500M', '500M以上'],
  ranks: ['全部', '青铜', '白银', '黄金', '铂金', '钻石', '黑鹰', '三角洲巅峰'],
  safes: ['全部', '1×2基础安全箱', '2×2进阶安全箱', '2×3高级保险箱', '3×3顶级安全箱'],
  knives: ['全部', '暗星', '信条', '赤霄', '怜悯', '龙牙', '影锋', '黑海', '北极星', '电锯惊魂'],
  operators: ['红狼', '威龙', '蜂医', '无名', '乌鲁鲁', '牧羊人', '露娜', '蛊', '骇爪'],
  trainingLevels: ['全部', '1级', '2级', '3级', '4级', '5级', '6级', '7级'],
  rangeLevels: ['全部', '1级', '2级', '3级', '4级', '5级', '6级', '7级'],
  awmAmmo: ['全部', '0-20发', '21-50发', '51-100发', '100发以上'],
};

// 干员皮肤数据
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

// 模拟账号数据 - 使用统一的 GameAccountRent 类型
const mockAccounts: Account[] = [
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
    sixSetHead: 2,
    sixSetArmor: 1,
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
    sixSetHead: 3,
    sixSetArmor: 2,
    trainingLevel: '7级',
    rangeLevel: '7级',
    knifeSkins: ['怜悯', '影锋'],
    operatorSkins: { '威龙': ['凌霄戍卫', '蛟龙行动'], '红狼': ['蚀金玫瑰'] },
    price: 1280,
    deposit: 800,
    note: '全皮肤，满级干员',
    status: 'active',
    createdAt: '2026-03-24',
    updatedAt: '2026-03-24',
  },
  {
    id: 'SJZ309104',
    region: '江苏省',
    server: 'QQ',
    loginType: 'account',
    rank: '铂金',
    harvardCoins: 3,
    totalAssets: 3,
    assetsDisplay: '3000万',
    level: 0,
    safeBox: '6grid',
    stamina: '7',
    awmAmmo: 45,
    sixSetHead: 1,
    sixSetArmor: 0,
    trainingLevel: '5级',
    rangeLevel: '4级',
    knifeSkins: ['北极星'],
    operatorSkins: { '蜂医': ['送葬人无题密令'], '威龙': ['铁面判官'] },
    price: 420,
    deposit: 300,
    note: '新手推荐，性价比高',
    status: 'active',
    createdAt: '2026-03-23',
    updatedAt: '2026-03-23',
  },
  {
    id: 'SJZ310256',
    region: '北京市',
    server: '微信',
    loginType: 'qrcode',
    rank: '三角洲巅峰',
    harvardCoins: 12,
    totalAssets: 12,
    assetsDisplay: '1.2亿',
    level: 0,
    safeBox: '9grid',
    stamina: '7',
    awmAmmo: 200,
    sixSetHead: 4,
    sixSetArmor: 3,
    trainingLevel: '7级',
    rangeLevel: '7级',
    knifeSkins: ['电锯惊魂', '暗星', '信条'],
    operatorSkins: {
      '红狼': ['蚀金玫瑰', '黑鹰坠落'],
      '威龙': ['凌霄戍卫', '蛟龙行动', '铁面判官', '壮志凌云', '吴彦祖'],
      '蜂医': ['送葬人无题密令', '黑鹰坠落', '危险物质'],
      '无名': ['夜鹰'],
      '露娜': ['黑-天际线'],
      '蛊': ['能天使-午夜邮差'],
      '骇爪': ['维什戴尔', '水墨云图'],
    },
    price: 2580,
    deposit: 1500,
    note: '顶级账号，全收集',
    status: 'active',
    createdAt: '2026-03-22',
    updatedAt: '2026-03-22',
  },
  {
    id: 'SJZ311089',
    region: '上海市',
    server: 'QQ',
    loginType: 'account',
    rank: '黄金',
    harvardCoins: 1.5,
    totalAssets: 1.5,
    assetsDisplay: '1500万',
    level: 0,
    safeBox: 'other',
    stamina: '7',
    awmAmmo: 30,
    sixSetHead: 0,
    sixSetArmor: 0,
    trainingLevel: '4级',
    rangeLevel: '3级',
    knifeSkins: ['赤霄'],
    operatorSkins: { '红狼': ['黑鹰坠落'], '无名': ['夜鹰'] },
    price: 280,
    deposit: 200,
    note: '入门级账号',
    status: 'active',
    createdAt: '2026-03-21',
    updatedAt: '2026-03-21',
  },
  {
    id: 'SJZ312467',
    region: '四川省',
    server: '微信',
    loginType: 'qrcode',
    rank: '钻石',
    harvardCoins: 6,
    totalAssets: 6,
    assetsDisplay: '6000万',
    level: 0,
    safeBox: '9grid',
    stamina: '7',
    awmAmmo: 85,
    sixSetHead: 2,
    sixSetArmor: 1,
    trainingLevel: '6级',
    rangeLevel: '6级',
    knifeSkins: ['龙牙', '影锋'],
    operatorSkins: { '牧羊人': ['街头之王', '黑鹰坠落'], '露娜': ['黑-天际线'], '蛊': ['能天使-午夜邮差'] },
    price: 890,
    deposit: 600,
    note: 'PVP专精账号',
    status: 'active',
    createdAt: '2026-03-20',
    updatedAt: '2026-03-20',
  },
];

interface FilterState {
  harvardCoin: string;
  rank: string;
  safe: string;
  knife: string;
  operator: Record<string, string>;
  operatorSkins: Record<string, string[]>;
  training: string;
  range: string;
  awmAmmo: string;
}

export default function RentPage() {
  const [filters, setFilters] = useState<FilterState>({
    harvardCoin: '全部',
    rank: '全部',
    safe: '全部',
    knife: '全部',
    operator: Object.fromEntries(filterOptions.operators.map(op => [op, '全部'])),
    operatorSkins: Object.fromEntries(filterOptions.operators.map(op => [op, []])),
    training: '全部',
    range: '全部',
    awmAmmo: '全部',
  });
  
  // 干员皮肤展开状态
  const [expandedOperators, setExpandedOperators] = useState<Record<string, boolean>>(
    Object.fromEntries(filterOptions.operators.map(op => [op, false]))
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [allAccounts, setAllAccounts] = useState<Account[]>(mockAccounts);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>(mockAccounts);

  // 从 API 加载账号数据（带自动刷新）
  useEffect(() => {
    async function loadAccounts() {
      try {
        const accounts = await rentAccountApi.getAll();
        setAllAccounts(accounts);
      } catch (error) {
        console.error('加载账号数据失败:', error);
        setAllAccounts([]);
      }
    }
    loadAccounts();
    // 每 5 秒自动刷新一次
    const interval = setInterval(loadAccounts, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  
  // 处理租赁按钮点击
  const handleRentClick = (account: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  // 处理筛选变化
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      harvardCoin: '全部',
      rank: '全部',
      safe: '全部',
      knife: '全部',
      operator: Object.fromEntries(filterOptions.operators.map(op => [op, '全部'])),
      operatorSkins: Object.fromEntries(filterOptions.operators.map(op => [op, []])),
      training: '全部',
      range: '全部',
      awmAmmo: '全部',
    });
    setSearchQuery('');
  };
  
  // 处理干员皮肤选择
  const handleSkinToggle = (operator: string, skin: string) => {
    setFilters(prev => {
      const currentSkins = prev.operatorSkins[operator] || [];
      const newSkins = currentSkins.includes(skin)
        ? currentSkins.filter(s => s !== skin)
        : [...currentSkins, skin];
      return {
        ...prev,
        operatorSkins: { ...prev.operatorSkins, [operator]: newSkins }
      };
    });
  };

  // 搜索筛选
  useEffect(() => {
    let result = allAccounts;
    
    if (searchQuery) {
      result = result.filter(account =>
        account.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.rank.includes(searchQuery) ||
        account.assetsDisplay.includes(searchQuery) ||
        account.harvardCoins.toString().includes(searchQuery)
      );
    }
    
    if (filters.rank !== '全部') {
      result = result.filter(account => account.rank === filters.rank);
    }
    
    if (filters.safe !== '全部') {
      result = result.filter(account => safeBoxToShortDisplay(account.safeBox) === filters.safe);
    }

    if (filters.knife !== '全部') {
      result = result.filter(account =>
        account.knifeSkins.includes(filters.knife)
      );
    }

    // 辅助函数：获取显示用的刀皮列表（优先显示匹配的刀皮）
    const getDisplayKnifeSkins = (account: Account, filterKnife: string): string[] => {
      if (filterKnife && filterKnife !== '全部') {
        const matched = account.knifeSkins.find(k => k === filterKnife);
        if (matched) {
          return [matched, ...account.knifeSkins.filter(k => k !== matched)];
        }
      }
      return account.knifeSkins;
    };

    // 训练中心筛选
    if (filters.training !== '全部') {
      result = result.filter(account => account.trainingLevel === filters.training);
    }

    // 靶场筛选
    if (filters.range !== '全部') {
      result = result.filter(account => account.rangeLevel === filters.range);
    }

    // 哈佛币筛选
    if (filters.harvardCoin !== '全部') {
      switch (filters.harvardCoin) {
        case '0-50M':
          result = result.filter(account => account.harvardCoins >= 0 && account.harvardCoins <= 50);
          break;
        case '50-100M':
          result = result.filter(account => account.harvardCoins > 50 && account.harvardCoins <= 100);
          break;
        case '100-200M':
          result = result.filter(account => account.harvardCoins > 100 && account.harvardCoins <= 200);
          break;
        case '200-300M':
          result = result.filter(account => account.harvardCoins > 200 && account.harvardCoins <= 300);
          break;
        case '300-500M':
          result = result.filter(account => account.harvardCoins > 300 && account.harvardCoins <= 500);
          break;
        case '500M以上':
          result = result.filter(account => account.harvardCoins > 500);
          break;
      }
    }

    // AWM子弹数量筛选
    if (filters.awmAmmo !== '全部') {
      switch (filters.awmAmmo) {
        case '0-20发':
          result = result.filter(account => {
            const val = account.awmAmmo || 0;
            return val >= 0 && val <= 20;
          });
          break;
        case '21-50发':
          result = result.filter(account => {
            const val = account.awmAmmo || 0;
            return val >= 21 && val <= 50;
          });
          break;
        case '51-100发':
          result = result.filter(account => {
            const val = account.awmAmmo || 0;
            return val >= 51 && val <= 100;
          });
          break;
        case '100发以上':
          result = result.filter(account => {
            const val = account.awmAmmo || 0;
            return val > 100;
          });
          break;
      }
    }
    
    // 干员皮肤筛选
    const hasSelectedSkins = Object.entries(filters.operatorSkins).some(([_, skins]) => skins.length > 0);
    if (hasSelectedSkins) {
      result = result.filter(account => {
        // 账号必须包含所有选中的干员皮肤
        return Object.entries(filters.operatorSkins).every(([operator, selectedSkins]) => {
          if (selectedSkins.length === 0) return true; // 该干员没有选中皮肤，跳过
          // 检查账号是否有该干员的选中皮肤（至少有一个匹配即可）
          const accountSkins = account.operatorSkins[operator] || [];
          return selectedSkins.some(skin => accountSkins.includes(skin));
        });
      });
    }
    
    setFilteredAccounts(result);
  }, [searchQuery, filters, allAccounts]);

  // 动画效果
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.filter-section',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top 80%',
          }
        }
      );
      
      gsap.fromTo(
        '.account-card',
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 85%',
          }
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // 渲染筛选标签
  const renderFilterTags = (options: string[], selected: string, onSelect: (val: string) => void) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
            selected === option
              ? 'bg-primary text-black'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  // 移动端筛选弹窗
  const MobileFilterModal = () => (
    <div className={`fixed inset-0 z-50 ${showMobileFilters ? 'visible' : 'invisible'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
      <div className={`absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl border-t border-white/10 max-h-[80vh] overflow-auto transition-transform duration-300 ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            筛选条件
          </h3>
          <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {/* 段位 */}
          <div>
            <span className="text-gray-300 text-sm font-medium mb-2 block">段位</span>
            {renderFilterTags(filterOptions.ranks, filters.rank, (val) => handleFilterChange('rank', val))}
          </div>
          {/* 安全箱 */}
          <div>
            <span className="text-gray-300 text-sm font-medium mb-2 block">安全箱</span>
            {renderFilterTags(filterOptions.safes, filters.safe, (val) => handleFilterChange('safe', val))}
          </div>
          {/* 刀皮 */}
          <div>
            <span className="text-gray-300 text-sm font-medium mb-2 block">刀皮</span>
            {renderFilterTags(filterOptions.knives, filters.knife, (val) => handleFilterChange('knife', val))}
          </div>
          {/* 哈佛币 */}
          <div>
            <span className="text-gray-300 text-sm font-medium mb-2 block">哈佛币范围</span>
            {renderFilterTags(filterOptions.harvardCoins, filters.harvardCoin, (val) => handleFilterChange('harvardCoin', val))}
          </div>
          {/* 训练中心 */}
          <div>
            <span className="text-gray-300 text-sm font-medium mb-2 block">训练中心</span>
            {renderFilterTags(filterOptions.trainingLevels, filters.training, (val) => handleFilterChange('training', val))}
          </div>
          {/* 靶场 */}
          <div>
            <span className="text-gray-300 text-sm font-medium mb-2 block">靶场</span>
            {renderFilterTags(filterOptions.rangeLevels, filters.range, (val) => handleFilterChange('range', val))}
          </div>
          {/* AWM子弹数量 */}
          <div>
            <span className="text-gray-300 text-sm font-medium mb-2 block">AWM子弹数量</span>
            {renderFilterTags(filterOptions.awmAmmo, filters.awmAmmo, (val) => handleFilterChange('awmAmmo', val))}
          </div>
          {/* 干员皮肤选择 */}
          <div>
            <span className="text-gray-300 text-sm font-medium mb-2 block">干员皮肤选择</span>
            <div className="space-y-2 max-h-60 overflow-auto">
              {filterOptions.operators.map((operator) => (
                <div key={operator} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setExpandedOperators(prev => ({ ...prev, [operator]: !prev[operator] }))}
                    className="w-full flex items-center justify-between px-3 py-2"
                  >
                    <span className="text-white text-sm">{operator}</span>
                    {expandedOperators[operator] ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedOperators[operator] && (
                    <div className="px-3 pb-2 space-y-1">
                      {operatorSkins[operator]?.map((skin) => (
                        <label
                          key={skin}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.operatorSkins[operator]?.includes(skin) || false}
                            onChange={() => handleSkinToggle(operator, skin)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary"
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
          <div className="pt-4 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              onClick={resetFilters}
            >
              重置
            </Button>
            <Button 
              className="flex-1 bg-primary text-black hover:bg-primary-dark"
              onClick={() => setShowMobileFilters(false)}
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // 账号卡片（移动端）
  const AccountCard = ({ account }: { account: Account }) => (
    <div className="account-card bg-gray-900/50 rounded-xl border border-white/10 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-primary font-mono text-sm">{account.id}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              account.rank === '三角洲巅峰' ? 'bg-yellow-500/20 text-yellow-400' :
              account.rank === '黑鹰' ? 'bg-purple-500/20 text-purple-400' :
              account.rank === '钻石' ? 'bg-blue-500/20 text-blue-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {account.rank}
            </span>
            <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-300">{account.server}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-primary font-bold text-lg">¥{account.price}</div>
          <div className="text-xs text-gray-500">押金¥{account.deposit}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-400">
          <span className="text-gray-500">资产:</span> {account.assetsDisplay}
        </div>
        <div className="text-gray-400">
          <span className="text-gray-500">安全箱:</span> {safeBoxToShortDisplay(account.safeBox).replace('安全箱', '')}
        </div>
        <div className="text-gray-400">
          <span className="text-gray-500">训练中心:</span> {account.trainingLevel}
        </div>
        <div className="text-gray-400">
          <span className="text-gray-500">靶场:</span> {account.rangeLevel}
        </div>
        <div className="text-gray-400">
          <span className="text-gray-500">AWM子弹:</span> {account.awmAmmo}发
        </div>
        <div className="text-gray-400">
          <span className="text-gray-500">六头:</span> {(account as any).sixSetHead || 0}个
        </div>
        <div className="text-gray-400">
          <span className="text-gray-500">六甲:</span> {(account as any).sixSetArmor || 0}个
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {getDisplayKnifeSkins(account, filters.knife).slice(0, 1).map(knife => (
          <span key={knife} className="px-2 py-0.5 bg-primary/10 rounded text-xs text-primary">{knife}</span>
        ))}
      </div>
      
      {Object.keys(account.operatorSkins).length > 0 && (
        <div className="space-y-1">
          <span className="text-gray-500 text-xs">干员皮肤:</span>
          <div className="flex flex-wrap gap-1">
            {Object.entries(account.operatorSkins).slice(0, 2).map(([operator, skins]) => (
              <span key={operator} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">
                {operator}:{skins[0]}
              </span>
            ))}
            {Object.keys(account.operatorSkins).length > 2 && (
              <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-500">
                +{Object.keys(account.operatorSkins).length - 2}
              </span>
            )}
          </div>
        </div>
      )}
      
      <Button 
        size="sm" 
        className="w-full bg-primary text-black hover:bg-primary-dark font-semibold"
        onClick={() => handleRentClick(account)}
      >
        立即租赁
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );

  return (
    <div ref={pageRef} className="min-h-screen bg-black pt-16 sm:pt-20">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                账号<span className="text-primary">租赁</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">选择您心仪的三角洲行动账号</p>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold text-primary">{filteredAccounts.length}</div>
              <div className="text-xs sm:text-sm text-gray-400">可选账号</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* 搜索框 */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="搜索账号编号、段位、哈弗币数量等"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 py-4 sm:py-6 bg-gray-900/50 border-white/10 text-white text-sm sm:text-base placeholder:text-gray-500 focus:border-primary"
            />
          </div>
          {/* 移动端筛选按钮 */}
          <button 
            className="sm:hidden px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg text-gray-400"
            onClick={() => setShowMobileFilters(true)}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <Button className="hidden sm:flex bg-primary text-black hover:bg-primary-dark px-6 sm:px-8 py-4 sm:py-6 font-semibold">
            搜索
          </Button>
        </div>

        {/* 桌面端筛选区域 */}
        <div className="hidden sm:block filter-section bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden mb-6 sm:mb-8">
          <div 
            className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/5 cursor-pointer"
            onClick={() => setExpandedFilters(!expandedFilters)}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
              <span className="text-white font-semibold text-sm sm:text-base">筛选条件</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetFilters();
                }}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 hover:text-primary transition-colors"
              >
                <RotateCcw className="w-3 sm:w-4 h-3 sm:h-4" />
                重置筛选
              </button>
              {expandedFilters ? (
                <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              )}
            </div>
          </div>

          {expandedFilters && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="flex items-center gap-2 min-w-[80px] sm:min-w-[100px]">
                  <DollarSign className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  <span className="text-gray-300 text-xs sm:text-sm font-medium">哈佛币范围</span>
                </div>
                {renderFilterTags(filterOptions.harvardCoins, filters.harvardCoin, (val) => handleFilterChange('harvardCoin', val))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="flex items-center gap-2 min-w-[80px] sm:min-w-[100px]">
                  <Target className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  <span className="text-gray-300 text-xs sm:text-sm font-medium">段位</span>
                </div>
                {renderFilterTags(filterOptions.ranks, filters.rank, (val) => handleFilterChange('rank', val))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="flex items-center gap-2 min-w-[80px] sm:min-w-[100px]">
                  <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  <span className="text-gray-300 text-xs sm:text-sm font-medium">安全箱</span>
                </div>
                {renderFilterTags(filterOptions.safes, filters.safe, (val) => handleFilterChange('safe', val))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="flex items-center gap-2 min-w-[80px] sm:min-w-[100px]">
                  <Sword className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  <span className="text-gray-300 text-xs sm:text-sm font-medium">刀皮</span>
                </div>
                {renderFilterTags(filterOptions.knives, filters.knife, (val) => handleFilterChange('knife', val))}
              </div>
              
              {/* 训练中心 */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="flex items-center gap-2 min-w-[80px] sm:min-w-[100px]">
                  <Target className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  <span className="text-gray-300 text-xs sm:text-sm font-medium">训练中心</span>
                </div>
                {renderFilterTags(filterOptions.trainingLevels, filters.training, (val) => handleFilterChange('training', val))}
              </div>
              
              {/* 靶场 */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="flex items-center gap-2 min-w-[80px] sm:min-w-[100px]">
                  <Target className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  <span className="text-gray-300 text-xs sm:text-sm font-medium">靶场</span>
                </div>
                {renderFilterTags(filterOptions.rangeLevels, filters.range, (val) => handleFilterChange('range', val))}
              </div>
              
              {/* AWM子弹数量 */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="flex items-center gap-2 min-w-[80px] sm:min-w-[100px]">
                  <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  <span className="text-gray-300 text-xs sm:text-sm font-medium">AWM子弹数量</span>
                </div>
                {renderFilterTags(filterOptions.awmAmmo, filters.awmAmmo, (val) => handleFilterChange('awmAmmo', val))}
              </div>
              
              {/* 干员皮肤选择 */}
              <div className="border-t border-white/10 pt-4 sm:pt-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                  <span className="text-gray-300 text-xs sm:text-sm font-medium">干员皮肤选择</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filterOptions.operators.map((operator) => (
                    <div key={operator} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                      <button
                        onClick={() => setExpandedOperators(prev => ({ ...prev, [operator]: !prev[operator] }))}
                        className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 hover:bg-white/5 transition-colors"
                      >
                        <span className="text-white text-xs sm:text-sm font-medium">{operator}</span>
                        {expandedOperators[operator] ? (
                          <ChevronUp className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                        )}
                      </button>
                      {expandedOperators[operator] && (
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-1 sm:space-y-2">
                          {operatorSkins[operator]?.map((skin) => (
                            <label
                              key={skin}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={filters.operatorSkins[operator]?.includes(skin) || false}
                                onChange={() => handleSkinToggle(operator, skin)}
                                className="w-3 sm:w-4 h-3 sm:h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
                              />
                              <span className="text-gray-400 text-xs sm:text-sm group-hover:text-white transition-colors">
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
            </div>
          )}
        </div>

        {/* 移动端账号卡片列表 */}
        <div ref={tableRef} className="sm:hidden space-y-3">
          {filteredAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>

        {/* 桌面端表格 */}
        <div ref={tableRef} className="hidden sm:block bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">账号</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">段位</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">资产</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">安全箱</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">训练/靶场</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">AWM</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">六头/六甲</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">刀皮</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">干员皮肤</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">价格</th>
                  <th className="px-3 lg:px-4 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 lg:px-4 py-3 lg:py-4">
                      <span className="text-primary font-mono text-xs lg:text-sm">{account.id}</span>
                      <div className="text-gray-500 text-xs">{account.server === 'QQ' ? 'QQ' : '微信'}</div>
                    </td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        account.rank === '三角洲巅峰' ? 'bg-yellow-500/20 text-yellow-400' :
                        account.rank === '黑鹰' ? 'bg-purple-500/20 text-purple-400' :
                        account.rank === '钻石' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {account.rank}
                      </span>
                    </td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4 text-white text-xs lg:text-sm">{account.assetsDisplay}</td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4 text-gray-400 text-xs lg:text-sm">{safeBoxToShortDisplay(account.safeBox)}</td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4">
                      <p className="text-gray-400 text-xs lg:text-sm">训练{account.trainingLevel}</p>
                      <p className="text-gray-500 text-xs">靶场{account.rangeLevel}</p>
                    </td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4 text-gray-400 text-xs lg:text-sm">{account.awmAmmo}发</td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4 text-gray-400 text-xs lg:text-sm">{(account as any).sixSetHead || 0}/{(account as any).sixSetArmor || 0}</td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4">
                      <span className="px-2 py-0.5 bg-primary/10 rounded text-xs text-primary">{getDisplayKnifeSkins(account, filters.knife)[0]}</span>
                    </td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4">
                      <div className="space-y-1 max-w-[200px]">
                        {Object.keys(account.operatorSkins).length > 0 ? (
                          Object.entries(account.operatorSkins).map(([operator, skins]) => (
                            <div key={operator} className="text-xs">
                              <span className="text-primary">{operator}</span>
                              <span className="text-gray-500">: </span>
                              <span className="text-gray-400">{skins.join('、')}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4">
                      <div className="text-primary font-bold text-sm lg:text-lg">¥{account.price}</div>
                      <div className="text-xs text-gray-500">押金¥{account.deposit}</div>
                    </td>
                    <td className="px-3 lg:px-4 py-3 lg:py-4">
                      <Button 
                        size="sm" 
                        className="bg-primary text-black hover:bg-primary-dark font-semibold text-xs"
                        onClick={() => handleRentClick(account)}
                      >
                        租赁
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 空状态 */}
        {filteredAccounts.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 sm:w-10 h-8 sm:h-10 text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">未找到符合条件的账号</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-4">请尝试调整筛选条件或搜索关键词</p>
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重置筛选
            </Button>
          </div>
        )}
      </div>
      
      {/* 移动端筛选弹窗 */}
      <MobileFilterModal />
      
      {/* 联系支付弹窗 */}
      <RentContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accountInfo={selectedAccount ? {
          id: selectedAccount.id,
          name: selectedAccount.id,
          price: selectedAccount.price,
          deposit: selectedAccount.deposit ?? 0,
        } : undefined}
      />
    </div>
  );
}
