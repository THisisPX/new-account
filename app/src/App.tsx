import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import LogoMarquee from './sections/LogoMarquee';
import About from './sections/About';
import WhyChooseUs from './sections/WhyChooseUs';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import RentPage from './pages/RentPage';
import SellPage from './pages/SellPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import RentAccounts from './pages/admin/RentAccounts';
import SellAccounts from './pages/admin/SellAccounts';
import Users from './pages/admin/Users';
import Settings from './pages/admin/Settings';
import Watermark from './components/Watermark';
import { ADMIN_CONFIG } from './config/admin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// 后台路径（修改这个让后台更难被发现）
const ADMIN_PATH = ADMIN_CONFIG.ADMIN_PATH; // 默认: /manage

// 首页组件
function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <About />
      <WhyChooseUs />
      <CTA />
    </>
  );
}

// 滚动到顶部组件
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    // 刷新ScrollTrigger
    ScrollTrigger.refresh();
  }, [location]);
  
  return null;
}

function App() {
  useEffect(() => {
    // Initialize smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* 前台路由 */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
              <Watermark />
              <Navbar />
              <main className="relative z-10">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/rent" element={<RentPage />} />
                  <Route path="/sell" element={<SellPage />} />
                </Routes>
              </main>
              <Footer className="relative z-10" />
            </div>
          }
        />
        
        {/* 后台管理路由 - 使用配置的路径 */}
        <Route path={ADMIN_PATH + '/login'} element={<AdminLogin />} />
        <Route path={ADMIN_PATH} element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rent-accounts" element={<RentAccounts />} />
          <Route path="sell-accounts" element={<SellAccounts />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
