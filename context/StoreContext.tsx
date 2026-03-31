'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product, ProductStatus } from '@/data/products';

interface CartItem extends Product {
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  favorites: string[];
  products: Product[];
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

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const toggleFeatured = useCallback((productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, featured: !p.featured } : p));
  }, []);

  const updateProductStatus = useCallback((productId: string, status: ProductStatus) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status } : p));
  }, []);

  const updateProductStock = useCallback((productId: string, stock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const newStatus: ProductStatus = stock === 0 ? 'out-of-stock' : stock <= 5 ? 'low-stock' : 'available';
      return { ...p, stock, status: newStatus };
    }));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [product, ...prev]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart, favorites, products, addToCart, removeFromCart, updateQuantity,
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
