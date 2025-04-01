import React, { useState } from "react";
import { useCart } from "../../cart/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Kiểm tra có sản phẩm "Mua ngay" không
  const buyNowProduct = location.state?.buyNowProduct || null;
  const productsToCheckout = buyNowProduct ? [buyNowProduct] : cartItems;

  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cash",
  });

  const totalPrice = productsToCheckout.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    if (!customer.name || !customer.address || !customer.phone) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const orderData = {
      customerName: customer.name,
      address: customer.address,
      phone: customer.phone,
      paymentMethod: customer.paymentMethod,
      totalPrice,
      products: productsToCheckout.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
    };

    try {
      await axios.post("http://localhost:3000/orders", orderData);
      alert("Đơn hàng của bạn đã được đặt thành công!");
      
      // Chỉ xóa giỏ hàng nếu đặt hàng từ giỏ hàng
      if (!buyNowProduct) {
        clearCart();
      }

      navigate("/");
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  return (
    <div className="checkout container mt-4">
      <h1 className="text-center mb-4">Thanh Toán</h1>
      <div className="card p-3">
        <h3>Thông tin khách hàng</h3>
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          className="form-control mb-2"
          value={customer.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          className="form-control mb-2"
          value={customer.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          className="form-control mb-2"
          value={customer.phone}
          onChange={handleChange}
        />
        <select
          name="paymentMethod"
          className="form-control mb-3"
          value={customer.paymentMethod}
          onChange={handleChange}
        >
          <option value="cash">Thanh toán khi nhận hàng</option>
          <option value="credit">Thẻ tín dụng</option>
        </select>

        <h3>Đơn hàng</h3>
        <ul>
          {productsToCheckout.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity || 1} x {item.price.toLocaleString()} VND
            </li>
          ))}
        </ul>
        <h4>Tổng cộng: {totalPrice.toLocaleString()} VND</h4>

        <button className="btn btn-success mt-3" onClick={handleConfirmOrder}>
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
};

export default Checkout;
