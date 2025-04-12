import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Về MyShop</h4>
          <p>MyShop là nơi bạn tìm thấy những sản phẩm chất lượng với giá cả hợp lý. Hỗ trợ khách hàng 24/7.</p>
        </div>

        <div className="footer-section">
          <h4>Liên kết</h4>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/products">Sản phẩm</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/cart">Giỏ hàng</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Email: support@myshop.com</p>
          <p>Hotline: 0123 456 789</p>
          <p>Địa chỉ: Hà Nội</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MyShop. All rights reserved.</p>
      </div>
    </footer>
  );
}
