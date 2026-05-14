import React, { useState } from 'react';
import { Briefcase, User, Mail, Lock, ShieldCheck, UserPlus, Loader2, Linkedin } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Auth() {
  // --- STATES ---
  const [isLogin, setIsLogin] = useState(true); 
  const [role, setRole] = useState('candidate'); 
  
  const [formData, setFormData] = useState({
    fullName: '', // Đây là nơi lưu "Tên" của bạn
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // THÊM: Các state để quản lý form OTP
  const [showOTP, setShowOTP] = useState(false); 
  const [otpCode, setOtpCode] = useState('');

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(''); 
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setShowOTP(false); // Đảm bảo ẩn form OTP khi đổi chế độ
  };

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
        // --- LOGIN ---
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password,
          role: role
        });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          Swal.fire({ title: 'Thành công!', text: 'Chào mừng quay trở lại!', icon: 'success' });
          // Chuyển hướng user sau khi đăng nhập thành công ở đây (VD: window.location.href = '/')
        }
      } else {
        // --- REGISTER ---
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          username: formData.fullName, // Để chiều lòng bộ lọc express-validator
          name: formData.fullName,     // Gửi kèm name luôn cho chắc ăn
          email: formData.email,
          password: formData.password,
          role: role
        });

        if (response.data.success) {
          Swal.fire({
            title: 'Đăng ký thành công!',
            text: 'Mã OTP đã được gửi. Bạn vui lòng check mail nhé!',
            icon: 'success',
            confirmButtonColor: '#2563eb'
          });
          // Thay vì chuyển về trang Login, ta sẽ hiện form nhập OTP
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
    setError('');
    
    if (!otpCode) {
      setError('Vui lòng nhập mã OTP!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', {
        email: formData.email, // Lấy email mà user vừa đăng ký
        otp: otpCode
      });

      if (response.data.success) {
        Swal.fire({
          title: 'Xác thực thành công!',
          text: 'Tài khoản của bạn đã được kích hoạt. Hãy đăng nhập nhé!',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        });
        setShowOTP(false); // Ẩn form OTP
        setIsLogin(true);  // Chuyển sang chế độ đăng nhập
        setOtpCode('');    // Xóa trắng mã OTP
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn!';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 5. XỬ LÝ GOOGLE LOGIN ---
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/google",
          {
            accessToken: tokenResponse.access_token,
            role: role, 
          }
        );

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }

          Swal.fire({
            title: "Thành công!",
            text: "Đăng nhập Google thành công!",
            icon: "success",
          }).then(() => {
             window.location.href = "/";
          });
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Lỗi khi đăng nhập bằng Google!"
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-4 border border-blue-100 dark:border-blue-500/20 transition-all duration-300">
            {isLogin ? (
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            ) : (
              <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {showOTP ? 'Verify Your Email' : (isLogin ? 'Welcome back' : 'Create Account')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium">
            {showOTP 
              ? 'Enter the code sent to your email' 
              : (isLogin ? 'Sign in to your account to continue' : 'Join JobFinder to start your journey')}
          </p>
        </div>

        {/* Ẩn chọn Role khi đang ở form OTP */}
        {!showOTP && (
          <div className="flex p-1.5 mb-6 bg-gray-100 dark:bg-slate-900/80 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                role === 'candidate' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-slate-700' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              <User className="w-4 h-4" /> Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                role === 'employer' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-slate-700' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Employer
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* ĐIỀU KIỆN HIỂN THỊ FORM: OTP HAY BÌNH THƯỜNG */}
        {showOTP ? (
          <form className="space-y-4 animate-in fade-in zoom-in duration-300" onSubmit={handleVerifyOTP}>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Chúng tôi đã gửi mã xác thực gồm 6 số đến email <br/>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formData.email}</span>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5 text-center">
                Nhập mã OTP
              </label>
              <input 
                type="text" 
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="••••••"
                className="w-full text-center tracking-[1em] py-3 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow font-bold"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-sm shadow-blue-600/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang xác thực...</> : 'Xác thực tài khoản'}
            </button>

            <button 
              type="button"
              onClick={() => setShowOTP(false)}
              className="w-full mt-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Quay lại
            </button>
          </form>
        ) 
        
        // --- FORM ĐĂNG NHẬP / ĐĂNG KÝ GỐC ---
        : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  {role === 'candidate' ? 'Full Name' : 'Company Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    name="fullName"
                    type="text" 
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={role === 'candidate' ? "John Doe" : "Your Company Ltd"}
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name="password"
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow font-medium"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    name="confirmPassword"
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow font-medium"
                  />
                </div>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-sm shadow-blue-600/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {isLogin ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                isLogin ? `Sign in as ${role === 'candidate' ? 'Candidate' : 'Employer'}` : 'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Ẩn các nút MXH và Link chuyển đổi khi đang ở form OTP */}
        {!showOTP && (
          <>
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-700"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-medium">Or continue with</span></div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 dark:text-slate-300 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg> Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 dark:text-slate-300 shadow-sm">
                <Linkedin className="w-5 h-5 text-[#0A66C2]" /> LinkedIn
              </button>
            </div>
            
            <p className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleMode} type="button" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}