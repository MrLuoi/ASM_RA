import { Route, Routes, useLocation } from "react-router-dom";
import ProductList from "./pages/product/list";
import ProductAdd from "./pages/product/add";
import ProductEdit from "./pages/product/edit";
import Register from "./pages/register";
import Login from "./pages/login";
import Statistics from "./pages/Statistics";
import HomePage from "./homes/homePage";
import ProductDetail from "./homes/productDetail";
import ClientNavbar from "./components/ClientNavbar";
import AdminNavbar from "./components/AdminNavbar";
import Cart from "./pages/homes/Cart";
import Checkout from "./pages/homes/Checkout";
import UserManagement from "./components/UserManagement";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AdminDashboard from "./components/AdminDashboard";
import NotAuthorized from "./pages/NotAuthorized ";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Hiển thị AdminNavbar nếu là route admin, nếu không hiển thị ClientNavbar */}
      {isAdminRoute ? <AdminNavbar /> : <ClientNavbar />}

      <Routes>
        {/* Routes cho Admin được bảo vệ bởi PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="admin/list" element={<ProductList />} />
          <Route path="admin/add" element={<ProductAdd />} />
          <Route path="admin/edit/:id" element={<ProductEdit />} />
          <Route path="admin/statis" element={<Statistics />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
 
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Route>

        {/* Routes cho người dùng */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
      </Routes>

      {/* Hiển thị thông báo bằng react-hot-toast */}
      <Toaster />
    </>
  );
}

export default App;
