'use client';

import { Heart, ShoppingBag, User, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TopBarProps {
  onMenuOpen: () => void;
}

export default function TopBar({ onMenuOpen }: TopBarProps) {
  const { cartCount, favorites } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 px-4 py-3 transition-all duration-300 ${
        scrolled ? 'bg-primary/85 backdrop-blur-md shadow-lg' : 'bg-primary shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/logo.png" alt="Europe Chic" width={180} height={64} className="h-16 w-auto" priority />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/favorites" className="relative p-2 rounded-full hover:bg-primary-foreground/15 transition-all active:scale-90">
            <Heart className="w-5 h-5 text-primary-foreground" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-background text-primary text-[9px] flex items-center justify-center font-bold">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative p-2 rounded-full hover:bg-primary-foreground/15 transition-all active:scale-90">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-background text-primary text-[9px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/admin" className="p-2 rounded-full hover:bg-primary-foreground/15 transition-all active:scale-90">
            <User className="w-5 h-5 text-primary-foreground" />
          </Link>

          <button onClick={onMenuOpen} className="p-2 rounded-full hover:bg-primary-foreground/15 transition-all active:scale-90">
            <Menu className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
