import React from "react";
import { useCart } from "../../cart/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart(); // Lấy clearCart từ context
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const handleConfirmOrder = () => {
    alert("Đơn hàng của bạn đã được đặt thành công!");
    clearCart(); // Xóa giỏ hàng sau khi thanh toán
    navigate("/"); // Chuyển về trang chủ
  };

  return (
    <div className="checkout container mt-4">
      <h1 className="text-center mb-4">Checkout</h1>
      <div className="card p-3">
        <h3>Order Summary</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity || 1} x {item.price.toLocaleString()} VND
            </li>
          ))}
        </ul>
        <h4>Total: {totalPrice.toLocaleString()} VND</h4>
        <button className="btn btn-success mt-3" onClick={handleConfirmOrder}>
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
