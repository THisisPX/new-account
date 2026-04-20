import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Shield, DollarSign } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60, rotateX: 45 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 0.6, delay: 0.7, ease: 'power2.out' }
      );

      // Buttons animation
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 0.9, ease: 'back.out(1.7)' }
      );

      // Stats animation
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, delay: 1.1, ease: 'power2.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>

      {/* Particle Effect (CSS-based) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
        style={{ perspective: '1200px' }}
      >
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">安全可靠的账号租赁平台</span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            style={{ transformStyle: 'preserve-3d' }}
          >
            三角洲行动
            <br />
            <span className="text-gradient">顶级账号租赁</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl"
          >
            即时访问高端游戏账号。安全租赁，优质装备，零等待时间。
            加入50,000+满意玩家的行列。
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-3 sm:gap-4 mb-12">
            <Link to="/rent">
              <Button
                size="lg"
                className="bg-primary text-black hover:bg-primary-dark font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 animate-pulse-glow"
              >
                立即租赁
              </Button>
            </Link>
            <Link to="/rent">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
              >
                浏览账号
              </Button>
            </Link>
            <Link to="/sell">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-lg shadow-green-500/30"
              >
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                我要出号
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold text-white">4.9</span>
              </div>
              <div className="text-sm text-gray-400">
                <div>用户评分</div>
                <div>10万+评价</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-white">50K+</span>
              </div>
              <div className="text-sm text-gray-400">
                <div>成功租赁</div>
                <div>持续增长中</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[5]" />
    </section>
  );
}
