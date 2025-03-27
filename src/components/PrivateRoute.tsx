import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ role }: { role: "admin" | "user" }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || !user.role) {
    return <Navigate to="/login" />;
  }

  return user.role === role ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
