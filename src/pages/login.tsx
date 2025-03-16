import React from "react";
import { useForm } from "react-hook-form";
import Ilogin from "../interfaces/user";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Ilogin>();
  const navigate = useNavigate();

  const onSubmit = async (data: Ilogin) => {
    try {
      const res = await axios.post("http://localhost:3000/login", data);
      if (res) {
        localStorage.setItem("token", res.data.successToken);
      }
      toast.success("✅ Đăng nhập thành công!");
      navigate("/admin/list");
    } catch (error) {
      toast.error(`❌ ${(error as AxiosError).message}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">🔑 Đăng Nhập</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              
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

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100">
                🚀 Đăng Nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
