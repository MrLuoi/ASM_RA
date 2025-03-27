import { Form, Input, Button, Card, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface ILogin {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (userData: ILogin) => {
      const response = await axios.post("http://localhost:3000/login", userData);
      console.log("Phản hồi từ server:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      const token = data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data.user || { username: "Khách" }));
        toast.success("✅ Đăng nhập thành công!");
        navigate("/");
        window.location.reload();
      } else {
        message.error("Không nhận được token từ server!");
      }
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.response?.data?.message || "Đăng nhập thất bại!";
      message.error(errorMessage);
    },
  });

  const onFinish = (values: ILogin) => {
    loginMutation.mutate(values);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title="🔑 Đăng Nhập" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loginMutation.isPending}>
            Đăng Nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;