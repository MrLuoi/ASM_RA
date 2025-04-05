import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./list.css"; // Import CSS thuần

function ProductList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Hook để chuyển hướng
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // 8 sản phẩm 1 trang

  // Lấy danh sách sản phẩm
  const getAllProducts = async () => {
    const { data } = await axios.get("http://localhost:3000/products");
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // Xóa sản phẩm từ API
  const deleteProduct = async (id: number) => {
    await axios.delete(`http://localhost:3000/products/${id}`);
  };

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      alert("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      alert("Có lỗi xảy ra khi xóa sản phẩm!");
    },
  });

  // Kiểm tra trạng thái tải dữ liệu
  if (isLoading) return <p className="loading">Đang tải dữ liệu...</p>;
  if (error) return <p className="error">Đã xảy ra lỗi khi tải dữ liệu.</p>;

  // Tính toán phân trang
  const totalPages = Math.ceil(data.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = data.slice(startIndex, endIndex);

  // Kiểm tra nếu người dùng đã đăng nhập (token có trong localStorage)
  const isLoggedIn = !!localStorage.getItem("token");

  // Xử lý khi nhấn vào nút Xóa
  const handleDelete = (productId: number) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    if (!token) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      alert("Bạn cần đăng nhập để xóa sản phẩm.");
      navigate("/login"); // Chuyển hướng đến trang login
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      mutation.mutate(productId);
    }
  };

  // Xử lý khi nhấn vào nút Sửa
  const handleEdit = (productId: number) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    if (!token) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      alert("Bạn cần đăng nhập để sửa sản phẩm.");
      navigate("/login"); // Chuyển hướng đến trang login
      return;
    }

    // Nếu đã đăng nhập, cho phép truy cập trang sửa
    navigate(`/admin/edit/${productId}`);
  };

  return (
    <div className="container">
      <h2 className="title">📦 Danh sách sản phẩm</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Mô tả</th>
            <th>Hình ảnh</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product: any) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td className="description">{product.description}</td>
              <td>
                <img src={product.image} alt="product" className="product-img" />
              </td>
              <td className="price">{product.price.toLocaleString()} đ</td>
              <td>{product.category}</td>
              <td>{product.quantity}</td>
              <td className="actions">
                {/* Kiểm tra đăng nhập trước khi cho phép sửa */}
                <button
                  onClick={() => handleEdit(product.id)} // Kiểm tra trước khi sửa
                  className="edit-btn"
                >
                  ✏️ Sửa
                </button>
                {/* Kiểm tra đăng nhập trước khi cho phép xóa */}
                <button
                  onClick={() => handleDelete(product.id)} // Kiểm tra trước khi xóa
                  className="delete-btn"
                >
                  🗑️ Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="page-btn"
        >
          ◀ Trang trước
        </button>
        <span className="page-number">Trang {currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="page-btn"
        >
          Trang sau ▶
        </button>
      </div>
    </div>
  );
}

export default ProductList;
