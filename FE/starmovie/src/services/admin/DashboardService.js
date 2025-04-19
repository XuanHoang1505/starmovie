import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/dashboard";

// Hàm lấy tất cả danh mục
const getDashboardStatistics = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/statistics`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thống kê:", error);
    throw error;
  }
};
const getGenreStatistics = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/movie-count-by-genre`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thống kê:", error);
    throw error;
  }
};

const getMonthlyStatistics = async (year) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/user-registration/${year}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thống kê theo tháng:", error);
    throw error;
  }
};

const getRecentActivities = async (limit = 2) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/recent-activities`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy hoạt động gần đây:", error);
    throw error;
  }
};

const getTopMovieRatings = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/top-rated-movies`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim có đánh giá đứng đầu:", error);
    throw error;
  }
};
const getTopViewedMovies = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/top-viewed-movies`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim có lượt xem đứng đầu:", error);
    throw error;
  }
};

const DashboardService = {
  getDashboardStatistics,
  getGenreStatistics,
  getMonthlyStatistics,
  getRecentActivities,
  getTopMovieRatings,
  getTopViewedMovies,
};

export default DashboardService;
