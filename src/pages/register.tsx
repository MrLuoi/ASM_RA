import { Form, Input, Button, Card ,message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import IRegister from "../interfaces/user";


function Register() {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async (userData: Omit<IRegister, "confirmPassword">) => {
      await axios.post("http://localhost:3000/register", userData);
    },
    onSuccess: () => {
      toast.success("✅ Đăng ký thành công!");
      navigate("/login");
    },
    onError: () => {
      message.error("✅ Đăng ký thất bại!");
    },
  });

  const onFinish = (values: IRegister) => {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title="Đăng Ký" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return value === getFieldValue("password") ? Promise.resolve() : Promise.reject("Mật khẩu không khớp!");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng Ký
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Register;
