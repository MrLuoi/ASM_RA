import React, { useState } from "react";
import { useCart } from "../../cart/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = location.state?.buyNowProduct || null;
  const productsToCheckout = buyNowProduct ? [buyNowProduct] : cartItems;

  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cash",
  });

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const totalPrice = productsToCheckout.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });

    // Clear lỗi khi đang gõ
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", address: "", phone: "" };
    const phoneRegex = /^0\d{9}$/;

    if (!customer.name.trim() || customer.name.length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự.";
      valid = false;
    }

    if (!customer.address.trim() || customer.address.length < 5) {
      newErrors.address = "Địa chỉ phải có ít nhất 5 ký tự.";
      valid = false;
    }

    if (!phoneRegex.test(customer.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng 0.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) return;

    // Kiểm tra số lượng trong kho
    for (const item of productsToCheckout) {
      try {
        const { data: productInStock } = await axios.get(`http://localhost:3000/products/${item.id}`);
        if (productInStock.quantity < (item.quantity || 1)) {
          alert(`Sản phẩm "${item.name}" không đủ số lượng trong kho!`);
          return;
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra số lượng sản phẩm:", error);
        alert("Đã xảy ra lỗi khi kiểm tra số lượng sản phẩm!");
        return;
      }
    }

    const orderDate = new Date().toISOString().split("T")[0];

    const orderData = {
      customerName: customer.name.trim(),
      address: customer.address.trim(),
      phone: customer.phone,
      paymentMethod: customer.paymentMethod,
      totalPrice,
      status: "pending",
      orderDate,
      products: productsToCheckout.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
    };

    try {
      await axios.post("http://localhost:3000/orders", orderData);
      alert("Đơn hàng của bạn đã được đặt thành công!");

      // Cập nhật số lượng sản phẩm
      for (const item of productsToCheckout) {
        const cartQuantity = item.quantity || 1;
        const { data: productInStock } = await axios.get(`http://localhost:3000/products/${item.id}`);
        const updatedQuantity = productInStock.quantity - cartQuantity;

        await axios.patch(`http://localhost:3000/products/${item.id}`, {
          quantity: updatedQuantity,
        });
      }

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
          className="form-control mb-1"
          value={customer.name}
          onChange={handleChange}
        />
        {errors.name && <small className="text-danger">{errors.name}</small>}

        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          className="form-control mb-1"
          value={customer.address}
          onChange={handleChange}
        />
        {errors.address && <small className="text-danger">{errors.address}</small>}

        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          className="form-control mb-1"
          value={customer.phone}
          onChange={handleChange}
        />
        {errors.phone && <small className="text-danger">{errors.phone}</small>}

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
