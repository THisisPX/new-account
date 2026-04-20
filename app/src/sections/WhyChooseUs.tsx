import { useEffect, useRef } from 'react';
import {
  Zap,
  Shield,
  Lock,
  HeadphonesIcon,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Zap,
    title: '即时访问',
    description: '租赁后立即开始游戏。无需等待，无延迟。付款后秒级交付账号信息。',
  },
  {
    icon: Shield,
    title: '优质账号',
    description: '所有账号均经过验证，拥有顶级装备和高级解锁内容。品质保证。',
  },
  {
    icon: Lock,
    title: '安全交易',
    description: '端到端加密，保护您的所有交易和个人信息。安全无忧。',
  },
  {
    icon: HeadphonesIcon,
    title: '全天候支持',
    description: '我们的专业团队全天候为您解决任何问题。7×24小时在线客服。',
  },
  {
    icon: Calendar,
    title: '灵活租赁',
    description: '按小时、按天或按周租赁——选择最适合您的方案。灵活便捷。',
  },
  {
    icon: RefreshCw,
    title: '退款保证',
    description: '有问题？我们在验证后24小时内提供退款。售后有保障。',
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
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
      const cards = cardsRef.current?.querySelectorAll('.feature-card');
      cards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, rotate: index % 2 === 0 ? 5 : -5 },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 0.6,
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
    <section id="why-us" ref={sectionRef} className="py-24 bg-black relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            为什么<span className="text-primary">选择我们</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            让我们与众不同的核心优势，为您提供最优质的游戏账号租赁体验
          </p>
        </div>

        {/* Features Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group p-6 bg-gray-900/50 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-3"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
