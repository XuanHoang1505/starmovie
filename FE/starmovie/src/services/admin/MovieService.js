import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/movies";

// Hàm lấy tất cả phim
const getMovies = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Trả về danh sách phim
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim:", error);
    throw error;
  }
};

// Hàm lấy một phim theo ID
const getMovieById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về phim theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy phim với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo phim mới
const createMovie = async (movieData, trailer, poster) => {
  const formData = new FormData();
  formData.append("movie", JSON.stringify(movieData));
  formData.append("trailer", trailer);
  formData.append("poster", poster);

  try {
    const response = await axiosInstance.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi thêm mới phim:", error.response?.data || error);
    throw error;
  }
};

// Hàm cập nhật phim
const updateMovie = async (id, movieData, trailer, poster) => {
  const formData = new FormData();
  formData.append("movie", JSON.stringify(movieData));
  if (trailer) {
    formData.append("trailer", trailer);
  }
  if (poster) {
    formData.append("poster", poster);
  }

  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Trả về phim  đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật phim với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa phim
const deleteMovie = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa phim với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const MovieService = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};

export default MovieService;
