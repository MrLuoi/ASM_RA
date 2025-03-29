import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const productsPerPage = 8; // Hiển thị 8 sản phẩm mỗi trang

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        let filteredProducts = response.data;

        if (searchTerm) {
          filteredProducts = filteredProducts.filter((product: any) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(
            (product: any) => product.category === selectedCategory
          );
        }

        setProducts(filteredProducts);
        setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory]);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="homepage">
      <div className="banner">
        <img
          src="https://cdn.fast.vn/tmp/20220815141746-banner_tbdt_2400x300px.jpg"
          alt="Banner"
        />
      </div>

      <div className="container">
        <h1 className="title">Danh Sách Sản Phẩm</h1>

        {/* Thanh tìm kiếm & bộ lọc */}
        <div className="filter-container">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            <option value="Điện thoại">Điện thoại</option>
            <option value="Phụ kiện">Phụ kiện</option>
            <option value="Laptop">Laptop</option>
            <option value="Máy tính bảng">Máy tính bảng</option>
          </select>
        </div>

        {/* Hiển thị sản phẩm */}
        <div className="product-grid">
          {products.length > 0 ? (
            products
              .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
              .map((product) => (
                <div key={product._id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-img" />
                  <div className="product-info">
                    <h5 className="product-title">{product.name}</h5>
                    <p className="product-desc">{product.description}</p>
                    <p className="product-price">{product.price.toLocaleString()} VND</p>
                    <Link to={`/product/${product.id}`} className="btn-view">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))
          ) : (
            <p className="no-products">Không tìm thấy sản phẩm nào.</p>
          )}
        </div>

        {/* Phân trang */}
        <div className="pagination">
          <button className="page-btn" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
            «
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button className="page-btn" disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
