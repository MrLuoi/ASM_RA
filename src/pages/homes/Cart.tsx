import { useCart } from "../../cart/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios để gửi yêu cầu API
import "./Cart.css"; // Import CSS thuần

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Tính tổng tiền giỏ hàng
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  // Hàm xử lý khi nhấn nút "Thanh toán"
  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Hàm xử lý cập nhật số lượng sản phẩm trong giỏ hàng và cơ sở dữ liệu
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return; // Không cho phép số lượng nhỏ hơn hoặc bằng 0

    // Cập nhật giỏ hàng
    updateQuantity(itemId, newQuantity);

    try {
      // Gửi yêu cầu PATCH đến API để cập nhật số lượng trong cơ sở dữ liệu
      await axios.patch(`http://localhost:3000/products/${itemId}`, {
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      alert("Đã xảy ra lỗi khi cập nhật số lượng sản phẩm.");
    }
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
                      <button onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}>-</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
                    </div>
                  </td>
                  <td className="price">
                    {(item.price * (item.quantity || 1)).toLocaleString()} VND
                  </td>
                  <td>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-footer">
            <h3>Tổng: {totalPrice.toLocaleString()} VND</h3>
            <button className="checkout-btn" onClick={handleCheckout}>Thanh Toán</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
