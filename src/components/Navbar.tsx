import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">LOGO</div>

      {/* Menu */}
      <ul className="nav-links">
        <li>
          <Link to="/">Trang chủ</Link>
        </li>
        <li>
          <Link to="/">Sản phẩm</Link>
        </li>
        <li>
          <Link to="/contact">Liên hệ</Link>
        </li>
        <li>
          <Link to="/cart">Giỏ hàng</Link>
        </li>
      </ul>

      {/* Đăng nhập / Đăng ký */}
      <div className="auth-links">
        <Link to="/login" className="login">Đăng nhập</Link>
        <Link to="/register" className="register">Đăng ký</Link>
      </div>
    </nav>
  );
}
