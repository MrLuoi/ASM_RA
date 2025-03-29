import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface IRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: "user" | "admin";
}

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRegister>();

  const registerMutation = useMutation({
    mutationFn: async (userData: Omit<IRegister, "confirmPassword">) => {
      await axios.post("http://localhost:3000/register", userData);
    },
    onSuccess: () => {
      toast.success("Đăng ký thành công!");
      navigate("/login");
    },
    onError: () => {
      toast.error("Đăng ký thất bại!");
    },
  });

  const onSubmit = (values: IRegister) => {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate({ ...userData, role: userData.role || "user" });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Đăng Ký</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium">Tên đăng nhập</label>
            <input
              {...register("username", { required: "Tên đăng nhập là bắt buộc" })}
              className="w-full border p-2 rounded"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email là bắt buộc" })}
              className="w-full border p-2 rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Mật khẩu</label>
            <input
              type="password"
              {...register("password", { required: "Mật khẩu là bắt buộc", minLength: { value: 6, message: "Ít nhất 6 ký tự" } })}
              className="w-full border p-2 rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Xác nhận mật khẩu</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Xác nhận mật khẩu là bắt buộc",
                validate: (value) => value === watch("password") || "Mật khẩu không khớp!",
              })}
              className="w-full border p-2 rounded"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Vai trò</label>
            <select
              {...register("role")}
              className="w-full border p-2 rounded"
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
