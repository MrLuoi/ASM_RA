import { useState, useEffect } from "react";
import { Form, Input, Button, Select, Table, Modal } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const { Option } = Select;

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Trang chủ</h1>
      <p className="text-center text-gray-600">Chào mừng bạn đến với cửa hàng của chúng tôi!</p>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-md" />
      <p className="text-gray-600 mt-4">{product.description}</p>
      <p className="text-lg font-bold text-blue-500 mt-2">Giá: {product.price} VND</p>
    </div>
  );
};

const ProductFilterPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/products").then((res) => setProducts(res.data));
  }, []);

  const filteredProducts = category ? products.filter(p => p.category === category) : products;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Lọc sản phẩm</h1>
      <Select onChange={setCategory} className="w-full mb-6">
        <Option value="">Tất cả</Option>
        <Option value="Điện thoại">Điện thoại</Option>
        <Option value="Laptop">Laptop</Option>
        <Option value="Phụ kiện">Phụ kiện</Option>
      </Select>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-xl font-bold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold text-blue-500">{product.price} VND</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [categories] = useState(["Điện thoại", "Laptop", "Phụ kiện"]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/products").then((res) => setProducts(res.data));
  }, []);

  const onFinish = (values) => {
    if (editingProduct) {
      axios.put(`http://localhost:3000/products/${editingProduct.id}`, values).then(() => {
        setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...values } : p)));
        setEditingProduct(null);
        setIsModalOpen(false);
      });
    } else {
      axios.post("http://localhost:3000/products", values).then((res) => {
        setProducts([...products, res.data]);
        setIsModalOpen(false);
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/products/${id}`).then(() => {
      setProducts(products.filter((p) => p.id !== id));
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Quản lý sản phẩm</h1>
      <Button className="mb-4 bg-blue-500 text-white" onClick={() => setIsModalOpen(true)}>Thêm sản phẩm</Button>
      <Table dataSource={products} rowKey="id" pagination={{ pageSize: 5 }}>
        <Table.Column title="Tên sản phẩm" dataIndex="name" key="name" />
        <Table.Column title="Giá" dataIndex="price" key="price" />
        <Table.Column title="Danh mục" dataIndex="category" key="category" />
        <Table.Column
          title="Hành động"
          key="actions"
          render={(_, record) => (
            <>
              <Button onClick={() => handleEdit(record)} className="mr-2 bg-yellow-500 text-white">Sửa</Button>
              <Button onClick={() => handleDelete(record.id)} className="bg-red-500 text-white">Xóa</Button>
            </>
          )}
        />
      </Table>
      <Modal title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form layout="vertical" onFinish={onFinish} initialValues={editingProduct}>
          <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item label="Mô tả" name="description" rules={[{ required: true }]}> <Input.TextArea /> </Form.Item>
          <Form.Item label="Hình ảnh" name="image" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item label="Giá" name="price" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Danh mục" name="category" rules={[{ required: true }]}> <Select> {categories.map((cat) => (<Option key={cat} value={cat}>{cat}</Option>))} </Select> </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full bg-blue-500 text-white">{editingProduct ? "Cập nhật" : "Thêm"}</Button>
        </Form>
      </Modal>
    </div>
  );
};

export { HomePage, ProductDetailPage, ProductFilterPage, AdminPage };