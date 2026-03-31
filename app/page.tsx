'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import SideMenu from '@/components/SideMenu';
import HeroSlider from '@/components/HeroSlider';
import CategoriesGrid from '@/components/CategoriesGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhySection from '@/components/WhySection';
import AppFooter from '@/components/AppFooter';
import LoadingScreen from '@/components/LoadingScreen';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // إذا لم يسبق تحميل الموقع في هذه الجلسة، أظهر شاشة التحميل
    const hasLoaded = sessionStorage.getItem('app_loaded');
    if (!hasLoaded) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('app_loaded', '1');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <LoadingScreen show={loading} />
      <TopBar onMenuOpen={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <HeroSlider />
      <CategoriesGrid />
      <FeaturedProducts />
      <WhySection />
      <AppFooter />
    </div>
  );
}
