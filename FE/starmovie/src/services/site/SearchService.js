import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

const API_URL = "/site/search";

const searchAll = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await axiosInstance.get(`${API_URL}/${encodedQuery}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "Server Error:",
        error.response.data.message || error.response.statusText
      );
    } else if (error.request) {
      console.error("No response from server.");
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

const SearchService = {
  searchAll,
};
export default SearchService;
