import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  Upload,
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
  Sword,
  HelpCircle,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactPaymentModal from '@/components/ContactPaymentModal';
import type { LoginTypeCode, SafeBoxType, StaminaLevel, GameAccountSell } from '@/types/account';
import {
  calculateRecyclePrice,
  calculateRentDays,
} from '@/utils/account';

gsap.registerPlugin(ScrollTrigger);

// 选项数据
const regions = ['QQ区', '微信区'];
const loginTypes = [
  { value: 'account', label: '账密登录', desc: '出售速度约为扫码登录的5倍，推荐优先选择' },
  { value: 'qrcode', label: '扫码登录', desc: '需要号主在线配合扫码' },
];
const ranks = ['青铜', '白银', '黄金', '铂金', '钻石', '黑鹰', '三角洲巅峰'];
const safeBoxes = [
  { value: '9grid', label: '9格安全箱 (3×3)', desc: '最高级安全箱' },
  { value: '6grid', label: '6格安全箱 (2×3)', desc: '中级安全箱' },
  { value: 'other', label: '其它安全箱', desc: '低级或无安全箱' },
];
const staminaLevels = [
  { value: '7', label: '7体', desc: '满级体力' },
  { value: '5-6', label: '5-6体', desc: '中高体力' },
  { value: '3-4', label: '3-4体', desc: '中低体力' },
];
const trainingLevels = ['1级', '2级', '3级', '4级', '5级', '6级', '7级'];
const rangeLevels = ['1级', '2级', '3级', '4级', '5级', '6级', '7级'];
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

