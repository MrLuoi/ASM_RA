import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import "./register.css";

interface IRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
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
    registerMutation.mutate({ ...userData, role: "user" });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Đăng Ký</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div>
            <label>Tên đăng nhập</label>
            <input
              {...register("username", { required: "Tên đăng nhập là bắt buộc" })}
              className="register-input"
            />
            {errors.username && <p className="error-message">{errors.username.message}</p>}
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email là bắt buộc" })}
              className="register-input"
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: { value: 6, message: "Ít nhất 6 ký tự" },
              })}
              className="register-input"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <div>
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Xác nhận mật khẩu là bắt buộc",
                validate: (value) =>
                  value === watch("password") || "Mật khẩu không khớp!",
              })}
              className="register-input"
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className="register-button">
            Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
