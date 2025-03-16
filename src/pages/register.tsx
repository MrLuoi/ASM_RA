import axios, { AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import IRegister from "../interfaces/user";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRegister>();
  const navigate = useNavigate();

  const onSubmit = async (data: IRegister) => {
    try {
      const { confirmPassword, ...userData } = data; // Xóa confirmPassword khi gửi API
      await axios.post("http://localhost:3000/users", userData);
      toast.success("✅ Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      toast.error(`❌ ${(error as AxiosError).message}`);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">📝 Đăng Ký</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Username */}
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-bold">
                  <i className="fas fa-user"></i> Tên đăng nhập
                </label>
                <input
                  {...register("username", {
                    required: "Vui lòng nhập tên đăng nhập!",
                    minLength: { value: 3, message: "Ít nhất 3 ký tự!" },
                  })}
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Nhập tên đăng nhập"
                />
                {errors.username && (
                  <span className="text-danger">{errors.username.message}</span>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">
                  <i className="fas fa-envelope"></i> Email
                </label>
                <input
                  {...register("email", {
                    required: "Vui lòng nhập email!",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Email không hợp lệ!",
                    },
                  })}
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Nhập email của bạn"
                />
                {errors.email && (
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">
                  <i className="fas fa-lock"></i> Mật khẩu
                </label>
                <input
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu!",
                    minLength: { value: 6, message: "Ít nhất 6 ký tự!" },
                  })}
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && (
                  <span className="text-danger">{errors.password.message}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-bold">
                  <i className="fas fa-lock"></i> Xác nhận mật khẩu
                </label>
                <input
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu!",
                    validate: (value) =>
                      value === watch("password") || "Mật khẩu không khớp!",
                  })}
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && (
                  <span className="text-danger">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100">
                🔐 Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
