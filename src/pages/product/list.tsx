import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./list.css"; // Import CSS thuần

function ProductList() {
  const queryClient = useQueryClient();
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

  if (isLoading) return <p className="loading">Đang tải dữ liệu...</p>;
  if (error) return <p className="error">Đã xảy ra lỗi khi tải dữ liệu.</p>;

  // Tính toán phân trang
  const totalPages = Math.ceil(data.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = data.slice(startIndex, endIndex);

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
              <td className="actions">
                <Link to={`/admin/edit/${product.id}`} className="edit-btn">
                  ✏️ Sửa
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
                      mutation.mutate(product.id);
                    }
                  }}
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
