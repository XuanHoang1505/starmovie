import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/episodes";

// Hàm lấy tất cả tập phim
const getEpisodes = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Trả về danh sách tập phim
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim:", error);
    throw error;
  }
};

// Hàm lấy một tập phim theo ID
const getEpisodeById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về phim theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy tập phim với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo tập phim mới
const createEpisode = async (episodeData, image, trailer, episodeVideo) => {
  const formData = new FormData();
  formData.append("episode", JSON.stringify(episodeData));
  formData.append("image", image);
  formData.append("trailer", trailer);
  formData.append("episodeVideo", episodeVideo);

  try {
    const response = await axiosInstance.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mới tập phim:", error.response?.data || error);
    throw error;
  }
};

// Hàm cập nhật tập phim
const updateEpisode = async (id, episodeData, image, trailer, episodeVideo) => {
  const formData = new FormData();
  formData.append("episode", JSON.stringify(episodeData));
  if (image) {
    formData.append("image", image);
  }
  if (trailer) {
    formData.append("trailer", trailer);
  }
  if (episodeVideo) {
    formData.append("episodeVideo", episodeVideo);
  }

  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Trả về tập phim  đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật tập phim với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa phim
const deleteEpisode = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa phim với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const EpisodeService = {
  getEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};

export default EpisodeService;
