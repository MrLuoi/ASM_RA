import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

// Định nghĩa interface cho user
interface User {
  username?: string;
  name?: string;
  role?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");
  const username: string = user.username || user.name || "Admin";

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (!token) navigate("/login");
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [navigate]);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/admin">Admin Panel</Link>
        </div>
        <div className="user-info">
          <span>Xin chào, {username}!</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* Container */}
      <div className="admin-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <Link to="/admin/dashboard">Tổng quan</Link>
            </li>
            <li>
              <Link to="/admin/users">Quản lý người dùng</Link>
            </li>
            <li>
              <Link to="/admin/products">Quản lý sản phẩm</Link>
            </li>
            <li>
              <Link to="/admin/orders">Quản lý đơn hàng</Link>
            </li>
            <li>
              <Link to="/admin/settings">Cài đặt</Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <h1>Tổng quan</h1>
          <div className="dashboard-cards">
            <div className="card">
              <h3>Tổng người dùng</h3>
              <p>1,245</p>
            </div>
            <div className="card">
              <h3>Tổng sản phẩm</h3>
              <p>350</p>
            </div>
            <div className="card">
              <h3>Tổng đơn hàng</h3>
              <p>87</p>
            </div>
            <div className="card">
              <h3>Doanh thu</h3>
              <p>$12,450</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}