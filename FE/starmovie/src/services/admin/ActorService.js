import axiosInstance from "../../config/axiosInstance"; // Đường dẫn tới file axiosInstance

// Cấu hình URL API chung
const API_URL = "/admin/actors";

// Hàm lấy tất cả diễn viên
const getActors = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data; // Trả về danh sách diễn viên
  } catch (error) {
    console.error("Lỗi khi lấy danh sách diễn viên:", error);
    throw error;
  }
};

// Hàm lấy một thể loại theo ID
const getActorById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data; // Trả về thể loại theo ID
  } catch (error) {
    console.error(`Lỗi khi lấy diễn viên với ID: ${id}`, error);
    throw error;
  }
};

// Hàm tạo thể loại mới
const createActor = async (actorData, file) => {
  const formData = new FormData();
  formData.append("actor", JSON.stringify(actorData));
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response); // Trả về thể loại đã tạo
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mới diễn viên:", error);
    throw error;
  }
};

// Hàm cập nhật thể loại
const updateActor = async (id, actorData, file) => {
  const formData = new FormData();
  formData.append("actor", JSON.stringify(actorData));
  if (file) {
    formData.append("file", file); // Chỉ thêm file nếu có
  }

  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Trả về diễn viên  đã cập nhật
  } catch (error) {
    console.error(`Lỗi khi cập nhật diễn viên với ID: ${id}`, error);
    throw error;
  }
};

// Hàm xóa thể loại
const deleteActor = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data; // Trả về thông tin phản hồi khi xóa thành công
  } catch (error) {
    console.error(`Lỗi khi xóa diễn viên với ID: ${id}`, error);
    throw error; // Ném lỗi để các component gọi hàm này có thể xử lý
  }
};

// Export các hàm dưới dạng object
const ActorService = {
  getActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
};

export default ActorService;
