import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity?: number; // trong cart là quantity trong giỏ hàng
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (storedUser.id && token) {
      setUserId(storedUser.id);
    } else {
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    const syncUserId = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      setUserId(user.id && token ? user.id : null);
    };

    window.addEventListener("storage", syncUserId);
    window.addEventListener("focus", syncUserId);

    return () => {
      window.removeEventListener("storage", syncUserId);
      window.removeEventListener("focus", syncUserId);
    };
  }, []);

  useEffect(() => {
    if (userId === null) return;

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cart?userId=${userId}`);
        if (response.data.length > 0) {
          setCartItems(response.data[0].items || []);
        } else {
          await axios.post(`${BASE_URL}/cart`, { userId, items: [] });
          setCartItems([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };

    fetchCart();
  }, [userId]);

  useEffect(() => {
    const updateCart = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${BASE_URL}/cart?userId=${userId}`);
          if (response.data.length > 0) {
            const cartId = response.data[0].id;
            await axios.patch(`${BASE_URL}/cart/${cartId}`, { items: cartItems });
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật giỏ hàng:", error);
        }
      }
    };

    updateCart();
  }, [cartItems, userId]);

  const addToCart = async (product: Product, quantity: number) => {
    if (quantity < 1) {
      alert("Số lượng phải lớn hơn 0");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/products/${product.id}`);
      const productInStock = res.data;

      if (quantity > productInStock.quantity) {
        alert(`Sản phẩm "${product.name}" chỉ còn ${productInStock.quantity} trong kho`);
        return;
      }

      setCartItems((prevItems) => {
        const existing = prevItems.find((item) => item.id === product.id);
        if (existing) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: existing.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
    } catch (err) {
      console.error("Lỗi khi kiểm tra số lượng tồn kho:", err);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/products/${id}`);
      const productInStock = res.data;

      if (quantity > productInStock.quantity) {
        alert(`Chỉ còn ${productInStock.quantity} sản phẩm trong kho`);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setUserId(null);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được dùng trong CartProvider");
  }
  return context;
};
