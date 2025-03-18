import { Table, Button, Popconfirm, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductList() {
  const queryClient = useQueryClient();

  // Lấy danh sách sản phẩm
  const getAllProducts = async () => {
    const { data } = await axios.get("http://localhost:3000/products");
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const deleteProduct = async (id: number) => {
    await axios.delete(`http://localhost:3000/products/${id}`);
  };

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      message.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa sản phẩm!");
    },
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <img src={image} alt="product" width={50} />,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
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

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;

  return <Table dataSource={data} columns={columns} rowKey="id" />;
}

export default ProductList;
