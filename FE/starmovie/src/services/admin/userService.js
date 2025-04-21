import axiosInstance from "../../config/axiosInstance"; // Axios config sẵn baseURL và headers
import { formatDateTimeToDMY, formatToDateInput } from "../../utils/formatDate";

const API_URL = "/admin/users";

// ========================== USER CRUD SERVICE ==========================

const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

const getUsers = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    const users = response.data;
    return users.map((user) => ({
      ...user,
      birthDate: formatDateTimeToDMY(user.birthDate),
      registeredDate: formatDateTimeToDMY(user.registeredDate),
      lastLogin: formatDateTimeToDMY(user.lastLogin),
    }));
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách người dùng:");
  }
};

const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    const user = response.data;
    return {
      ...user,
      birthDate: formatToDateInput(user.birthDate),
      registeredDate: formatDateTimeToDMY(user.registeredDate),
      lastLogin: formatDateTimeToDMY(user.lastLogin),
    };
  } catch (error) {
    handleError(error, `Lỗi khi lấy người dùng với ID: ${id}`);
  }
};

const getUserByUsername = async (username) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/search-by-username/${username}`
    );
    const user = response.data;
    return {
      ...user,
      birthDate: formatDateTimeToDMY(user.birthDate),
      registeredDate: formatDateTimeToDMY(user.registeredDate),
      lastLogin: formatDateTimeToDMY(user.lastLogin),
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      handleError(error, "Người dùng này không tồn tại!");
    } else {
      handleError(error, `Lỗi khi lấy người dùng với username: ${username}`);
    }
  }
};

const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post(API_URL, userData);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi thêm người dùng:");
  }
};

const updateUser = async (id, userData, avatar) => {
  const formData = new FormData();
  formData.append("user", JSON.stringify(userData));
  if (avatar) {
    formData.append("file", avatar);
  }

  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi cập nhật người dùng với ID: ${id}`);
  }
};

const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi xóa người dùng với ID: ${id}`);
  }
};

// Hàm xác thực mật khẩu
const verifyPassword = async (userId, password) => {
  try {
    const response = await axiosInstance.post(`/auth/verify-password`, {
      userId,
      password,
    });
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi xác thực mật khẩu!`);
  }
};

// Hàm thay đổi mật khẩu
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.post(`/auth/change-password`, {
      userId,
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi đổi mật khẩu!`);
  }
};

const UserService = {
  getUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  verifyPassword,
  changePassword,
};

export default UserService;
