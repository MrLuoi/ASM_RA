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
      // Đảm bảo mỗi đơn hàng đều có mảng 'products', nếu không có thì gán mảng rỗng
      const ordersWithDefaultProducts = res.data.map(order => ({
        ...order,
        products: order.products || [] // Gán mảng rỗng nếu 'products' không tồn tại
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

  const handleDeleteOrder = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
      try {
        await axios.delete(`http://localhost:3000/orders/${id}`);
        fetchOrders();
      } catch (err) {
        console.error("Lỗi khi xóa đơn hàng:", err);
      }
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

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
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="accepted">Đã xác nhận</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteOrder(order.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
