import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import "./edit.css"; // Import CSS thuần

const categories = ["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"];

function ProductEdit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      price: "",
      quantity: "",
      category: "",
    },
  });

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/products/${id}`);
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("image", product.image);
      setValue("price", product.price);
      setValue("quantity", product.quantity);
      setValue("category", product.category);
    }
  }, [product, setValue]);

  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct) => {
      await axios.put(`http://localhost:3000/products/${id}`, updatedProduct);
    },
    onSuccess: () => {
      alert("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
    onError: () => {
      alert("Cập nhật sản phẩm thất bại!");
    },
  });

  const onSubmit = (values) => {
    const payload = {
      ...values,
      price: Number(values.price),
      quantity: Number(values.quantity),
    };
    updateProductMutation.mutate(payload);
  };

  if (isLoading) return <p className="loading">Đang tải dữ liệu...</p>;
  if (error) return <p className="error">Đã xảy ra lỗi khi tải dữ liệu.</p>;

  return (
    <div className="product-edit-container">
      <h1 className="title">Chỉnh sửa sản phẩm</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="label">Tên sản phẩm</label>
          <input {...register("name", { required: true })} className="input" />
        </div>

        <div className="form-group">
          <label className="label">Mô tả</label>
          <textarea {...register("description", { required: true })} className="textarea"></textarea>
        </div>

        <div className="form-group">
          <label className="label">Hình ảnh</label>
          <input {...register("image", { required: true })} className="input" />
        </div>

        <div className="form-group">
          <label className="label">Giá</label>
          <input type="number" {...register("price", { required: true })} className="input" />
        </div>

        <div className="form-group">
          <label className="label">Số lượng</label>
          <input type="number" {...register("quantity", { required: true, min: 0 })} className="input" />
        </div>

        <div className="form-group">
          <label className="label">Danh mục</label>
          <select {...register("category", { required: true })} className="select">
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Cập nhật</button>
      </form>
    </div>
  );
}

export default ProductEdit;
