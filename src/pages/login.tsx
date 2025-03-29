import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface ILogin {
  email: string;
  password: string;
}

interface IUser {
  username: string;
  role: "admin" | "user";
}

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const loginMutation = useMutation({
    mutationFn: async (userData: ILogin) => {
      const response = await axios.post("http://localhost:3000/login", userData);
      return response.data;
    },
    onSuccess: (data) => {
      const token = data.accessToken;
      const user: IUser = data.user || { username: "Khách", role: "user" };

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("✅ Đăng nhập thành công!");

        navigate(user.role === "admin" ? "/admin/list" : "/");
        window.location.reload();
      } else {
        toast.error("Không nhận được token từ server!");
      }
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as any)?.message || "Đăng nhập thất bại!";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: ILogin) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">🔑 Đăng Nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Vui lòng nhập email hợp lệ!" })}
              className="w-full border p-2 rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Mật khẩu</label>
            <input
              type="password"
              {...register("password", { required: "Vui lòng nhập mật khẩu!" })}
              className="w-full border p-2 rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
