import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);

  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
      console.error("Error parsing user data:", e);
      return {};
    }
  };

  const user = getUserData();
  const username = user.username || user.name || "Admin";

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      const userData = getUserData();

      console.log("Checking login status...");
      console.log("Token in LocalStorage:", token);
      console.log("Role in LocalStorage:", storedRole);
      console.log("User data:", userData);

      if (!token) {
        setIsLoggedIn(false);
        navigate("/login");
        return;
      }

      // Check role from userData first, then storedRole, then JWT
      let userRole = userData.role || storedRole;
      if (!userRole && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userRole = payload.role || (payload.isAdmin ? "admin" : "user");
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }

      if (userRole === "admin") {
        setIsAdmin(true);
        setIsLoggedIn(true);
      } else {
        console.warn("Access denied - Not an admin role:", userRole);
        setIsAdmin(false);
        setIsLoggedIn(true);
        navigate("/");
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
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link to="/admin/dashboard" className="navbar-brand">Admin Panel</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
          <li className="nav-item">
              <Link to="" className="nav-link active" aria-current="page">Trang chủ </Link>
            </li>
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