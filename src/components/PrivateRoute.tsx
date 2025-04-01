import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Kiểm tra nếu người dùng đã đăng nhập
const PrivateRoute = () => {
  const isLoggedIn = !!localStorage.getItem("token"); // Kiểm tra token trong localStorage

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
