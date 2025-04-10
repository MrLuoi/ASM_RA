import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import "./login.css";

interface ILogin {
  email: string;
  password: string;
}

interface IUser {
  id: string;
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
      const user: IUser = data.user;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user.id);

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
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">🔑 Đăng Nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email", { required: "Vui lòng nhập email hợp lệ!" })}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              {...register("password", { required: "Vui lòng nhập mật khẩu!" })}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="login-button"
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
