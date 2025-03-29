import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

// Định nghĩa interface cho user
interface User {
  username?: string;
  name?: string;
  role?: string;
}

export default function ClientNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");
  const username: string = user.username || user.name || "Khách";
  const isAdmin: boolean = user.role === "admin";

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

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Xử lý điều hướng đến trang quản trị
  const handleAdminAccess = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      alert("Bạn không có quyền truy cập trang quản trị!");
    }
  };

  return (
    <nav className="navbar client">
      <div className="logo">
        <Link to="/">MyShop</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/products">Sản phẩm</Link></li>
        <li><Link to="/contact">Liên hệ</Link></li>
        <li><Link to="/cart">Giỏ hàng</Link></li>
        {isAdmin && (
          <li>
            <Link to="#" onClick={handleAdminAccess}>
              Quản trị
            </Link>
          </li>
        )}
      </ul>

      <div className="auth-links">
        {isLoggedIn ? (
          <div className="user-info">
            <span>Xin chào, {username}!</span>
            <button onClick={handleLogout} className="btn btn-danger">
              Đăng xuất
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="login">
              Đăng nhập
            </Link>
            <Link to="/register" className="register">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}