import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/vipTypes";

const getVipTypes = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loại vip:", error);
    throw error;
  }
};

// Hàm lấy một loại vip theo ID
const getVipTypeById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về loại vip theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy loại vip với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo loại vip mới
const createVipType = async (vipTypeData) => {
  try {
    const response = await axiosInstance.post(API_URL, vipTypeData);
    return response.data; // Trả về loại vip đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm mới loại vip:", error);
    throw error;
  }
};

// Hàm cập nhật loại vip
const updateVipType = async (id, VipTypeData) => {
  console.log("ID trong URL:", id);
  console.log("ID trong body:", VipTypeData.VipTypeID);
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, VipTypeData);
    return response.data; // Trả về loại vip đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật loại vip với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa loại vip
const deleteVipType = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa loại vip với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const VipTypeService = {
  getVipTypes,
  getVipTypeById,
  createVipType,
  updateVipType,
  deleteVipType,
};

export default VipTypeService;
