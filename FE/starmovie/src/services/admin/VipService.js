import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/vips";

// Hàm lấy tất vip, tổng số trang, trang hiện tại và số lượng vip mỗi trang
const getVips = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vip:", error);
    throw error;
  }
};

// Hàm lấy một vip theo ID
const getVipById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về vip theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy vip với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo vip mới
const createVip = async (vipData) => {
  try {
    const response = await axiosInstance.post(API_URL, vipData);
    return response.data; // Trả về vip đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm mới vip:", error);
    throw error;
  }
};

// Hàm cập nhật vip
const updateVip = async (id, vipData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, vipData);
    return response.data; // Trả về vip đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật vip với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa vip
const deleteVip = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa vip với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const VipService = {
  getVips,
  getVipById,
  createVip,
  updateVip,
  deleteVip,
};

export default VipService;
