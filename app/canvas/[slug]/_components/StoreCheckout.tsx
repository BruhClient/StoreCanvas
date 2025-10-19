import CartItemsList from "@/components/CartItemList";
import { useCart } from "@/context/cart-context";
import React from "react";

const StoreCheckout = () => {
  const { cart, addToCart, decrementQuantity } = useCart();
  return (
    <div>
      <CartItemsList
        cartItems={cart}
        addToCart={addToCart}
        decrementQuantity={decrementQuantity}
      />
    </div>
  );
};

export default StoreCheckout;
