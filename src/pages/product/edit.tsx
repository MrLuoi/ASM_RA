import { Form, Input, Button, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/orders/${id}`);
      return data;
    },
  });

  const editOrderMutation = useMutation({
    mutationFn: async (updatedOrder: any) => {
      await axios.put(`http://localhost:3000/orders/${id}`, updatedOrder);
    },
    onSuccess: () => {
      message.success("Cập nhật đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/");
    },
    onError: () => {
      message.error("Cập nhật thất bại!");
    },
  });

  const onFinish = (values: any) => {
    editOrderMutation.mutate(values);
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <h1>Sửa đơn hàng</h1>
      <Form layout="vertical" onFinish={onFinish} initialValues={data}>
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
        <Button type="primary" htmlType="submit">Cập nhật</Button>
      </Form>
    </div>
  );
}

export default ProductEdit;
