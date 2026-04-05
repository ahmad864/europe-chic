'use client';

import { useState, useMemo, useEffect } from 'react';
import { ArrowRight, Plus, Trash2, Star, Upload } from 'lucide-react';
import Link from 'next/link';
import { categories } from '@/data/products';
import type { ProductStatus } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ADMIN_EMAIL = 'hourai@gmail.com';

const statusOptions: { value: ProductStatus; label: string }[] = [
  { value: 'available', label: 'متوفر' },
  { value: 'low-stock', label: 'كمية قليلة' },
  { value: 'out-of-stock', label: 'غير متوفر' },
];

const statusColors: Record<ProductStatus, string> = {
  available: 'bg-green-500',
  'low-stock': 'bg-yellow-500',
  'out-of-stock': 'bg-red-500',
};

function AdminLoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      toast.error('بيانات الدخول غير صحيحة');
      setLoading(false);
      return;
    }

    if (data.user.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      toast.error('ليس لديك صلاحية الدخول');
      setLoading(false);
      return;
    }

    toast.success('تم تسجيل الدخول بنجاح');
    onLogin();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 p-6 rounded-2xl bg-card border border-border"
      >
        <h1 className="text-xl font-bold text-foreground text-center font-arabic">لوحة التحكم</h1>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground font-arabic focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground font-arabic focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-primary text-primary-foreground font-arabic font-medium disabled:opacity-60"
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
        <Link href="/" className="block text-center text-sm text-muted-foreground font-arabic hover:text-primary">
          العودة للرئيسية
        </Link>
      </motion.form>
    </div>
  );
}

function AddProductForm({
  categoryId,
  categoryName,
  onAdd,
  onClose,
}: {
  categoryId: string;
  categoryName: string;
  onAdd: (product: { name: string; price: number; image: string; stock: number; size?: string; length?: string }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [size, setSize] = useState('');
  const [length, setLength] = useState('');
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // رفع الصورة إلى Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file);

    if (error) {
      // إذا فشل الرفع، استخدم base64 كبديل
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setImage(result);
      };
      reader.readAsDataURL(file);
    } else {
      const { data: urlData } = supabase.storage.from('products').getPublicUrl(data.path);
      setImage(urlData.publicUrl);
      setPreviewImage(urlData.publicUrl);
    }

    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }
    onAdd({ name, price: parseFloat(price), image: image || '/images/categories/category-1.png', stock: parseInt(stock), size: size || undefined, length: length || undefined });
    onClose();
    toast.success('تمت إضافة المنتج');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-lg bg-background rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
      >
        <h2 className="text-lg font-bold text-foreground font-arabic text-center">
          إضافة منتج — {categoryName}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="اسم المنتج"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground font-arabic focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            placeholder="السعر ($)"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground font-arabic focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            placeholder="الكمية المتاحة"
            value={stock}
            onChange={e => setStock(e.target.value)}
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground font-arabic focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="القياس (مثال: M، L، XL)"
              value={size}
              onChange={e => setSize(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground font-arabic focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              placeholder="الطول (مثال: 120 سم)"
              value={length}
              onChange={e => setLength(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground font-arabic focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2 font-arabic">صورة المنتج</label>
            <label className="flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors">
              {uploading ? (
                <span className="text-sm text-muted-foreground font-arabic">جاري الرفع...</span>
              ) : previewImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewImage} alt="preview" className="h-full w-full object-cover rounded-xl" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-arabic">اختر صورة</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-arabic font-medium disabled:opacity-60"
            >
              إضافة
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-secondary text-foreground font-arabic"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [showAddForm, setShowAddForm] = useState(false);
  const { products, addProduct, deleteProduct, toggleFeatured, updateProductStatus, updateProductStock } = useStore();

  // التحقق من الجلسة عند فتح الصفحة
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email === ADMIN_EMAIL) {
        setLoggedIn(true);
      }
      setCheckingSession(false);
    };
    checkSession();
  }, []);

  const categoryProducts = useMemo(
    () => products.filter(p => p.category === selectedCategory),
    [products, selectedCategory]
  );

  const currentCategory = categories.find(c => c.id === selectedCategory)!;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-arabic">جاري التحقق...</p>
      </div>
    );
  }

  if (!loggedIn) return <AdminLoginForm onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="sticky top-0 z-50 bg-primary px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-full hover:bg-primary-foreground/15 transition-colors">
              <ArrowRight className="w-5 h-5 text-primary-foreground" />
            </Link>
            <h1 className="text-lg font-bold text-primary-foreground font-arabic">لوحة التحكم</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-primary-foreground/70 font-arabic hover:text-primary-foreground"
          >
            خروج
          </button>
        </div>
      </header>

      {/* Category tabs */}
      <div className="sticky top-[57px] z-40 bg-background border-b border-border">
        <div className="flex gap-2 px-4 py-2 overflow-x-auto hide-scrollbar max-w-lg mx-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-arabic font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto">
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center gap-2 text-primary font-arabic text-sm hover:border-primary hover:bg-primary/5 transition-all mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج في {currentCategory.name}</span>
        </button>

        {categoryProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 font-arabic text-sm">
            لا توجد منتجات في هذا القسم
          </p>
        ) : (
          <div className="space-y-3">
            {categoryProducts.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-3 rounded-2xl bg-card border border-border/30"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate font-arabic">{product.name}</h3>
                  <p className="text-xs font-bold text-primary mt-0.5">${product.price}</p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <select
                      value={product.status}
                      onChange={e => updateProductStatus(product.id, e.target.value as ProductStatus)}
                      className="text-xs rounded-lg border border-border bg-background px-2 py-1 font-arabic focus:outline-none"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <span className={`w-2 h-2 rounded-full ${statusColors[product.status]}`} />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground font-arabic">الكمية:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateProductStock(product.id, Math.max(0, (product.stock ?? 0) - 1))}
                        className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold hover:bg-secondary/80"
                      >−</button>
                      <span className={`text-xs font-bold w-8 text-center ${
                        (product.stock ?? 0) === 0 ? 'text-red-500' :
                        (product.stock ?? 0) <= 5 ? 'text-yellow-600' : 'text-green-600'
                      }`}>{product.stock ?? 0}</span>
                      <button
                        onClick={() => updateProductStock(product.id, (product.stock ?? 0) + 1)}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground hover:opacity-90"
                      >+</button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 items-center">
                  <button
                    onClick={() => {
                      toggleFeatured(product.id);
                      toast(product.featured ? 'تم إلغاء التمييز' : 'تم تمييز المنتج');
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      product.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${product.featured ? 'fill-yellow-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      deleteProduct(product.id);
                      toast.success('تم حذف المنتج');
                    }}
                    className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <AddProductForm
          categoryId={selectedCategory}
          categoryName={currentCategory.name}
          onAdd={({ name, price, image, stock, size, length }) => {
            const stockNum = stock ?? 0;
            const status: ProductStatus = stockNum === 0 ? 'out-of-stock' : stockNum <= 5 ? 'low-stock' : 'available';
            addProduct({
              id: `${selectedCategory}-${Date.now()}`,
              name,
              price,
              image,
              category: selectedCategory,
              featured: false,
              status,
              stock: stockNum,
              size,
              length,
            });
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
