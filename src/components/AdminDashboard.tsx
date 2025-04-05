import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0); // Tổng số lượng thực
  const [orderCount, setOrderCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, productRes, orderRes] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/products"),
          axios.get("http://localhost:3000/orders"),
        ]);

        const users = userRes.data;
        const products = productRes.data;
        const orders = orderRes.data;

        // Tính tổng số lượng sản phẩm
        const totalProductQuantity = products.reduce(
          (acc: number, product: any) => acc + (product.quantity || 0),
          0
        );

        const revenue = orders.reduce(
          (acc: number, order: any) => acc + (order.totalPrice || 0),
          0
        );

        setUserCount(users.length);
        setProductCount(totalProductQuantity);
        setOrderCount(orders.length);
        setTotalRevenue(revenue);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Tổng quan</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Tổng người dùng</h3>
          <p>{userCount}</p>
        </div>
        <div className="card">
          <h3>Tổng số lượng sản phẩm</h3>
          <p>{productCount}</p>
        </div>
        <div className="card">
          <h3>Tổng đơn hàng</h3>
          <p>{orderCount}</p>
        </div>
        <div className="card">
          <h3>Doanh thu</h3>
          <p>{totalRevenue.toLocaleString()}đ</p>
        </div>
      </div>
    </div>
  );
}
