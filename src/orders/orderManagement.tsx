import { useEffect, useState } from "react";
import axios from "axios";
import "./OrderManagement.css";

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/orders");
      const ordersWithDefaultProducts = res.data.map(order => ({
        ...order,
        products: order.products || []
      }));
      setOrders(ordersWithDefaultProducts);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:3000/orders/${id}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "accepted":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("vi-VN");
  };

  return (
    <div className="order-management">
      <h1>Quản lý đơn hàng</h1>

      <div className="filter">
        <label>Lọc theo trạng thái:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="accepted">Đã xác nhận</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>SĐT</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày đặt hàng</th>
            <th>Sản phẩm đã mua</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.code}</td>
              <td>{order.customerName}</td>
              <td>{order.phone}</td>
              <td>{(order.totalPrice || 0).toLocaleString()}đ</td>
              <td>{getStatusText(order.status)}</td>
              <td>{formatDate(order.orderDate)}</td> {/* Hiển thị ngày đặt hàng */}
              <td>
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product: any, index: number) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>{(product.price || 0).toLocaleString()}đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td>
                {order.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleStatusChange(order.id, "accepted")}
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, "cancelled")}
                      style={{ marginLeft: "8px", backgroundColor: "red", color: "white" }}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <span style={{ color: "#888" }}>Đã xử lý</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
