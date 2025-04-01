import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate để chuyển hướng người dùng
import "./UserManagement.css"; // style tùy bạn

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate(); // Hook để chuyển hướng

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  const deleteUser = async (id: number) => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const token = localStorage.getItem("token");

    if (!token) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      alert("Bạn cần đăng nhập để xóa người dùng.");
      navigate("/login"); // Chuyển hướng đến trang login
      return;
    }

    // Nếu đã đăng nhập, yêu cầu xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này không?")) return;

    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      alert("Xóa user thành công");
    } catch (error) {
      console.error("Lỗi khi xoá người dùng:", error);
    }
  };

  return (
    <div className="user-management">
      <h2>Quản lý người dùng</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role || "user"}</td>
              <td>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="btn btn-danger"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
