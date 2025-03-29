import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || user.name || "Admin";

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
    <nav className="navbar admin-navbar">
      <div className="logo">
        <Link to="/admin/dashboard">Admin Panel</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/list">Quản lý Sản phẩm</Link></li>
        <li><Link to="/admin/orders">Quản lý Đơn hàng</Link></li>
        <li><Link to="/admin/users">Quản lý Người dùng</Link></li>
      </ul>

      <div className="auth-links">
        {isLoggedIn ? (
          <div className="user-info">
            <span>Xin chào, {username}!</span>
            <button onClick={handleLogout} className="btn btn-danger">Đăng xuất</button>
          </div>
        ) : (
          <Link to="/login" className="login">Đăng nhập</Link>
        )}
      </div>
    </nav>
  );
}
