import React, { useState } from "react";
import {
  Briefcase,
  User,
  Mail,
  Lock,
  ShieldCheck,
  UserPlus,
  Loader2,
  Linkedin,
  KeyRound,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useGoogleLogin } from "@react-oauth/google";

export default function Auth() {
  // --- STATES CƠ BẢN ---
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("candidate");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- STATES OTP ĐĂNG KÝ ---
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // --- STATES QUÊN MẬT KHẨU ---
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & Pass mới
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // THÊM MỚI

  // --- HANDLERS CHUNG ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
    setShowOTP(false);
    setIsForgotPassword(false);
  };

  // Quay lại màn hình đăng nhập bình thường
  const backToLogin = () => {
    setIsForgotPassword(false);
    setShowOTP(false);
    setResetStep(1);
    setError("");
    setOtpCode("");
    setNewPassword(""); // Clear pass cũ
    setConfirmNewPassword(""); // Clear pass xác nhận
  };

  // --- 1. XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp.");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
            role: role,
          },
        );
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          Swal.fire({
            title: "Thành công!",
            text: "Chào mừng quay trở lại!",
            icon: "success",
          });
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            username: formData.fullName,
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: role,
          },
        );
        if (response.data.success) {
          Swal.fire({
            title: "Đăng ký thành công!",
            text: "Mã OTP đã được gửi. Hãy check mail nhé!",
            icon: "success",
          });
          setShowOTP(true);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra!";
      setError(msg);
      Swal.fire({ title: "Lỗi", text: msg, icon: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. XỬ LÝ XÁC THỰC OTP ĐĂNG KÝ ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    if (!otpCode) return setError("Vui lòng nhập mã OTP!");

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-email",
        {
          email: formData.email,
          otp: otpCode,
        },
      );
      if (response.data.success) {
        Swal.fire({
          title: "Xác thực thành công!",
          text: "Tài khoản đã kích hoạt. Hãy đăng nhập!",
          icon: "success",
        });
        backToLogin();
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Mã OTP không đúng!");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. XỬ LÝ QUÊN MẬT KHẨU (GỬI OTP) ---
  const handleSendResetOTP = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email) return setError("Vui lòng nhập email!");

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email: formData.email },
      );
      if (response.data.success) {
        Swal.fire({
          title: "Đã gửi mã!",
          text: "Vui lòng kiểm tra email để lấy mã OTP đặt lại mật khẩu.",
          icon: "success",
        });
        setResetStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email không tồn tại!");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. XỬ LÝ ĐẶT LẠI MẬT KHẨU MỚI ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra rỗng
    if (!otpCode || !newPassword || !confirmNewPassword) {
      return setError("Vui lòng nhập đầy đủ mã OTP và mật khẩu mới!");
    }

    // Kiểm tra khớp mật khẩu (THÊM MỚI)
    if (newPassword !== confirmNewPassword) {
      return setError("Mật khẩu xác nhận không khớp!");
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email: formData.email,
          otp: otpCode,
          newPassword: newPassword,
        },
      );
      if (response.data.success) {
        Swal.fire({
          title: "Thành công!",
          text: "Mật khẩu đã được thay đổi. Hãy đăng nhập lại.",
          icon: "success",
        });
        backToLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi xác thực!");
    } finally {
      setIsLoading(false);
    }
  };

  //Thêm hàm xử lý Google Login này vào dưới cụm HANDLERS
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Gửi access_token của Google xuống Backend của bạn
        const response = await axios.post(
          "http://localhost:5000/api/auth/google",
          {
            accessToken: tokenResponse.access_token,
            role: role, // Gửi kèm role user đang chọn (Candidate/Employer)
          },
        );

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          Swal.fire({
            title: "Thành công!",
            text: "Đăng nhập Google thành công!",
            icon: "success",
          });
          // Chuyển hướng user vào trang chủ...
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Lỗi khi đăng nhập bằng Google!",
        );
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Đăng nhập Google thất bại!"),
  });
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200 font-sans py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-8 transition-colors duration-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-4 border border-blue-100 dark:border-blue-500/20">
            {isForgotPassword ? (
              <KeyRound className="w-6 h-6 text-blue-600" />
            ) : showOTP ? (
              <Mail className="w-6 h-6 text-blue-600" />
            ) : isLogin ? (
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            ) : (
              <UserPlus className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isForgotPassword
              ? "Reset Password"
              : showOTP
                ? "Verify Email"
                : isLogin
                  ? "Welcome back"
                  : "Create Account"}
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            {isForgotPassword
              ? "Lấy lại quyền truy cập tài khoản"
              : showOTP
                ? "Nhập mã xác thực từ email"
                : isLogin
                  ? "Sign in to continue"
                  : "Join JobFinder today"}
          </p>
        </div>

        {/* Nút chọn Role */}
        {!showOTP && !isForgotPassword && (
          <div className="flex p-1.5 mb-6 bg-gray-100 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setRole("candidate")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === "candidate" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-gray-500"}`}
            >
              <User className="w-4 h-4 inline mr-2" /> Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === "employer" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-gray-500"}`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" /> Employer
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* --- FORM QUÊN MẬT KHẨU --- */}
        {isForgotPassword ? (
          <form
            className="space-y-4 animate-in fade-in zoom-in duration-300"
            onSubmit={
              resetStep === 1 ? handleSendResetOTP : handleResetPassword
            }
          >
            {resetStep === 1 ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Email của bạn
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-center text-gray-500">
                  Mã OTP đã gửi tới {formData.email}
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Mã OTP 6 số"
                  className="w-full text-center tracking-[0.5em] py-3 border rounded-xl text-lg font-bold"
                />

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật khẩu mới"
                    className="w-full pl-11 pr-4 py-2.5 border rounded-xl text-sm"
                  />
                </div>

                {/* Ô XÁC NHẬN MẬT KHẨU MỚI (MỚI THÊM) */}
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    className="w-full pl-11 pr-4 py-2.5 border rounded-xl text-sm"
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : resetStep === 1 ? (
                "Gửi mã OTP"
              ) : (
                "Đổi mật khẩu"
              )}
            </button>
            <button
              type="button"
              onClick={backToLogin}
              className="w-full text-sm font-medium text-gray-500 mt-2"
            >
              Quay lại Đăng nhập
            </button>
          </form>
        ) : showOTP ? (
          <form
            className="space-y-4 animate-in fade-in zoom-in duration-300"
            onSubmit={handleVerifyOTP}
          >
            <p className="text-sm text-center text-gray-600">
              Mã xác thực gửi tới: <b>{formData.email}</b>
            </p>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="••••••"
              className="w-full text-center tracking-[1em] py-3 border border-gray-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Xác thực tài khoản"
              )}
            </button>
            <button
              type="button"
              onClick={backToLogin}
              className="w-full text-sm font-medium text-gray-500"
            >
              Quay lại
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  {role === "candidate" ? "Full Name" : "Company Name"}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-2.5 border rounded-xl text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-2.5 border rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 border rounded-xl text-sm"
                />
              </div>
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 border rounded-xl text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : isLogin ? (
                `Sign in as ${role}`
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        {!showOTP && !isForgotPassword && (
          <>
            <div className="mt-8 relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative px-4 bg-white text-gray-400 text-sm">
                Or continue with
              </span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="flex items-center justify-center gap-2 py-2.5 border rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                  alt="google"
                />{" "}
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold">
                <Linkedin className="w-5 h-5 text-[#0A66C2]" /> LinkedIn
              </button>
            </div>
            <p className="mt-8 text-center text-sm font-medium text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="font-bold text-blue-600 hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
