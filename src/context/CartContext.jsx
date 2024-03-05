import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8082/api/cart/view-cart",
          { withCredentials: true }
        );
        setCart(response.data.cartItems);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("Inside use effect of cartContext and fetching cart");
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, isLoading, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
