import { Form, Input, Button, Select, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addOrder } from "../api/oders";

const { Option } = Select;

function ProductAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Mutation để thêm đơn hàng
  const { mutate, isPending } = useMutation({
    mutationFn: addOrder,
    onSuccess: () => {
      message.success("Thêm đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["orders"] }); // Cập nhật lại danh sách
      navigate("/");
    },
    onError: (error: any) => {
      message.error(`Thêm đơn hàng thất bại! ${error.response?.data?.message || ""}`);
    },
  });

  // Gửi form
  const onFinish = (values: any) => {
    mutate(values);
  };

  return (
    <div>
      <h1>Thêm đơn hàng</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên khách hàng" name="customerName" rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Sản phẩm" name="productName" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Đơn vị tính" name="unit" rules={[{ required: true, message: "Vui lòng chọn đơn vị tính!" }]}>
          <Select placeholder="Chọn đơn vị tính">
            <Option value="cái">Cái</Option>
            <Option value="hộp">Hộp</Option>
            <Option value="kg">Kg</Option>
            <Option value="chai">Chai</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}>
          <Input type="number" min={1} />
        </Form.Item>
        <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
          <Input type="number" min={1} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending}>
          {isPending ? "Đang thêm..." : "Thêm"}
        </Button>
      </Form>
    </div>
  );
}

export default ProductAdd;
