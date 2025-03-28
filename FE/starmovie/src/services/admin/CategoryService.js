import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/categories";

// Hàm lấy tất cả danh mục
const getCategories = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Trả về danh sách danh mục
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    throw error;
  }
};

// Hàm lấy một thể loại theo ID
const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về thể loại theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy danh mục với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo thể loại mới
const createCategory = async (CategoryData) => {
  try {
    const response = await axiosInstance.post(API_URL, CategoryData);
    return response.data; // Trả về thể loại đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm mới danh mục:", error);
    throw error;
  }
};

// Hàm cập nhật thể loại
const updateCategory = async (id, CategoryData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, CategoryData);
    return response.data; // Trả về thể loại đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật danh mục với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa thể loại
const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa danh mục với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const CategoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryService;
