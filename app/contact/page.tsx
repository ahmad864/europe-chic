'use client';

import Link from 'next/link';
import { ArrowRight, Phone, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AppFooter from '@/components/AppFooter';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="sticky top-0 z-50 glass-card px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link href="/" className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowRight className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground font-arabic">اتصل بنا</h1>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-8 max-w-lg mx-auto space-y-6"
      >
        {[
          { icon: Phone, label: 'الهاتف', value: '+963 949 733 784' },
          { icon: MapPin, label: 'العنوان', value: 'حلب، سوريا' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/30">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-arabic">{item.label}</p>
              <p className="font-medium text-foreground font-arabic">{item.value}</p>
            </div>
          </div>
        ))}

        <a
          href="https://wa.me/963949733784"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-primary text-primary-foreground font-medium font-arabic transition-transform hover:scale-[1.02]"
        >
          <MessageCircle className="w-5 h-5" />
          <span>تواصل عبر واتساب</span>
        </a>
      </motion.div>
      <AppFooter />
    </div>
  );
}
