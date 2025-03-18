import { Form, Input, Button, Select, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const categories = ["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"];

function ProductAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      await axios.post("http://localhost:3000/products", newProduct);
    },
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
    onError: () => {
      message.error("Thêm sản phẩm thất bại!");
    },
  });

  const onFinish = (values: any) => {
    addProductMutation.mutate(values);
  };

  return (
    <div>
      <h1>Thêm sản phẩm</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Hình ảnh" name="image" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Danh mục" name="category" rules={[{ required: true }]}>
          <Select placeholder="Chọn danh mục">
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit">Thêm</Button>
      </Form>
    </div>
  );
}

export default ProductAdd;
