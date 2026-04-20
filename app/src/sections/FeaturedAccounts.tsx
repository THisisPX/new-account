import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const accounts = [
  {
    id: 1,
    name: '暗影部队',
    price: 25,
    rating: 4.9,
    image: '/account-1.jpg',
    features: ['全武器解锁', '高级皮肤', '满级角色'],
  },
  {
    id: 2,
    name: '红狼小队',
    price: 30,
    rating: 4.8,
    image: '/account-2.jpg',
    features: ['稀有装备', '限定皮肤', 'VIP特权'],
  },
  {
    id: 3,
    name: '夜枭军团',
    price: 22,
    rating: 4.9,
    image: '/account-3.jpg',
    features: ['狙击专精', '夜视装备', '隐蔽技能'],
  },
  {
    id: 4,
    name: '猎鹰特遣队',
    price: 28,
    rating: 4.7,
    image: '/account-4.jpg',
    features: ['突击专精', '城市作战', '团队配合'],
  },
  {
    id: 5,
    name: '毒蛇小队',
    price: 35,
    rating: 4.9,
    image: '/account-5.jpg',
    features: ['丛林专家', '生存技能', '野外作战'],
  },
  {
    id: 6,
    name: '幽灵战队',
    price: 40,
    rating: 5.0,
    image: '/account-6.jpg',
    features: ['雪地专精', '精英装备', '顶级特权'],
  },
];

export default function FeaturedAccounts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.account-card');
      cards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, rotateY: -90 },
          {
            opacity: 1,
            rotateY: 0,
            duration: 0.7,
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="py-24 bg-black relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              热门<span className="text-primary">租赁</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl">
              本周最受欢迎的三角洲行动账号，精选优质装备，即刻开启战斗
            </p>
          </div>
          <Link to="/rent">
            <Button
              variant="outline"
              className="mt-6 md:mt-0 border-white/20 text-white hover:bg-white/10 group"
            >
              查看全部
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: '1000px' }}
        >
          {accounts.map((account) => (
            <div
              key={account.id}
              className="account-card group relative bg-gray-900 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-glow"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={account.image}
                  alt={account.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-black text-sm font-bold rounded-full">
                  ¥{account.price}/小时
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {account.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{account.rating}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {account.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded-md border border-white/10"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <Button
                  className="w-full bg-white/5 text-white hover:bg-primary hover:text-black border border-white/10 hover:border-primary transition-all duration-300"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  立即租赁
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
