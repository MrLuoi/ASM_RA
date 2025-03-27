import { useCart } from "../../cart/CartContext"; // Sửa đường dẫn import
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Cart.css";

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate(); // Hook để điều hướng

  // Tính tổng giá trị giỏ hàng
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  // Xử lý khi nhấn nút Checkout
  const handleCheckout = () => {
    navigate("/checkout"); // Điều hướng đến trang thanh toán
  };

  return (
    <div className="cart container mt-4">
      <h1 className="text-center mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="row">
            {cartItems.map((item) => (
              <div key={item.id} className="col-md-4 mb-3">
                <div className="card">
                  <img src={item.image} className="card-img-top" alt={item.name} />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text text-danger fw-bold">
                      {(item.price * (item.quantity || 1)).toLocaleString()} VND
                    </p>
                    <div className="quantity-control mb-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="total-section">
            <h3>Total: {totalPrice.toLocaleString()} VND</h3>
            <button className="btn btn-primary" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
