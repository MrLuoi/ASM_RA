import { useCart } from "../../cart/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./Cart.css";

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [productStock, setProductStock] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        const stockMap: Record<string, number> = {};
        response.data.forEach((product: any) => {
          stockMap[product.id] = product.quantity;
        });
        setProductStock(stockMap);
      } catch (err) {
        console.error("Lỗi lấy tồn kho sản phẩm", err);
      }
    };
    fetchStock();
  }, []);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    const stock = productStock[id] || 0;
    if (newQuantity <= 0) return;
    if (newQuantity > stock) {
      alert(`Chỉ còn ${stock} sản phẩm trong kho`);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Giỏ Hàng</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <span>{item.name}</span>
                  </td>
                  <td>{item.price.toLocaleString()} VND</td>
                  <td>
                    <div className="quantity-control">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-footer">
            <h3>Tổng: {totalPrice.toLocaleString()} VND</h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Thanh Toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
