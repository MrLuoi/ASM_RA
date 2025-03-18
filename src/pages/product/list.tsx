import { Table, Button, Popconfirm, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteOrder, getAllOrders } from "../api/oders";

function ProductList() {
  const queryClient = useQueryClient();

  // Lấy danh sách đơn hàng
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  // Xóa đơn hàng
  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      message.success("Xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] }); // Refresh lại danh sách
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa");
    },
  });

  // Định nghĩa cột cho bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
    { title: "Đơn vị tính", dataIndex: "unit", key: "unit" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
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
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger disabled={isPending}>
              {isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // Xử lý loading và lỗi
  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;

  return <Table dataSource={orders} columns={columns} rowKey="id" />;
}

export default ProductList;
