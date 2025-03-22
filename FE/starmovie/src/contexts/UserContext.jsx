import { createContext, useState, useEffect } from "react";

// Tạo context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khi component được mount, kiểm tra và lưu thông tin người dùng
  useEffect(() => {
    const storedUser = localStorage.getItem("userDetail");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Hàm để cập nhật thông tin người dùng và lưu vào localStorage
  const updateUser = (userDetail) => {
    setUser(userDetail);
    localStorage.setItem("userDetail", JSON.stringify(userDetail));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
