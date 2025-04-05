import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || user.name || "Admin";
  const userRole = user.role || ""; // Giả sử role được lưu trữ trong thông tin người dùng

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "admin") {
        navigate("/login"); // Chuyển hướng về trang login nếu không phải admin hoặc không đăng nhập
      } else {
        setIsLoggedIn(true); // Nếu là admin và đã đăng nhập
      }
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role"); // Xóa role khi đăng xuất
    setIsLoggedIn(false);
    navigate("/login"); // Chuyển hướng về trang login khi đăng xuất
  };

  if (!isLoggedIn) {
    return null; // Không render AdminNavbar nếu chưa đăng nhập hoặc không phải admin
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link to="/admin/dashboard" className="navbar-brand">Admin Panel</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link active" aria-current="page">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/list" className="nav-link">Quản lý Sản phẩm</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/orders" className="nav-link">Quản lý Đơn hàng</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/users" className="nav-link">Quản lý Người dùng</Link>
            </li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <span className="text-white me-2">Xin chào, {username}!</span>
          <button onClick={handleLogout} className="btn btn-outline-light">Đăng xuất</button>
        </div>
      </div>
    </nav>
  );
}
