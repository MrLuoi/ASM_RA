import { Table, Button, Popconfirm, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductList() {
  const queryClient = useQueryClient();

  // Hàm lấy danh sách đơn hàng
  const getAllOrders = async () => {
    const { data } = await axios.get("http://localhost:3000/orders");
    return data;
  };

      const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  const deleteOrder = async (id: number) => {
    await axios.delete(`http://localhost:3000/orders/${id}`);
  };

  const mutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      message.success("Xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] }); // Refresh danh sách sau khi xóa
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa");
    },
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} đ`, // Định dạng giá tiền
    },
    {
      title: "Hành động",
      key: "actions",
      render: (record: any) => (
        <>
          <Link to={`/admin/edit/${record.id}`}>
            <Button type="primary" style={{ marginRight: 8 }}>Sửa</Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => mutation.mutate(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // Xử lý loading và lỗi
  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;

  return <Table dataSource={data} columns={columns} rowKey="id" />;
}

export default ProductList;
