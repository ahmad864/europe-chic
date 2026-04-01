'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Product, ProductStatus } from '@/data/products';
import { supabase } from '@/lib/supabase';

interface CartItem extends Product {
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  favorites: string[];
  products: Product[];
  loading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  deleteProduct: (productId: string) => void;
  toggleFeatured: (productId: string) => void;
  updateProductStatus: (productId: string, status: ProductStatus) => void;
  updateProductStock: (productId: string, stock: number) => void;
  addProduct: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب المنتجات من Supabase عند بدء التطبيق
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isFavorite = useCallback((productId: string) => favorites.includes(productId), [favorites]);

  const deleteProduct = useCallback(async (productId: string) => {
    await supabase.from('products').delete().eq('id', productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const toggleFeatured = useCallback(async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const newFeatured = !product.featured;
    await supabase.from('products').update({ featured: newFeatured }).eq('id', productId);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, featured: newFeatured } : p));
  }, [products]);

  const updateProductStatus = useCallback(async (productId: string, status: ProductStatus) => {
    await supabase.from('products').update({ status }).eq('id', productId);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status } : p));
  }, []);

  const updateProductStock = useCallback(async (productId: string, stock: number) => {
    const newStatus: ProductStatus = stock === 0 ? 'out-of-stock' : stock <= 5 ? 'low-stock' : 'available';
    await supabase.from('products').update({ stock, status: newStatus }).eq('id', productId);
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, stock, status: newStatus } : p
    ));
  }, []);

  const addProduct = useCallback(async (product: Product) => {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        featured: product.featured,
        status: product.status,
        stock: product.stock,
      }])
      .select()
      .single();

    if (!error && data) {
      setProducts(prev => [data as Product, ...prev]);
    }
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart, favorites, products, loading, addToCart, removeFromCart, updateQuantity,
      clearCart, toggleFavorite, isFavorite, cartTotal, cartCount,
      setProducts, deleteProduct, toggleFeatured, updateProductStatus, updateProductStock, addProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
