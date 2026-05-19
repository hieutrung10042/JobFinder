import React, { useState } from 'react';
import { Briefcase, User, Mail, Lock, ShieldCheck, UserPlus, Loader2, Linkedin } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để chuyển trang

export default function Auth() {
  const navigate = useNavigate();
  
  // --- STATES ---
  const [isLogin, setIsLogin] = useState(true); 
  const [role, setRole] = useState('candidate'); 
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false); 
  const [otpCode, setOtpCode] = useState('');

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(''); 
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setShowOTP(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        const response = await axios.post('https://web-development-course-43yy.onrender.com/api/auth/login', {
          email: formData.email,
          password: formData.password,
          role: role
        });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          await Swal.fire({ title: 'Thành công!', text: 'Chào mừng quay trở lại!', icon: 'success', timer: 1500 });
          navigate('/'); // Chuyển về trang chủ
          window.location.reload(); // Refresh để Navbar cập nhật trạng thái
        }
      } else {
        // --- REGISTER ---
        const response = await axios.post('https://web-development-course-43yy.onrender.com/api/auth/register', {
          username: formData.fullName,
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role
        });

        if (response.data.success) {
          Swal.fire({
            title: 'Đăng ký thành công!',
            text: 'Mã OTP đã được gửi vào Email của bạn!',
            icon: 'success'
          });
          setShowOTP(true); 
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra!";
      setError(msg);
      Swal.fire({ title: "Lỗi", text: msg, icon: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otpCode) return setError('Vui lòng nhập mã OTP!');

    setIsLoading(true);
    try {
      const response = await axios.post('https://web-development-course-43yy.onrender.com/api/auth/verify-email', {
        email: formData.email,
        otp: otpCode
      });

      if (response.data.success) {
        await Swal.fire({ title: 'Xác thực thành công!', text: 'Hãy đăng nhập ngay nhé!', icon: 'success' });
        setShowOTP(false);
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP không hợp lệ!');
    } finally {
      setIsLoading(false);
    }
  };

  // --- GOOGLE LOGIN ---
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await axios.post("https://web-development-course-43yy.onrender.com/api/auth/google", {
          accessToken: tokenResponse.access_token,
          role: role, 
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          await Swal.fire({ title: "Thành công!", text: "Đăng nhập Google thành công!", icon: "success" });
          navigate('/');
          window.location.reload();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Lỗi khi đăng nhập bằng Google!");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Đăng nhập Google thất bại!"),
  });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-4 border border-blue-100 dark:border-blue-500/20">
            {isLogin ? <ShieldCheck className="w-6 h-6 text-blue-600" /> : <UserPlus className="w-6 h-6 text-blue-600" />}
          </div>
          <h1 className="text-2xl font-bold dark:text-white">
            {showOTP ? 'Verify Email' : (isLogin ? 'Welcome back' : 'Create Account')}
          </h1>
        </div>

        {!showOTP && (
          <div className="flex p-1.5 mb-6 bg-gray-100 dark:bg-slate-900/80 rounded-xl">
            <button onClick={() => setRole('candidate')} className={`flex-1 py-2 text-sm font-semibold rounded-lg ${role === 'candidate' ? 'bg-white text-blue-600 shadow' : 'text-gray-500'}`}>
              Candidate
            </button>
            <button onClick={() => setRole('employer')} className={`flex-1 py-2 text-sm font-semibold rounded-lg ${role === 'employer' ? 'bg-white text-blue-600 shadow' : 'text-gray-500'}`}>
              Employer
            </button>
          </div>
        )}

        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-200">{error}</div>}

        {showOTP ? (
          <form className="space-y-4" onSubmit={handleVerifyOTP}>
            <input 
              type="text" maxLength={6} value={otpCode} 
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="••••••"
              className="w-full text-center tracking-[1em] py-3 border rounded-xl text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {!isLogin && (
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        )}

        {!showOTP && (
          <>
            <div className="mt-6 relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-gray-500">Or continue with</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => loginWithGoogle()} // NÚT GOOGLE ĐÃ ĐƯỢC KÍCH HOẠT
                className="flex items-center justify-center gap-2 py-2.5 border rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg> Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 border rounded-xl hover:bg-gray-50 transition-all font-semibold">
                <Linkedin className="w-5 h-5 text-[#0A66C2]" /> LinkedIn
              </button>
            </div>
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleMode} className="font-bold text-blue-600 hover:underline">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}