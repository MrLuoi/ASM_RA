import { Form, Input, Button, Card, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Ilogin from "../interfaces/user";


function Login() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (userData: Ilogin) => {
      await axios.post("http://localhost:3000/login", userData);
    },
    onSuccess: () => {
      toast.success("✅ Đăng nhập thành công!");
      navigate("/admin/list");
    },
    onError: () => {
      message.error(" Đăng nhập thất bại!");
    },
  });

  const onFinish = (values: Ilogin) => {
    loginMutation.mutate(values);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title="🔑 Đăng Nhập" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          {/* Email */}
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>
            <Input />
          </Form.Item>

          {/* Mật khẩu */}
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
            <Input.Password />
          </Form.Item>

          {/* Nút đăng nhập */}
          <Button type="primary" htmlType="submit" block>
            Đăng Nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
