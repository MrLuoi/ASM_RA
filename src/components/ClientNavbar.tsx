import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function ClientNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || user.name || "Khách";

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">MyShop</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/products">Sản phẩm</Link></li>
        <li><Link to="/contact">Liên hệ</Link></li>
        <li><Link to="/cart">Giỏ hàng</Link></li>
      </ul>

      <div className="auth-links">
        {isLoggedIn ? (
          <div className="user-info">
            <span>Xin chào, {username}!</span>
            <button onClick={handleLogout} className="btn btn-danger">Đăng xuất</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="login">Đăng nhập</Link>
            <Link to="/register" className="register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}
