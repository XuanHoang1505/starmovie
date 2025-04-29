import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/genres";

// Hàm lấy tất thể loại, tổng số trang, trang hiện tại và số lượng thể loại mỗi trang
const getGenres = async (page = 1, size = 10) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/paged`, {
      params: { page, size },
    });
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại:", error);
    throw error;
  }
};

// Hàm lấy một thể loại theo ID
const getGenreById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về thể loại theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy thể loại với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo thể loại mới
const createGenre = async (GenreData) => {
  try {
    const response = await axiosInstance.post(API_URL, GenreData);
    return response.data; // Trả về thể loại đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm mới thể loại:", error);
    throw error;
  }
};

// Hàm cập nhật thể loại
const updateGenre = async (id, GenreData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, GenreData);
    return response.data; // Trả về thể loại đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật thể loại với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa thể loại
const deleteGenre = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa thể loại với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const GenreService = {
  getGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};

export default GenreService;
