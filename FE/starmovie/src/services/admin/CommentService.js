import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/comments";

// Hàm lấy tất cả bình luận
const getComments = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Trả về danh sách bình luận
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bình luận:", error);
    throw error;
  }
};

// Hàm lấy một bình luận theo ID
const getCommentById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về bình luận theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy bình luận với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo bình luận mới
const createComment = async (commentData) => {
  try {
    const response = await axiosInstance.post(API_URL, commentData);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo bình luận:", error.response?.data || error);
    throw error;
  }
};

// Hàm cập nhật bình luận
const updateComment = async (id, commentData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, commentData);
    return response.data; // Trả về bình luận  đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật bình luận với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa bình luận
const deleteComment = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa bình luận với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const CommentService = {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};

export default CommentService;
