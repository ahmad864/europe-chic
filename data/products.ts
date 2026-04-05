export type ProductStatus = 'available' | 'low-stock' | 'out-of-stock';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  status: ProductStatus;
  stock: number;
  size?: string;
  length?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export const categories: Category[] = [
  { id: 'winter-blouse', name: 'بلوزة شتوي', icon: '🧥', image: '/images/categories/category-1.png' },
  { id: 'summer-blouse', name: 'بلوزة صيفي', icon: '👚', image: '/images/categories/category-2.png' },
  { id: 'pants', name: 'بنطال', icon: '👖', image: '/images/categories/category-3.png' },
  { id: 'hijab', name: 'محجبات', icon: '🧕', image: '/images/categories/category-4.png' },
  { id: 'summer-shirt', name: 'قميص صيفي', icon: '👕', image: '/images/categories/category-5.png' },
  { id: 'dress', name: 'فستان', icon: '👗', image: '/images/categories/category-6.png' },
  { id: 'kids', name: 'اطفال', icon: '👶', image: '/images/categories/category-7.png' },
  { id: 'skirt', name: 'تنورة', icon: '👘', image: '/images/categories/category-8.png' },
  { id: 'pajama', name: 'بجامة', icon: '🩳', image: '/images/categories/category-9.png' },
  { id: 'winter-jacket', name: 'جاكيت شتوي', icon: '🧥', image: '/images/categories/category-10.png' },
  { id: 'summer-jacket', name: 'جاكيت صيفي', icon: '🧥', image: '/images/categories/category-11.png' },
  { id: 'trenchcoat', name: 'ترانشكوت', icon: '🧥', image: '/images/categories/category-12.png' },
  { id: 'accessories', name: 'اكسسوارات', icon: '💍', image: '/images/categories/category-13.png' },
];

// لا توجد منتجات تجريبية — المنتجات تُضاف من لوحة التحكم
export const products: Product[] = [];
