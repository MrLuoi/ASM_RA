import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Định nghĩa interface cho sản phẩm
interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: number;
  quantity?: number; // Thêm quantity vào interface
}

// Định nghĩa interface cho context
interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Lấy userId từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id || "guest"; // Dùng "guest" nếu chưa đăng nhập

  // Khởi tạo cart từ localStorage dựa trên userId
  const [cartItems, setCartItems] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem(`cart_${userId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Lưu cart vào localStorage mỗi khi cartItems hoặc userId thay đổi
  useEffect(() => {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
  }, [cartItems, userId]);

  // Cập nhật cart khi userId thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUserId = updatedUser.id || "guest";
      const savedCart = localStorage.getItem(`cart_${updatedUserId}`);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange(); // Kiểm tra ngay khi component mount

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
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

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};