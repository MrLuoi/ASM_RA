import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000"; // Đổi nếu json-server dùng cổng khác

// Interface sản phẩm
interface Product {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

// Interface cho context
interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // 1️⃣ Khi app khởi động: lấy userId từ localStorage nếu có
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (storedUser.id && token) {
      setUserId(storedUser.id);
    } else {
      setUserId(null);
    }
  }, []);

  // 2️⃣ Lắng nghe thay đổi localStorage hoặc khi user đăng nhập lại
  useEffect(() => {
    const syncUserId = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      setUserId(user.id && token ? user.id : null);
    };

    window.addEventListener("storage", syncUserId); // từ tab khác
    window.addEventListener("focus", syncUserId);   // khi reload hoặc quay lại tab

    return () => {
      window.removeEventListener("storage", syncUserId);
      window.removeEventListener("focus", syncUserId);
    };
  }, []);

  // 3️⃣ Lấy giỏ hàng từ backend khi userId thay đổi
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

  // 4️⃣ Cập nhật giỏ hàng backend khi giỏ hàng thay đổi
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

  // Các thao tác với giỏ hàng
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // ❗ Chỉ ẩn giỏ hàng khi logout (không xoá backend)
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

// Hook để sử dụng CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được dùng trong CartProvider");
  }
  return context;
};
