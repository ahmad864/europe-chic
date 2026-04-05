'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { sendOrderToTelegram } from '@/lib/telegram';
import { categories } from '@/data/products';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, updateProductStock } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    payment: 'cod',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return;
    if (!form.name || !form.phone || !form.city || !form.address) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    setLoading(true);
    try {
      await sendOrderToTelegram({
        customerName: form.name,
        phone: form.phone,
        city: form.city,
        address: form.address,
        paymentMethod: form.payment === 'cod' ? 'عند الاستلام' : 'شام كاش',
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          category: categories.find(c => c.id === item.category)?.name || item.category,
        })),
        totalPrice: cartTotal,
      });
      // تخفيض الكمية في Supabase — نجلب الكمية الحالية مباشرة من DB لتجنب أي تعارض
      for (const item of cart) {
        const { data } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();
        const currentStock = data?.stock ?? 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        await updateProductStock(item.id, newStock);
      }
      clearCart();
      setSubmitted(true);
    } catch {
      toast.error('حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4 max-w-sm"
        >
          <p className="text-5xl">🎉</p>
          <h2 className="text-xl font-bold text-foreground font-arabic">شكراً لتسوقك من موقعنا</h2>
          <p className="text-muted-foreground font-arabic">سنتواصل معك قريباً</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-arabic"
          >
            العودة للرئيسية
          </button>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground font-arabic">السلة فارغة</p>
          <Link href="/" className="inline-block px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-arabic">
            تسوقي الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="sticky top-0 z-50 glass-card px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link href="/cart" className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowRight className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground font-arabic">إتمام الطلب</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-lg mx-auto space-y-4">
        {[
          { key: 'name', label: 'الاسم', type: 'text' },
          { key: 'phone', label: 'رقم الهاتف', type: 'tel' },
          { key: 'city', label: 'المدينة', type: 'text' },
          { key: 'address', label: 'العنوان', type: 'text' },
        ].map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-foreground mb-1.5 font-arabic">
              {field.label}
            </label>
            <input
              type={field.type}
              value={form[field.key as keyof typeof form]}
              onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground font-arabic focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-arabic">طريقة الدفع</label>
          <div className="space-y-2">
            {[
              { value: 'cod', label: 'عند الاستلام' },
              { value: 'shamcash', label: 'شام كاش' },
            ].map(opt => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  form.payment === opt.value ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={form.payment === opt.value}
                  onChange={e => setForm(prev => ({ ...prev, payment: e.target.value }))}
                  className="accent-primary"
                />
                <span className="font-arabic text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-secondary">
          <div className="flex justify-between">
            <span className="font-arabic text-foreground">المجموع</span>
            <span className="font-bold text-primary text-lg">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-medium font-arabic transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
        >
          {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
        </button>
      </form>
    </div>
  );
}
