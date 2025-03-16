import { Form, Input, Button, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addOrderMutation = useMutation({
    mutationFn: async (newOrder: any) => {
      await axios.post("http://localhost:3000/orders", newOrder);
    },
    onSuccess: () => {
      message.success("Thêm đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/");
    },
    onError: () => {
      message.error("Thêm đơn hàng thất bại!");
    },
  });

  const onFinish = (values: any) => {
    addOrderMutation.mutate(values);
  };

  return (
    <div>
      <h1>Thêm đơn hàng</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên khách hàng" name="customerName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Sản phẩm" name="productName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Số lượng" name="quantity" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Button type="primary" htmlType="submit">Thêm</Button>
      </Form>
    </div>
  );
}

export default ProductAdd;
