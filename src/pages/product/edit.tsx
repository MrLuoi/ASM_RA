import { Form, Input, Button, Select, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const categories = ["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"];

function ProductEdit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams(); // Lấy ID từ URL

  // Lấy dữ liệu sản phẩm cần chỉnh sửa
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/products/${id}`);
      return data;
    },
    enabled: !!id, // Chỉ chạy khi có ID
  });

  // Hàm cập nhật sản phẩm
  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct: any) => {
      await axios.put(`http://localhost:3000/products/${id}`, updatedProduct);
    },
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
    onError: () => {
      message.error("Cập nhật sản phẩm thất bại!");
    },
  });

  // Khi submit form
  const onFinish = (values: any) => {
    updateProductMutation.mutate(values);
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;

  return (
    <div>
      <h1>Chỉnh sửa sản phẩm</h1>
      <Form layout="vertical" onFinish={onFinish} initialValues={product}>
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
        <Button type="primary" htmlType="submit">Cập nhật</Button>
      </Form>
    </div>
  );
}

export default ProductEdit;
