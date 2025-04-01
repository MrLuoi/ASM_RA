import { Route, Routes, useLocation } from "react-router-dom";
import ProductList from "./pages/product/list";
import ProductAdd from "./pages/product/add";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductEdit from "./pages/product/edit";
import Layout from "./pages/Layout";
import Register from "./pages/register";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import Statistics from "./pages/Statistics";
import HomePage from "./homes/homePage";
import "./App.css";
import ProductDetail from "./homes/productDetail";
import ClientNavbar from "./components/ClientNavbar";
import AdminNavbar from "./components/AdminNavbar";
import Cart from "./pages/homes/Cart";
import Checkout from "./pages/homes/Checkout";
import UserManagement from "./components/UserManagement";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <ClientNavbar />}
      <Routes>
        <Route path="admin/list" element={<ProductList />} />
        <Route path="admin/add" element={<ProductAdd />} />
        <Route path="admin/edit/:id" element={<ProductEdit />} />
        <Route path="admin/statis" element={<Statistics />} />
        <Route path="/admin/users" element={<UserManagement />} />



        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
