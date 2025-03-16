import { Route, Routes } from "react-router-dom";
import ProductList from "./pages/product/list";
import ProductAdd from "./pages/product/add";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductEdit from "./pages/product/edit";
import  Layout  from "./pages/Layout";

function App() {

  return (
    <>
      <Routes>
        <Route path="/admin" element={<Layout/>}/>
        <Route path="admin/list" element={<ProductList/>}/>
        <Route path="admin/add" element={<ProductAdd/>}/>
        <Route path="admin/edit/:id" element={<ProductEdit/>}/>
      </Routes>
    </>
  );
}

export default App;
