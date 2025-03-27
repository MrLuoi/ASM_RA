import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const productsPerPage = 6; // Giới hạn 6 sản phẩm trên 1 trang

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3000/products", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        let filteredProducts = response.data;

        // Tìm kiếm theo tên sản phẩm
        if (searchTerm) {
          filteredProducts = filteredProducts.filter((product: any) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Lọc theo danh mục
        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(
            (product: any) => product.category === selectedCategory
          );
        }

        setProducts(filteredProducts);

        // Tính tổng số trang
        setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory]);

  // Lấy danh sách danh mục từ API (Giả sử API có endpoint này)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="homepage">
      <div className="banner">
        <img
          src="https://cdn.fast.vn/tmp/20220815141746-banner_tbdt_2400x300px.jpg"
          alt="Banner"
        />
      </div>

      <div className="container mt-4">
        <h1 className="title text-center">Danh Sách Sản Phẩm</h1>

        {/* Thanh tìm kiếm và lọc danh mục */}
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearch}
          />

          <select
            className="form-control w-25"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Tất cả danh mục</option>
            <option value="Điện thoại">Điện thoại</option>
            <option value="Phụ kiện">Phụ kiện</option>
            <option value="Laptop">Laptop</option>
            <option value="Máy tính bảng">Máy tính bảng</option>
          </select>

        </div>

        {/* Hiển thị danh sách sản phẩm */}
        <div className="row">
          {products.length > 0 ? (
            products
              .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
              .map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text flex-grow-1">{product.description}</p>
                      <p className="card-text text-danger fw-bold">
                        {product.price.toLocaleString()} VND
                      </p>
                      <Link
                        to={`/product/${product.id}`}
                        className="btn btn-primary mt-auto"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center">Không tìm thấy sản phẩm nào.</p>
          )}
        </div>

        {/* Phân trang */}
        <nav className="pagination-container mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                «
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
              >
                »
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Homepage;
