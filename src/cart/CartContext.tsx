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
  quantity?: number;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  logout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cập nhật userId và token từ localStorage và khôi phục giỏ hàng nếu có
  useEffect(() => {
    const getUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const storedToken = localStorage.getItem("token");
      setUserId(storedUser.id && storedToken ? storedUser.id : null);
      setToken(storedToken);
    };

    getUser();
    window.addEventListener("storage", getUser);
    window.addEventListener("focus", getUser);

    return () => {
      window.removeEventListener("storage", getUser);
      window.removeEventListener("focus", getUser);
    };
  }, []);

  // Lấy giỏ hàng từ server nếu có userId và token, ngược lại từ localStorage
  const fetchCart = useCallback(async () => {
    if (userId && token) {
      try {
        const res = await axios.get(`${BASE_URL}/cart?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = res.data[0];
        if (cartData) {
          setCartItems(cartData.items || []);
        } else {
          const newCart = { userId, items: [] };
          await axios.post(`${BASE_URL}/cart`, newCart, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItems([]);
        }
      } catch (error) {
        console.error("Lỗi khi fetch giỏ hàng từ server:", error);
      }
    } else {
      // Lấy giỏ hàng từ localStorage khi chưa đăng nhập
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(localCart);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Cập nhật server và localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    const syncCart = async () => {
      if (userId && token) {
        try {
          const res = await axios.get(`${BASE_URL}/cart?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const cartId = res.data[0]?.id;
          if (cartId) {
            await axios.patch(`${BASE_URL}/cart/${cartId}`, { items: cartItems }, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        } catch (err) {
          console.error("Lỗi khi cập nhật giỏ hàng:", err);
        }
      }
      // Lưu giỏ hàng vào localStorage với key là token để phân biệt người dùng
      if (token) {
        localStorage.setItem(`cart_${token}`, JSON.stringify(cartItems));
      }
    };

    const timer = setTimeout(syncCart, 500);
    return () => clearTimeout(timer);
  }, [cartItems, userId, token]);

  const addToCart = async (product: Product, quantity: number) => {
    if (quantity < 1) {
      alert("Số lượng phải lớn hơn 0");
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/products/${product.id}`);
      const productInStock = res.data;

      if (!productInStock.quantity || quantity > productInStock.quantity) {
        alert(`Sản phẩm chỉ còn ${productInStock.quantity} trong kho`);
        return;
      }

      setCartItems((prev) => {
        const exists = prev.find((item) => item.id === product.id);
        if (exists) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 0) + quantity }
              : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/products/${id}`);
      const productInStock = res.data;

      if (!productInStock.quantity || quantity > productInStock.quantity) {
        alert(`Chỉ còn ${productInStock.quantity} sản phẩm trong kho`);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (token) {
      localStorage.setItem(`cart_${token}`, JSON.stringify([]));
    }
  };

  const checkout = async () => {
    for (const item of cartItems) {
      try {
        const res = await axios.get(`${BASE_URL}/products/${item.id}`);
        const product = res.data;

        const updatedQuantity = product.quantity - (item.quantity || 1);
        if (updatedQuantity < 0) {
          alert(`Sản phẩm ${product.name} không đủ số lượng`);
          return;
        }

        await axios.patch(`${BASE_URL}/products/${item.id}`, {
          quantity: updatedQuantity,
        });
      } catch (err) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm:", err);
      }
    }

    clearCart(); // Sau khi đặt hàng xong thì xoá giỏ hàng
    alert("Đặt hàng thành công!");
  };

  const logout = () => {
    // Lưu giỏ hàng vào localStorage khi đăng xuất
    if (token) {
      localStorage.setItem(`cart_${token}`, JSON.stringify(cartItems));
    }

    // Đăng xuất
    setUserId(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Xoá giỏ hàng trong bộ nhớ
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
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
