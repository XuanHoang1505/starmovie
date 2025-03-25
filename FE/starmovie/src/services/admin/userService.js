import axiosInstance from "../../config/axiosInstance";
// import { formatDateTimeToDMY } from "../utils/FormatDate";

const API_URL = "/employee/users";
// Hàm xử lý lỗi chung
const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

// // Hàm lấy tất cả người dùng
// const getUsers = async () => {
//   try {
//     const response = await axiosInstance.get(API_URL);
//     const users = response.data;

//     // Chuyển đổi định dạng ngày giờ cho từng phần tử
//     return users.map((user) => ({
//       ...user,
//       registeredDate: formatDateTimeToDMY(user.registeredDate),
//       lastLogin: formatDateTimeToDMY(user.lastLogin),
//     }));
//   } catch (error) {
//     handleError(error, "Lỗi khi lấy danh sách người dùng:");
//   }
// };

// // Hàm lấy một người dùng theo ID
// const getUserById = async (id) => {
//   try {
//     const response = await axiosInstance.get(`${API_URL}/${id}`);
//     const user = response.data;

//     // Chuyển đổi định dạng ngày giờ
//     return {
//       ...user,
//       registeredDate: formatDateTimeToDMY(user.registeredDate),
//       lastLogin: formatDateTimeToDMY(user.lastLogin),
//     };
//   } catch (error) {
//     // Xử lý lỗi khi không tìm thấy người dùng hoặc có lỗi khác
//     handleError(error, `Lỗi khi lấy người dùng này`);
//   }
// };

// // Hàm lấy người dùng theo username
// const getUserByUsername = async (username) => {
//   try {
//     // Gọi API với tham số username
//     const response = await axiosInstance.get(
//       `${API_URL}/search-by-username?username=${username}`
//     );
//     const user = response.data;
//     return {
//       ...user,
//       registeredDate: formatDateTimeToDMY(user.registeredDate),
//       lastLogin: formatDateTimeToDMY(user.lastLogin),
//     };
//   } catch (error) {
//     // Xử lý lỗi khi không tìm thấy người dùng hoặc có lỗi khác
//     if (error.response && error.response.status === 404) {
//       handleError(error, "Người dùng này không tồn tại!");
//     } else {
//       handleError(error, `Lỗi khi lấy người dùng với username: ${username}`);
//     }
//   }
// };

// // Hàm thêm mới người dùng
// const createUser = async (userData) => {
//   try {
//     const response = await axiosInstance.post(API_URL, userData);
//     return response.data;
//   } catch (error) {
//     handleError(error, "Lỗi khi thêm mới người dùng:");
//   }
// };

// // Hàm cập nhật người dùng
// const updateUser = async (id, userData) => {
//   try {
//     const response = await axiosInstance.put(`${API_URL}/${id}`, userData);
//     return response.data;
//   } catch (error) {
//     handleError(error, `Lỗi khi cập nhật người dùng với ID: ${id}`);
//   }
// };

// // Hàm xóa người dùng
// const deleteUser = async (id) => {
//   try {
//     await axiosInstance.delete(`${API_URL}/${id}`);
//   } catch (error) {
//     handleError(error, `Lỗi khi xóa người dùng với ID: ${id}`);
//   }
// };

// Gán object vào một biến trước khi export
const userService = {
//   getUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser,
//   getUserByUsername,
};

export default userService;
