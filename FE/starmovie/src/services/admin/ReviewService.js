import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/reviews";

// Hàm lấy tất cả đánh giá
const getReviews = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Trả về danh sách đánh giá
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    throw error;
  }
};

// Hàm lấy một đánh giá theo ID
const getReviewById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về đánh giá theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo đánh giá mới
const createReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post(API_URL, reviewData);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi đánh giá đánh giá:",
      error.response?.data || error
    );
    throw error;
  }
};

// Hàm cập nhật đánh giá
const updateReview = async (id, reviewData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, reviewData);
    return response.data; // Trả về đánh giá  đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật đánh giá với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa đánh giá
const deleteReview = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa đánh giá với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const ReviewService = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};

export default ReviewService;
