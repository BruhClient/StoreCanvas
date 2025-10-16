"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProductWithCategories } from "@/context/store-context";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  options?: Record<string, string>; // e.g., { size: "M", color: "Red" }
}

export interface CartItem {
  product: ProductWithCategories;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: ProductWithCategories,
    variant?: ProductVariant,
    quantity?: number
  ) => void;
  removeFromCart: (variantId: string) => void;
  decrementQuantity: (variantId: string) => void;
  clearCart: () => void;
  getQuantity: (variantId: string) => number;
  totalItems: number;
  cartIncludesProduct: (productId: string, variantId?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (
    product: ProductWithCategories,
    variant?: ProductVariant,
    quantity = 1
  ) => {
    const cartVariant: ProductVariant = variant
      ? variant
      : {
          id: product.id,
          name: product.name,
          price: product.price,
        };

    setCart((prev) => {
      const existing = prev.find((item) => item.variant.id === cartVariant.id);
      if (existing) {
        return prev.map((item) =>
          item.variant.id === cartVariant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, variant: cartVariant, quantity }];
      }
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const decrementQuantity = (variantId: string) => {
    setCart(
      (prev) =>
        prev
          .map((item) =>
            item.variant.id === variantId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0) // remove item if quantity <= 0
    );
  };

  const clearCart = () => setCart([]);

  const getQuantity = (variantId: string) => {
    const item = cart.find((i) => i.variant.id === variantId);
    return item ? item.quantity : 0;
  };

  const cartIncludesProduct = (productId: string, variantId?: string) => {
    return cart.some((item) =>
      variantId ? item.variant.id === variantId : item.product.id === productId
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decrementQuantity,
        clearCart,
        getQuantity,
        totalItems,
        cartIncludesProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
