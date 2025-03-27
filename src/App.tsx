import { Route, Routes } from "react-router-dom";
import ProductList from "./pages/product/list";
import ProductAdd from "./pages/product/add";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductEdit from "./pages/product/edit";
import  Layout  from "./pages/Layout";
import Register from "./pages/register";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import Statistics from "./pages/Statistics";
import HomePage from "./homes/homePage";
import './App.css';
import ProductDetail from "./homes/productDetail";
import Navbar from "./components/Navbar";
import Cart from "./pages/homes/Cart";
import Checkout from "./pages/homes/Checkout";


function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        {/* <Route path="/admin" element={<Layout/>}/> */}
        <Route path="admin/list" element={<ProductList/>}/>
        <Route path="admin/add" element={<ProductAdd/>}/>
        <Route path="admin/edit/:id" element={<ProductEdit/>}/>
        <Route path="admin/statis" element={<Statistics/>}/>

        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>

        <Route path='/' element={<HomePage/>} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Toaster/>

      
    </>
  );
}

export default App;
