import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: '陈浩然',
    avatar: '/avatar-1.jpg',
    rating: 5,
    content: '账号质量令人难以置信。所有武器都已解锁，我马上就能投入游戏！客服响应也超级快。',
  },
  {
    id: 2,
    name: '李文博',
    avatar: '/avatar-2.jpg',
    rating: 5,
    content: '客服响应超快。我遇到登录问题，他们5分钟内就解决了。这种服务态度真的 rare！',
  },
  {
    id: 3,
    name: '王梓轩',
    avatar: '/avatar-3.jpg',
    rating: 4,
    content: '租赁价格公道，账号描述准确。强烈推荐给大家，特别是想体验高端装备的玩家。',
  },
  {
    id: 4,
    name: '刘子涵',
    avatar: '/avatar-4.jpg',
    rating: 5,
    content: '我每周都租，从未失望过。顶级平台！账号品质稳定，服务一流。',
  },
  {
    id: 5,
    name: '张思远',
    avatar: '/avatar-5.jpg',
    rating: 5,
    content: '流程简单快捷。选好账号，付款，开玩。就是这么简单。没有任何繁琐步骤。',
  },
  {
    id: 6,
    name: '赵雨萱',
    avatar: '/avatar-6.jpg',
    rating: 4,
    content: '账号种类丰富，支持团队乐于助人。每次租赁体验都很愉快，会继续支持！',
  },
];

export default function Testimonials() {
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
      const cards = cardsRef.current?.querySelectorAll('.testimonial-card');
      cards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: 100, rotateY: -20 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.7,
            delay: index * 0.1,
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
    <section ref={sectionRef} className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            玩家<span className="text-primary">评价</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            来自三角洲行动社区的真实反馈，听听他们怎么说
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: '1000px' }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card group p-6 bg-black/50 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary/30 mb-4" />

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-primary/50 transition-colors duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-black fill-black" />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold group-hover:text-primary transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
