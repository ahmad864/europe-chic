import { MessageCircle, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function AppFooter() {
  return (
    <footer className="bg-primary py-8 px-4 mt-4">
      <div className="max-w-lg mx-auto text-center space-y-5">
        <Image src="/images/logo.png" alt="Europe Chic" width={180} height={64} className="h-16 w-auto mx-auto" />

        <p className="text-sm text-primary-foreground/90 font-arabic leading-relaxed max-w-xs mx-auto">
          أناقتكِ تبدأ من هنا — أزياء أوروبية مختارة بعناية لتعكس تفردكِ وأسلوبكِ الخاص
        </p>

        <div className="space-y-2 text-sm text-primary-foreground/80 font-arabic">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-primary-foreground" />
            <span> : 11 صباحاً - 10 مساءً</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-primary-foreground" />
            <span>حلب، سوريا</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <a
            href="https://wa.me/963949733784"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background text-primary text-sm font-medium transition-transform hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-arabic">تواصل عبر واتساب</span>
          </a>
          <a
            href="https://www.instagram.com/europe_chic?igsh=Ym41bWVsYW9pYzRm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background text-primary text-sm font-medium transition-transform hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <span className="font-arabic">انستقرام</span>
          </a>
        </div>

        <p className="text-xs text-primary-foreground/60 font-arabic">
          © 2026 Europe Chic. جميع الحقوق محفوظة
          <br />
          <span className="text-primary-foreground/50">تطوير </span>
          <a
            href="https://www.facebook.com/ahmad.ah.552334"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium"
          >
            AlPrince-Tech
          </a>
        </p>
      </div>
    </footer>
  );
}
