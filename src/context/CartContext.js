
import React, { createContext, useContext, useState } from 'react';

// Create Context
const CartContext = createContext();

// Cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    // Check if product is already in cart
    const existingProduct = cart.find(item => item._id === product._id);
    if (existingProduct) {
      // Increase quantity if exists
      setCart((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new product to cart
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      // Remove item if quantity is less than 1
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.discountedPrice * item.quantity, 0);
  };
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getTotalPrice,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use Cart
export const useCart = () => {
  return useContext(CartContext);
};
