import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Bell, CheckCircle2, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user, setUser] = useState({ 
    name: '', 
    avatarUrl: 'https://github.com/shadcn.png',
    role: '' 
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({
          name: parsedUser.username || 'User',
          avatarUrl: 'https://github.com/shadcn.png',
          role: parsedUser.role === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'
        });
      } catch (e) {
        console.error("Lỗi JSON user:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/auth'); 
  };

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl dark:text-white">JobSpot</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Find Jobs</Link>
          <Link to="/applications" className="text-gray-600 hover:text-blue-600 font-medium">Applications</Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center focus:outline-none">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-gray-100 rounded-full p-0.5 border-2 border-white">
                    <ChevronDown className="w-3 h-3 text-gray-700" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2 shadow-xl bg-white border border-gray-100">
                <Link to="/profile" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.role}</span>
                  </div>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-3 p-2 cursor-pointer">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 p-2 cursor-pointer text-red-600">
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="text-blue-600 font-bold">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;