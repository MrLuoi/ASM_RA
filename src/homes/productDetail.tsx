import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        fetchSimilarProducts(data.categoryId, data.id);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  }, [id]);

  const fetchSimilarProducts = (categoryId, currentProductId) => {
    fetch(`http://localhost:3000/products?categoryId=${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        const filteredProducts = data.filter((item) => item.id !== currentProductId);
        setSimilarProducts(filteredProducts);
      })
      .catch((err) => console.error("Lỗi khi lấy sản phẩm tương tự:", err));
  };

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-price">{product.price.toLocaleString()} VND</p>
          <p className="product-description">{product.description}</p>
          <button className="buy-button">Mua ngay</button>
        </div>
      </div>

      {/* Sản phẩm tương tự */}
      {similarProducts.length > 0 && (
        <div className="similar-products">
          <h2>Sản phẩm tương tự</h2>
          <div className="similar-products-list">
            {similarProducts.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id} className="similar-product-card">
                <img src={item.image} alt={item.name} className="similar-product-image" />
                <p className="similar-product-name">{item.name}</p>
                <p className="similar-product-price">{item.price.toLocaleString()} VND</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
