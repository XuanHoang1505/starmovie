import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/movieSlides";

// Hàm lấy tất slide, tổng số trang, trang hiện tại và số lượng slide mỗi trang
const getMovieSlides = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách slide:", error);
    throw error;
  }
};

// Hàm lấy một slide theo ID
const getMovieSlideById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về slide theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy slide với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo slide mới
const createMovieSlide = async (MovieSlideData) => {
  try {
    const response = await axiosInstance.post(API_URL, MovieSlideData);
    return response.data; // Trả về slide đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm mới slide:", error);
    throw error;
  }
};

// Hàm cập nhật slide
const updateMovieSlide = async (id, MovieSlideData) => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/${id}`,
      MovieSlideData
    );
    return response.data; // Trả về slide đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật slide với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa slide
const deleteMovieSlide = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa slide với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const MovieSlideService = {
  getMovieSlides,
  getMovieSlideById,
  createMovieSlide,
  updateMovieSlide,
  deleteMovieSlide,
};

export default MovieSlideService;
