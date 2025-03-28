import axios from "axios";
import handleErrorResponse from "../utils/errors/ErrorHandler";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5145/api/",
});

// Interceptor cho response để xử lý các lỗi từ server
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleErrorResponse(error); // Chuyển đến hàm xử lý lỗi
    return Promise.reject(error);
  }
);

export default axiosInstance;
