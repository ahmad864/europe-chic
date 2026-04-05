'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { motion } from 'framer-motion';
import type { Product } from '@/data/products';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const statusConfig = {
  'available': { label: 'متوفر', className: 'bg-green-500/90 text-white' },
  'low-stock': { label: 'كمية قليلة', className: 'bg-yellow-500/90 text-white' },
  'out-of-stock': { label: 'غير متوفر', className: 'bg-red-500/90 text-white' },
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const fav = isFavorite(product.id);
  const status = statusConfig[product.status || 'available'];

  const isExternal = product.image.startsWith('http');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl overflow-hidden bg-card shadow-sm border border-border/30 cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        )}
        <span className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-arabic font-medium ${status.className}`}>
          {status.label}
        </span>
        <button
          onClick={() => {
            toggleFavorite(product.id);
            toast(fav ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة إلى المفضلة');
          }}
          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${fav ? 'fill-primary text-primary' : 'text-foreground'}`} />
        </button>
      </div>

      <div className="p-2.5">
        <h3 className="text-xs font-medium text-foreground font-arabic truncate">{product.name}</h3>
        {(product.size || product.length) && (
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {product.size && (
              <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full font-arabic">
                {product.size}
              </span>
            )}
            {product.length && (
              <span className="text-[10px] font-medium bg-secondary text-foreground px-2 py-0.5 rounded-full font-arabic">
                {product.length}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-bold text-primary">${product.price}</span>
          {product.stock !== undefined && product.stock > 0 && (
            <span className={`text-[10px] font-arabic px-1.5 py-0.5 rounded-full ${
              product.stock <= 5
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {product.stock <= 5 ? `${product.stock} قطع فقط` : `${product.stock} متوفر`}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            if (product.status === 'out-of-stock') {
              toast.error('هذا المنتج غير متوفر حالياً');
              return;
            }
            addToCart(product);
            toast('تمت الإضافة إلى السلة');
          }}
          className={`w-full mt-2 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-95 ${
            product.status === 'out-of-stock'
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary'
          }`}
        >
          <ShoppingBag className={`w-3.5 h-3.5 ${product.status === 'out-of-stock' ? '' : 'text-primary-foreground'}`} />
          <span className={`text-xs font-medium font-arabic ${product.status === 'out-of-stock' ? '' : 'text-primary-foreground'}`}>
            اضف للسلة
          </span>
        </button>
      </div>
    </motion.div>
  );
}
