import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Sau vài giây sẽ chuyển hướng về trang login hoặc trang chủ
    }, 5000); // Chuyển hướng sau 5 giây

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bạn không phải là admin!</h1>
      <p>Chỉ admin mới có quyền truy cập vào các trang quản trị.</p>
      <p>Chúng tôi sẽ chuyển hướng bạn về trang đăng nhập trong ít giây...</p>
    </div>
  );
};

export default NotAuthorized;