export default function SellPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  
  // 表单状态
  const [formData, setFormData] = useState<{
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
  
  // 皮肤选择状态
  const [selectedKnives, setSelectedKnives] = useState<string[]>([]);
  const [selectedOperatorSkins, setSelectedOperatorSkins] = useState<Record<string, string[]>>({});
  const [expandedOperators, setExpandedOperators] = useState<string[]>(['红狼', '威龙', '蜂医']);
  
  // 截图上传状态
  const [uploadedImages, setUploadedImages] = useState<{
    mainInterface: string | null;
    warehouse: string | null;
    other: string | null;
  }>({
    mainInterface: null,
    warehouse: null,
    other: null,
  });
  
  // 计算结果
  const [rentDays, setRentDays] = useState<number | null>(null);
  const [dailyConsumption, setDailyConsumption] = useState<number | null>(null);
  const [baseRatio, setBaseRatio] = useState<number | null>(null);
  const [finalRatio, setFinalRatio] = useState<number | null>(null);
  const [recyclePrice, setRecyclePrice] = useState<number | null>(null);
  const [priceDetails, setPriceDetails] = useState<string[]>([]);
  
  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 计算租期
  useEffect(() => {
    const harvardCoins = parseFloat(formData.harvardCoins);
    if (harvardCoins && harvardCoins >= 50) {
      const { days, dailyConsumption: consumption } = calculateRentDays(harvardCoins);
      setDailyConsumption(consumption);
      setRentDays(days);
    } else {
      setDailyConsumption(null);
      setRentDays(null);
    }
  }, [formData.harvardCoins]);

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
      setBaseRatio(result.baseRatio);
      setFinalRatio(result.finalRatio);
      setRecyclePrice(result.recyclePrice);
      setPriceDetails(result.details);
    } else {
      setBaseRatio(null);
      setFinalRatio(null);
      setRecyclePrice(null);
      setPriceDetails([]);
    }
  }, [formData.harvardCoins, formData.safeBox, formData.stamina, selectedKnives, selectedOperatorSkins]);

  // 处理表单变化
  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // 处理图片上传
  const handleImageUpload = (type: 'mainInterface' | 'warehouse' | 'other', file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => ({
          ...prev,
          [type]: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 删除上传的图片
  const handleRemoveImage = (type: 'mainInterface' | 'warehouse' | 'other') => {
    setUploadedImages(prev => ({
      ...prev,
      [type]: null
    }));
  };
  
  // 提交表单
  const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.region || !formData.loginType || !formData.harvardCoins || !formData.safeBox || !formData.stamina) {
      alert('请填写完整的账号信息');
      return;
    }
    
    // 验证必填截图
    if (!uploadedImages.mainInterface || !uploadedImages.warehouse) {
      alert('请上传账号主界面和主仓库截图');
      return;
    }
    
    setIsSubmitting(true);

    // 构造提交数据 - 使用统一的数据结构
    const submitData: GameAccountSell = {
      id: 'SELL' + Date.now().toString().slice(-6),
      userId: 'USER' + Math.floor(Math.random() * 10000),
      userName: '用户' + Math.floor(Math.random() * 10000),
      harvardCoins: parseFloat(formData.harvardCoins) || 0,
      totalAssets: parseFloat(formData.totalAssets) || parseFloat(formData.harvardCoins) || 0,
      rank: (formData.rank as GameAccountSell['rank']) || '未知',
      safeBox: formData.safeBox as SafeBoxType,
      stamina: formData.stamina as StaminaLevel,
      trainingLevel: formData.trainingLevel || '1级',
      rangeLevel: formData.rangeLevel || '1级',
      awmAmmo: parseInt(formData.awmAmmo) || 0,
      level: parseInt(formData.level) || 0,
      price: recyclePrice || 0,
      status: 'pending',
      submittedAt: new Date().toLocaleString('zh-CN'),
      region: formData.region,
      server: formData.region === 'QQ区' ? 'QQ' : '微信',
      loginType: formData.loginType as LoginTypeCode,
      knifeSkins: selectedKnives,
      operatorSkins: selectedOperatorSkins,
      note: formData.note,
      superGuarantee: formData.superGuarantee,
      banRecord: formData.banRecord || '无封禁记录',
      isOwnFace: formData.isOwnFace === '是本人',
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
    };
    
    // 保存到 localStorage（模拟后台存储）
    try {
      const existingData = JSON.parse(localStorage.getItem('sellAccounts') || '[]');
      existingData.unshift(submitData);
      localStorage.setItem('sellAccounts', JSON.stringify(existingData));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(true);
        setSubmitSuccess(false);
      }, 500);
    } catch (error) {
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理刀皮选择
  const toggleKnife = (knife: string) => {
    setSelectedKnives(prev => 
      prev.includes(knife) 
        ? prev.filter(k => k !== knife)
        : [...prev, knife]
    );
  };

  // 处理干员皮肤选择
  const toggleOperatorSkin = (operator: string, skin: string) => {
    setSelectedOperatorSkins(prev => {
      const current = prev[operator] || [];
      const updated = current.includes(skin)
        ? current.filter(s => s !== skin)
        : [...current, skin];
      return { ...prev, [operator]: updated };
    });
  };

  // 切换干员展开状态
  const toggleOperatorExpand = (operator: string) => {
    setExpandedOperators(prev =>
      prev.includes(operator)
        ? prev.filter(o => o !== operator)
        : [...prev, operator]
    );
  };

  // 动画效果
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.form-section',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top 80%',
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-black pt-16 sm:pt-20 pb-12 sm:pb-16">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            我要<span className="text-primary">出号</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">填写账号信息，快速计算回收价格</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* 提示信息 */}
        <div className="form-section mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium mb-1">纯币号（推荐）</p>
              <p className="text-gray-400 text-sm">
                只出纯币，清理仓库所有非保留物品（6套、红蛋等可保留，打手使用，额外沟通价格），售卖按照清掉全部纯币结算
              </p>
            </div>
          </div>
        </div>

        {/* 基本信息 */}
        <div className="form-section bg-gray-900/50 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <Info className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            基本信息
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* 区服 */}
            <div>
              <Label className="text-gray-300 mb-2 block">区服 <span className="text-red-500">*</span></Label>
              <Select value={formData.region} onValueChange={(v) => handleChange('region', v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* 登录方式 */}
            <div>
              <Label className="text-gray-300 mb-2 block">登录方式 <span className="text-red-500">*</span></Label>
              <Select value={formData.loginType} onValueChange={(v) => handleChange('loginType', v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {loginTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      <div>
                        <div>{t.label}</div>
                        <div className="text-xs text-gray-500">{t.desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.loginType === 'account' && (
                <p className="text-xs text-primary mt-2">
                  账密登录出售速度约为扫码登录的5倍，推荐优先选择
                </p>
              )}
            </div>

            {/* 仓库总资产 */}
            <div>
              <Label className="text-gray-300 mb-2 block">仓库总资产 <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="如：50"
                  value={formData.totalAssets}
                  onChange={(e) => handleChange('totalAssets', e.target.value)}
                  className="bg-white/5 border-white/10 text-white pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">M</span>
              </div>
            </div>

            {/* 哈佛币数量 */}
            <div>
              <Label className="text-gray-300 mb-2 block">哈佛币数量 <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="如：237.1"
                  value={formData.harvardCoins}
                  onChange={(e) => handleChange('harvardCoins', e.target.value)}
                  className="bg-white/5 border-white/10 text-white pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">M</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">哈佛币小于50M无法寄售租赁</p>
            </div>

            {/* 等级 */}
            <div>
              <Label className="text-gray-300 mb-2 block">等级 <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                placeholder="如：60"
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-gray-500 mt-2">低于30级无法租赁</p>
            </div>

            {/* 段位 */}
            <div>
              <Label className="text-gray-300 mb-2 block">段位 <span className="text-red-500">*</span></Label>
              <Select value={formData.rank} onValueChange={(v) => handleChange('rank', v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {ranks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* 安全箱等级 */}
            <div>
              <Label className="text-gray-300 mb-2 block">安全箱等级 <span className="text-red-500">*</span></Label>
              <Select value={formData.safeBox} onValueChange={(v) => handleChange('safeBox', v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {safeBoxes.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      <div>
                        <div>{s.label}</div>
                        <div className="text-xs text-gray-500">{s.desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                如实按照赛季安全箱填写，否则影响结算价格，建议至少有6格保险
              </p>
            </div>

            {/* 体力等级 */}
            <div>
              <Label className="text-gray-300 mb-2 block">体力等级 <span className="text-red-500">*</span></Label>
              <Select value={formData.stamina} onValueChange={(v) => handleChange('stamina', v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {staminaLevels.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      <div>
                        <div>{s.label}</div>
                        <div className="text-xs text-gray-500">{s.desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 训练中心等级 */}
            <div>
              <Label className="text-gray-300 mb-2 block">训练中心等级 <span className="text-xs text-red-500">(3级起收)</span></Label>
              <Select value={formData.trainingLevel} onValueChange={(v) => handleChange('trainingLevel', v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {trainingLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* 靶场等级 */}
            <div>
              <Label className="text-gray-300 mb-2 block">靶场等级 <span className="text-xs text-red-500">(3级起收)</span></Label>
              <Select value={formData.rangeLevel} onValueChange={(v) => handleChange('rangeLevel', v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {rangeLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* AWM子弹数量 */}
            <div>
              <Label className="text-gray-300 mb-2 block">AWM子弹数量</Label>
              <Input
                type="number"
                placeholder="如：70"
                value={formData.awmAmmo}
                onChange={(e) => handleChange('awmAmmo', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-gray-500 mt-2">
                参考价：AWM子弹按照 0.8-1r 一发计算
              </p>
            </div>

            {/* 封禁记录 */}
            <div>
              <Label className="text-gray-300 mb-2 block">封禁记录 <span className="text-red-500">*</span></Label>
              <Select value={formData.banRecord} onValueChange={(v) => handleChange('banRecord', v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {banRecords.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* 人脸是否自己的 */}
            <div>
              <Label className="text-gray-300 mb-2 block">人脸是否自己的 <span className="text-red-500">*</span></Label>
              <Select value={formData.isOwnFace} onValueChange={(v) => handleChange('isOwnFace', v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {faceOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 超级质保 */}
        <div className="form-section bg-gray-900/50 rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Checkbox
              id="superGuarantee"
              checked={formData.superGuarantee}
              onCheckedChange={(checked) => handleChange('superGuarantee', checked as boolean)}
            />
            <Label htmlFor="superGuarantee" className="text-white cursor-pointer">
              开启超级质保 <span className="text-primary">(将收取6%服务费)</span>
            </Label>
          </div>
          {formData.superGuarantee && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">
                因开启超级赔付，平台将额外扣除6%的结算金额作为服务费，如果出现封号10年的情况，将赔付160%的订单金额给到号主
              </p>
            </div>
          )}
        </div>

        {/* 皮肤筛选 */}
        <div className="form-section bg-gray-900/50 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <Sword className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            皮肤筛选
          </h2>

          {/* 刀皮选择 */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-primary font-medium mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-1 h-3 sm:h-4 bg-primary rounded-full" />
              刀皮选择
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {knifeSkins.map(knife => (
                <button
                  key={knife}
                  onClick={() => toggleKnife(knife)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-all duration-300 text-xs sm:text-sm ${
                    selectedKnives.includes(knife)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-3.5 sm:w-4 h-3.5 sm:h-4 rounded border flex items-center justify-center ${
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
          <div>
            <h3 className="text-primary font-medium mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-1 h-3 sm:h-4 bg-primary rounded-full" />
              干员皮肤选择
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(operatorSkins).map(([operator, skins]) => (
                <div key={operator} className="bg-white/5 rounded-lg sm:rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleOperatorExpand(operator)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium text-sm sm:text-base">{operator}</span>
                    {expandedOperators.includes(operator) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedOperators.includes(operator) && (
                    <div className="p-3 sm:p-4 pt-0 space-y-1.5 sm:space-y-2">
                      {skins.map(skin => (
                        <button
                          key={skin}
                          onClick={() => toggleOperatorSkin(operator, skin)}
                          className={`flex items-center gap-2 w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm ${
                            (selectedOperatorSkins[operator] || []).includes(skin)
                              ? 'bg-primary/20 text-primary'
                              : 'text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-3.5 sm:w-4 h-3.5 sm:h-4 rounded border flex items-center justify-center ${
                            (selectedOperatorSkins[operator] || []).includes(skin) ? 'bg-primary border-primary' : 'border-gray-500'
                          }`}>
                            {(selectedOperatorSkins[operator] || []).includes(skin) && <span className="text-black text-xs">✓</span>}
                          </div>
                          {skin}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 价格计算 */}
        <div className="form-section bg-gray-900/50 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <Calculator className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            价格计算
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* 租期计算 */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-gray-300 font-medium mb-3">租期（天）</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {rentDays !== null ? rentDays : '--'}
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>计算公式：租期 = ceil(哈佛币 ÷ 每天消耗M)</p>
                <p className="text-primary/70">
                  &lt;80M=8M/天, 80-300M=10M/天, &gt;300M=12M/天
                </p>
                {dailyConsumption && (
                  <p className="text-primary">当前：{dailyConsumption}M/天</p>
                )}
              </div>
            </div>

            {/* 比例设定 */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-gray-300 font-medium mb-3">比例设定</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {finalRatio !== null ? `1:${finalRatio}` : '1:--'}
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>基础比例：{baseRatio !== null ? `1:${baseRatio}` : '--'}</p>
                {priceDetails.map((detail, idx) => (
                  <p key={idx} className="text-primary/70">{detail}</p>
                ))}
              </div>
            </div>

            {/* 回收价格 */}
            <div className="p-4 bg-primary/10 rounded-xl border border-primary/30">
              <h3 className="text-primary font-medium mb-3">回收价格（元）</h3>
              <div className="text-3xl font-bold text-primary mb-2">
                {recyclePrice !== null ? `¥${recyclePrice.toFixed(2)}` : '¥--'}
              </div>
              <div className="text-sm text-gray-500">
                <p>计算公式：(M数值 × 100) ÷ 比例 = 回收价格</p>
                <p className="text-primary/70 mt-1">
                  示例：200M，比例1:40 → (200×100)÷40=500元
                </p>
                {formData.superGuarantee && recyclePrice && (
                  <p className="text-red-400 mt-1">
                    扣除6%服务费后：¥{(recyclePrice * 0.94).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 比例说明 */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              比例计算说明
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <p className="text-primary mb-2">基础比例表：</p>
                <p>9格安全箱 7体=1:39 | 5/6体=1:40 | 3/4体=1:41</p>
                <p>6格安全箱 7体=1:41 | 5/6体=1:42 | 3/4体=1:43</p>
                <p>其它安全箱 = 1:44</p>
              </div>
              <div>
                <p className="text-primary mb-2">皮肤溢价调整：</p>
                <p>威龙/红狼红皮 -2 | 麦小雯红皮 -1 | 刀皮(电锯除外) -1</p>
                <p className="text-red-400 mt-2">≥300M时 +2（大额号难出）</p>
              </div>
            </div>
          </div>
        </div>

        {/* 上传截图 */}
        <div className="form-section bg-gray-900/50 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Upload className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            上传截图 <span className="text-red-500">*</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
            为了避免打手多用东西纠缠不清，一定要放仓库和K/D界面、资产界面图片、藏品界面图片、收藏室图片
          </p>
          
          <div className="space-y-3 sm:space-y-4">
            {[
              { key: 'mainInterface', label: '账号主界面', required: true },
              { key: 'warehouse', label: '主仓库截图', required: true },
              { key: 'other', label: '其他截图（可选）', required: false },
            ].map(({ key, label, required }) => {
              const imageKey = key as 'mainInterface' | 'warehouse' | 'other';
              const hasImage = uploadedImages[imageKey];
              return (
                <div key={key} className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-16 sm:w-20 h-16 sm:h-20 rounded-lg sm:rounded-xl border flex items-center justify-center flex-shrink-0 overflow-hidden ${hasImage ? 'border-primary/50' : 'bg-white/5 border-white/10'}`}>
                    {hasImage ? (
                      <img src={hasImage} alt={label} className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-5 sm:w-6 h-5 sm:h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium mb-1 text-sm sm:text-base">
                      {label} {required && <span className="text-red-500">*</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(imageKey, e.target.files?.[0] || null)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm"
                          asChild
                        >
                          <span>{hasImage ? '更换图片' : '选择文件'}</span>
                        </Button>
                      </label>
                      {hasImage && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
                          onClick={() => handleRemoveImage(imageKey)}
                        >
                          删除
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 备注说明 */}
        <div className="form-section bg-gray-900/50 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">备注说明</h2>
          <Textarea
            placeholder="请输入账号的详细说明和使用规则，如：不可动收藏室、特殊道具等"
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
            className="bg-white/5 border-white/10 text-white min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
          />
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg sm:rounded-xl">
            <p className="text-yellow-400 text-xs sm:text-sm">
              禁止使用的物品备注一定要写清楚，除开纯币仓库里其他东西能不能动用，打手使用是否需要付费。
              免费活动赠送的抽奖券，如果出现使用或者领取了的情况，无法补偿。租客在租号期间完成任务/活动/对局等获得的奖励，租客有权免费使用。
            </p>
          </div>
        </div>

        {/* 价格汇总 */}
        <div className="form-section bg-gray-900/50 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-gray-400 text-sm sm:text-base">商品价格：</span>
            <span className="text-xl sm:text-2xl font-bold text-white">
              ¥{recyclePrice?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-gray-400 text-sm sm:text-base">担保费：</span>
            <span className="text-lg sm:text-xl text-white">
              ¥{formData.superGuarantee && recyclePrice ? (recyclePrice * 0.06).toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
            <span className="text-gray-400 text-base sm:text-lg">到手价格：</span>
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              ¥{formData.superGuarantee && recyclePrice ? (recyclePrice * 0.94).toFixed(2) : (recyclePrice?.toFixed(2) || '0.00')}
            </span>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="form-section flex justify-center px-4 sm:px-0">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-primary text-black hover:bg-primary-dark font-semibold text-base sm:text-lg px-8 sm:px-16 py-5 sm:py-6"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中...' : submitSuccess ? '提交成功！' : '提交账号信息'}
          </Button>
        </div>
      </div>
      
      {/* 联系支付弹窗 */}
      <ContactPaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
