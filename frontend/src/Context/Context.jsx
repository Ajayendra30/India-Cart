import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  deleteFromCart: () => {},
  refreshData: () => {},
  clearCart: () => {},
});

export const AppProvider = ({ children }) => {
  const baseUrl =
    import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");

  // 🛒 Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // 🔄 FETCH PRODUCTS
  const refreshData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/products`);
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  // 🛒 ADD TO CART
  const addToCart = (product) => {
    const productId = product._id || product.id;

    const existingIndex = cart.findIndex(
      (item) => (item._id || item.id) === productId
    );

    let updatedCart;

    if (existingIndex !== -1) {
      updatedCart = cart.map((item, index) =>
        index === existingIndex
          ? {
              ...item,
              id: productId,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          id: productId,
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ➖ REMOVE / DECREASE QUANTITY
  const removeFromCart = (productId) => {
    const updatedCart = cart
      .map((item) =>
        (item._id || item.id) === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 🗑 DELETE FULL ITEM
  const deleteFromCart = (productId) => {
    const updatedCart = cart.filter(
      (item) => (item._id || item.id) !== productId
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 🧹 CLEAR FULL CART
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // 🔁 Load products once
  useEffect(() => {
    refreshData();
  }, []);

  // 🔁 Sync cart to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        deleteFromCart,
        refreshData,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;