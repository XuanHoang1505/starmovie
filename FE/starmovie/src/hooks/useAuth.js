// useAuth.js
import { useState } from 'react';

// Hook quản lý trạng thái đăng nhập
export function useAuth() {
  const [user, setUser] = useState(null);

  // Đăng nhập người dùng
  const login = (userData) => {
    setUser(userData);
    // Có thể lưu thông tin người dùng vào localStorage hoặc cookies
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Đăng xuất người dùng
  const logout = () => {
    setUser(null);
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('user');
  };

  // Kiểm tra xem người dùng có đăng nhập hay không
  const isAuthenticated = () => {
    return user !== null;
  };

  return {
    user,
    login,
    logout,
    isAuthenticated
  };
}
