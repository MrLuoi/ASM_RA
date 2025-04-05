import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./add.css"; // Import CSS thuần

const categories = ["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"];

function ProductAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      await axios.post("http://localhost:3000/products", newProduct);
    },
    onSuccess: () => {
      alert("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
    onError: () => {
      alert("Thêm sản phẩm thất bại!");
    },
  });

  const onSubmit = (values: any) => {
    // Chuyển giá và quantity về số nguyên
    const payload = {
      ...values,
      price: Number(values.price),
      quantity: Number(values.quantity),
    };
    addProductMutation.mutate(payload);
  };

  return (
    <div className="product-add-container">
      <h1 className="title">Thêm sản phẩm</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label className="label">Tên sản phẩm</label>
          <input type="text" {...register("name", { required: true })} className="input" />
        </div>

        <div className="form-group">
          <label className="label">Mô tả</label>
          <textarea {...register("description", { required: true })} className="textarea"></textarea>
        </div>

        <div className="form-group">
          <label className="label">Hình ảnh</label>
          <input type="text" {...register("image", { required: true })} className="input" />
        </div>

        <div className="form-group">
          <label className="label">Giá</label>
          <input type="number" {...register("price", { required: true, min: 0 })} className="input" />
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

        <button type="submit" className="submit-btn">Thêm</button>
      </form>
    </div>
  );
}

export default ProductAdd;
