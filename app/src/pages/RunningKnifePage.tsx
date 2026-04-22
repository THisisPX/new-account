import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Sword, Gem, CheckCircle, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactPaymentModal from '@/components/ContactPaymentModal';
import { useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

// 价格数据
const priceCards = [
  {
    id: '2x2',
    title: '2×2安全箱',
    icon: Sword,
    price: 85,
    originalPrice: 95,
    description: '适合小仓库账号',
    popular: false,
  },
  {
    id: '2x3',
    title: '2×3安全箱',
    icon: Shield,
    price: 75,
    originalPrice: 85,
    description: '适合中等仓库账号',
    popular: true,
  },
  {
    id: '3x3',
    title: '3×3安全箱',
    icon: Gem,
    price: 65,
    originalPrice: 75,
    description: '适合大仓库账号',
    popular: false,
  },
];

// 批量折扣数据
const bulkDiscounts = [
  { range: '0-2,000万', discount: '原价', amount: 0 },
  { range: '2,000-4,000万', discount: '每千万优惠1元', amount: 1 },
  { range: '4,000-6,000万', discount: '每千万优惠2元', amount: 2 },
  { range: '6,000-8,000万', discount: '每千万优惠3元', amount: 3 },
  { range: '8,000-10,000万', discount: '每千万优惠4元', amount: 4 },
  { range: '1亿以上', discount: '每千万优惠5元', amount: 5, highlight: true },
];

export default function RunningKnifePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 动画效果
  const handleOrder = () => {
    setIsModalOpen(true);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-black pt-16 sm:pt-20 pb-12 sm:pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-900/20 to-black border-b border-primary/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1 mb-4">
            <span className="text-primary text-sm font-medium">首单优惠</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            跑刀<span className="text-primary">服务</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            专业代跑刀服务，帮你快速获取哈佛币
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 价格卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {priceCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className={`relative rounded-2xl p-6 transition-all duration-300 ${
                  card.popular
                    ? 'bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary'
                    : 'bg-gray-900/50 border border-white/10 hover:border-primary/30'
                }`}
              >
                {card.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-4 py-1 rounded-full">
                    热门推荐
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  card.popular ? 'bg-primary/20' : 'bg-white/5'
                }`}>
                  <IconComponent className={`w-6 h-6 ${card.popular ? 'text-primary' : 'text-gray-400'}`} />
                </div>

                <h3 className="text-white font-bold text-lg mb-1">{card.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{card.description}</p>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">¥{card.price}</span>
                  <span className="text-gray-500 text-sm"> /一千万</span>
                </div>

                <div className="text-sm text-gray-500 line-through mb-6">
                  原价 ¥{card.originalPrice}/千万
                </div>

                <Button
                  onClick={handleOrder}
                  className={`w-full ${
                    card.popular
                      ? 'bg-primary text-black hover:bg-primary-dark'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  立即下单
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* 服务说明 */}
        <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6 mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            服务说明
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sword className="w-3 h-3 text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium">需要提供账号密码或扫码登录</p>
                <p className="text-gray-500 text-sm mt-1">支持账密登录和扫码登录两种方式</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sword className="w-3 h-3 text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium">服务时间内账号由专业打手操作</p>
                <p className="text-gray-500 text-sm mt-1">24小时专人操作，安全可靠</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sword className="w-3 h-3 text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium">服务完成后可随时修改密码</p>
                <p className="text-gray-500 text-sm mt-1">服务结束后建议立即修改密码确保安全</p>
              </div>
            </li>
          </ul>
        </div>

        {/* 批量折扣表 */}
        <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            多跑多送，福利多多
          </h2>

          <div className="space-y-2">
            {bulkDiscounts.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  item.highlight
                    ? 'bg-primary/10 border border-primary/30'
                    : index % 2 === 0
                    ? 'bg-white/5'
                    : 'bg-transparent'
                }`}
              >
                <span className="text-gray-400 text-sm">{item.range}</span>
                <span className={`text-sm font-medium ${
                  item.highlight ? 'text-primary' : 'text-gray-300'
                }`}>
                  {item.discount}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-400 text-sm">
              <strong>温馨提示：</strong>批量下单更优惠！具体价格根据实际仓库情况会有所浮动，联系客服获取详细报价。
            </p>
          </div>
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
