import { useEffect, useRef } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { name: '首页', href: '#hero' },
  { name: '租号', href: '#featured' },
  { name: '支持', href: '#why-us' },
];

const legalLinks = [
  { name: '服务条款', href: '#' },
  { name: '隐私政策', href: '#' },
  { name: '退款政策', href: '#' },
];

const socialLinks = [
  { name: '微信', icon: '💬' },
  { name: '微博', icon: '📱' },
  { name: '抖音', icon: '🎵' },
  { name: 'B站', icon: '📺' },
];

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const animateItems = contentRef.current?.querySelectorAll('.animate-item');
      if (animateItems && animateItems.length > 0) {
        gsap.fromTo(
          animateItems,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className={`bg-black border-t border-white/10 ${className}`}>
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="animate-item">
            <a href="#hero" className="flex items-center gap-3 mb-4">
              <img 
                src="/logo.png" 
                alt="非星商行" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-white">三角洲租号</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed">
              专业、安全、高性能的游戏账号租赁平台，提供即时访问和优质体验。为玩家打造最好的租赁服务。
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-item">
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm inline-flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="animate-item">
            <h4 className="text-white font-semibold mb-4">法律条款</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm inline-flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="animate-item">
            <h4 className="text-white font-semibold mb-4">联系我们</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                support@delta-rent.com
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                400-888-8888
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                北京市朝阳区游戏产业园
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h5 className="text-white font-semibold mb-3 text-sm">关注我们</h5>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <button
                    key={social.name}
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg hover:bg-primary hover:scale-110 hover:rotate-6 transition-all duration-300"
                    title={social.name}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="animate-item mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 三角洲租号。保留所有权利。
          </p>
          <p className="text-gray-500 text-sm">
            由游戏玩家，为游戏玩家<span className="text-primary">精心打造</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
