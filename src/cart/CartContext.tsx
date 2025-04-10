import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  logout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const getUserFromStorage = useCallback(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const storedToken = localStorage.getItem("token");

      const idAsNumber = parseInt(storedUser?.id, 10);
      setUserId(!isNaN(idAsNumber) ? idAsNumber : null);
      setToken(storedToken ?? null);
    } catch {
      setUserId(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    getUserFromStorage();
    window.addEventListener("storage", getUserFromStorage);
    window.addEventListener("focus", getUserFromStorage);
    return () => {
      window.removeEventListener("storage", getUserFromStorage);
      window.removeEventListener("focus", getUserFromStorage);
    };
  }, [getUserFromStorage]);

  const fetchCart = useCallback(async () => {
    const localKey = token ? `cart_${token}` : "cart";
    const localCart: CartItem[] = JSON.parse(localStorage.getItem(localKey) || "[]");

    if (localCart.length > 0) {
      setCartItems(localCart);
    }

    if (token && userId !== null) {
      try {
        const { data } = await axios.get(`${BASE_URL}/cart?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.length > 0) {
          setCartItems(data[0].items || []);
        } else {
          await axios.post(
            `${BASE_URL}/cart`,
            { userId, items: localCart },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng từ server:", err);
      }
    }
  }, [token, userId]);

  useEffect(() => {
    if (token && userId !== null) {
      fetchCart();
    }
  }, [token, userId, fetchCart]);

  const syncCart = useCallback(async () => {
    const localKey = token ? `cart_${token}` : "cart";
    localStorage.setItem(localKey, JSON.stringify(cartItems));

    if (token && userId !== null) {
      try {
        const res = await axios.get(`${BASE_URL}/cart?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartId = res.data[0]?.id;
        if (cartId) {
          await axios.patch(
            `${BASE_URL}/cart/${cartId}`,
            { items: cartItems },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (err) {
        console.error("Lỗi khi sync giỏ hàng:", err);
      }
    }
  }, [cartItems, token, userId]);

  useEffect(() => {
    const timer = setTimeout(syncCart, 500);
    return () => clearTimeout(timer);
  }, [cartItems, syncCart]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity < 1) {
      alert("Số lượng phải lớn hơn 0");
      return;
    }

    if (product.quantity !== undefined && quantity > product.quantity) {
      alert(`Chỉ còn ${product.quantity} sản phẩm trong kho`);
      return;
    }

    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        alert("Sản phẩm đã có trong giỏ hàng");
        return prev;
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    const localKey = token ? `cart_${token}` : "cart";
    localStorage.setItem(localKey, JSON.stringify([]));
  };

  const logout = () => {
    const localKey = token ? `cart_${token}` : "cart";
    localStorage.setItem(localKey, JSON.stringify(cartItems));

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUserId(null);
    setToken(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        logout,
      }}
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
