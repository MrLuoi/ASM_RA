import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import "./productDetail.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity?: number;
  categoryId: number;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Token không hợp lệ");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        fetchSimilarProducts(data.categoryId, data.id);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
        if (err.message === "Token không hợp lệ") {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
  }, [id, navigate]);

  const fetchSimilarProducts = (categoryId: number, currentProductId: number) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/products?categoryId=${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const filteredProducts = data.filter((item: Product) => item.id !== currentProductId);
        setSimilarProducts(filteredProducts);
      })
      .catch((err) => console.error("Lỗi khi lấy sản phẩm tương tự:", err));
  };

  const handleAddToCart = () => {
    if (product) {
      if (!product.quantity || product.quantity <= 0) {
        alert("Sản phẩm đã hết hàng");
        return;
      }
      addToCart(product, 1);
      alert("Thêm vào giỏ hàng thành công");
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (!product.quantity || product.quantity <= 0) {
        alert("Sản phẩm đã hết hàng");
        return;
      }
      navigate("/checkout", { state: { buyNowProduct: product } });
    }
  };

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-quantity">
            Số lượng còn lại:{" "}
            {product.quantity && product.quantity > 0 ? product.quantity : <span style={{ color: "red" }}>Hết hàng</span>}
          </p>
          <p className="product-price">{product.price.toLocaleString()} VND</p>
          <p className="product-description">{product.description}</p>
          <button className="buy-button" onClick={handleBuyNow} disabled={!product.quantity || product.quantity <= 0}>
            Mua ngay
          </button>
          <button className="add-to-cart-button" onClick={handleAddToCart} disabled={!product.quantity || product.quantity <= 0}>
            Thêm giỏ hàng
          </button>
        </div>
      </div>

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
