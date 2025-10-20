"use client";

import { VariantOptionPayload, VariantPayload } from "@/schemas/create-variant";
import { ProductWithCategories } from "@/types/product";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = ProductWithCategories & {
  variants?: Record<string, string[]>; // e.g. { "Size": ["M"], "Toppings": ["Cheese"] }
};

type AdditionalCharge = { optionName: string; price: number };
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, variantsKey?: string) => void;
  decrementQuantity: (id: string, variants?: Record<string, string[]>) => void;
  updateQuantity: (id: string, quantity: number, variantsKey?: string) => void;
  clearCart: () => void;
  getQuantity: (productId: string) => number;
  totalItems: number;
  totalPrice: number;
  getCartInfo: () => (CartItem & {
    quantity: number;
    totalPrice: number;
    additionalCharges: AdditionalCharge[];
  })[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// ✅ Clean, order-independent key generator with fallback to "default"
const getVariantKey = (variants?: Record<string, string[]>) => {
  if (!variants || Object.keys(variants).length === 0) return "default";

  const sortedEntries = Object.entries(variants)
    .map(([key, values]) => [key, values.filter(Boolean)]) // remove empty values
    .filter(([, values]) => values.length > 0) // ignore empty arrays
    //@ts-ignore
    .sort(([a], [b]) => a.localeCompare(b)); // sort keys alphabetically

  if (sortedEntries.length === 0) return "default";

  return sortedEntries
    .map(([key, values]) => `${key}:${[...values].sort().join(",")}`) // sort values alphabetically too
    .join("|");
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getKey = (item: CartItem) =>
    `${item.id}|${getVariantKey(item.variants)}`;

  const addToCart = (item: CartItem) => {
    const key = getKey(item);
    setCart((prev) => {
      if (!prev.find((i) => getKey(i) === key)) {
        return [...prev, item];
      }
      return prev;
    });

    setQuantities((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const decrementQuantity = (
    id: string,
    variants?: Record<string, string[]>
  ) => {
    setQuantities((prev) => {
      const key = `${id}|${getVariantKey(variants)}`;
      console.log(key);
      console.log("previous", prev);
      const current = prev[key] || 0;
      if (current <= 1) {
        removeFromCart(id, getVariantKey(variants));
        return { ...prev, [key]: 0 };
      }
      return { ...prev, [key]: current - 1 };
    });
  };

  // ✅ fixed removeFromCart to correctly compute and match full key
  const removeFromCart = (id: string, variantsKey?: string) => {
    const keyToRemove = `${id}|${variantsKey || "default"}`;
    setCart((prev) => prev.filter((item) => getKey(item) !== keyToRemove));

    setQuantities((prev) => {
      const newQ = { ...prev };
      delete newQ[keyToRemove];
      return newQ;
    });
  };

  const updateQuantity = (
    id: string,
    quantity: number,
    variantsKey?: string
  ) => {
    const key = `${id}|${variantsKey || "default"}`;
    if (quantity <= 0) removeFromCart(id, variantsKey);
    else setQuantities((prev) => ({ ...prev, [key]: quantity }));
  };

  const getQuantity = (productId: string) => {
    return cart
      .filter((item) => item.id === productId)
      .reduce((sum, item) => sum + (quantities[getKey(item)] || 0), 0);
  };

  const getCartInfo = () => {
    return cart.map((item) => {
      const key = getKey(item);
      const qty = quantities[key] || 0;

      let variantTotal = 0;
      const additionalCharges: AdditionalCharge[] = [];

      if (item.variants && item.variantInfo) {
        // Flatten selected variants
        const selectedVariants = Object.values(
          item.variants
        ).flat() as string[];
        console.log("SELECTED VARIANTS", selectedVariants);

        // Flatten all variant options
        const allVariantOptions = item.variantInfo
          .map((variant: VariantPayload) => variant.options)
          .flat();
        console.log("VARIANT INFO", allVariantOptions);

        // Compute total extra from variants
        selectedVariants.forEach((selected: string) => {
          const match = allVariantOptions.find(
            (opt: VariantOptionPayload) => opt.name === selected
          );
          if (match) {
            variantTotal += match.price;
            additionalCharges.push({
              optionName: match.name,
              price: match.price,
            });
          }
        });
      }

      const totalPrice = (item.price + variantTotal) * qty;

      return {
        ...item,
        quantity: qty,
        totalPrice,
        additionalCharges,
      };
    });
  };

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const key = getKey(item);
    const qty = quantities[key] || 0;

    let variantTotal = 0;

    if (item.variants && item.variantInfo) {
      const selectedVariants = Object.values(item.variants).flat() as string[];

      const allVariantOptions = item.variantInfo
        .map((variant: VariantPayload) => variant.options)
        .flat();

      selectedVariants.forEach((selected: string) => {
        const match = allVariantOptions.find(
          (opt: VariantOptionPayload) => opt.name === selected
        );
        if (match) {
          variantTotal += match.price;
        }
      });
    }

    return sum + (item.price + variantTotal) * qty;
  }, 0);

  const clearCart = () => {
    setCart([]);
    setQuantities({});
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decrementQuantity,
        updateQuantity,
        clearCart,
        getQuantity,
        totalItems,
        totalPrice,
        getCartInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
