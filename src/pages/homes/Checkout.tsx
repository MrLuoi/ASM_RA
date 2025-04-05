import React, { useState } from "react";
import { useCart } from "../../cart/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu có sản phẩm "Mua ngay" thì lấy, nếu không thì lấy giỏ hàng
  const buyNowProduct = location.state?.buyNowProduct || null;
  const productsToCheckout = buyNowProduct ? [buyNowProduct] : cartItems;

  // State thông tin khách hàng
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cash",
  });

  // Tính tổng tiền đơn hàng
  const totalPrice = productsToCheckout.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  // Hàm xử lý thay đổi thông tin khách hàng
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // Hàm xử lý khi người dùng xác nhận đơn hàng
  const handleConfirmOrder = async () => {
    if (!customer.name || !customer.address || !customer.phone) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiểm tra số lượng sản phẩm trong kho
    for (const item of productsToCheckout) {
      try {
        const response = await axios.get(`http://localhost:3000/products/${item.id}`);
        const productInStock = response.data;

        // Kiểm tra nếu số lượng trong kho không đủ
        if (productInStock.quantity < item.quantity) {
          alert(`Sản phẩm ${item.name} không đủ số lượng trong kho!`);
          return;
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra số lượng sản phẩm:", error);
        alert("Đã xảy ra lỗi khi kiểm tra số lượng sản phẩm!");
        return;
      }
    }

    // Lấy ngày hiện tại
    const orderDate = new Date().toISOString().split("T")[0]; // Định dạng yyyy-mm-dd

    const orderData = {
      customerName: customer.name,
      address: customer.address,
      phone: customer.phone,
      paymentMethod: customer.paymentMethod,
      totalPrice,
      status: "pending", // Trạng thái mặc định là "pending"
      orderDate, // Thêm ngày đặt hàng vào đơn hàng
      products: productsToCheckout.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
    };

    try {
      // Gửi đơn hàng đến API
      const response = await axios.post("http://localhost:3000/orders", orderData);
      alert("Đơn hàng của bạn đã được đặt thành công!");

      // Cập nhật lại quantity của từng sản phẩm trong DB theo đúng số lượng đã đặt
      for (const item of productsToCheckout) {
        // Lấy số lượng đã đặt từ giỏ hàng
        const cartQuantity = item.quantity || 1;

        // Lấy thông tin sản phẩm từ cơ sở dữ liệu
        const response = await axios.get(`http://localhost:3000/products/${item.id}`);
        const productInStock = response.data;

        // Tính số lượng còn lại trong kho
        const updatedQuantity = productInStock.quantity - cartQuantity;

        // Cập nhật số lượng trong cơ sở dữ liệu nếu đủ số lượng
        if (updatedQuantity >= 0) {
          await axios.patch(`http://localhost:3000/products/${item.id}`, {
            quantity: updatedQuantity,
          });
        } else {
          alert(`Sản phẩm ${item.name} không đủ số lượng trong kho sau khi đặt!`);
          return;
        }
      }

      // Nếu là đơn hàng "Mua ngay", không cần xóa giỏ hàng
      if (!buyNowProduct) {
        clearCart();
      }

      navigate("/"); // Điều hướng về trang chủ sau khi đặt hàng thành công
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
