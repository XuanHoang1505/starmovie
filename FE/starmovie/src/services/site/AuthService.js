import axiosInstance from "../../config/axiosInstance"; // Axios config sẵn baseURL và headers
import handleErrorResponse from "../../utils/errors/ErrorHandler";

const AUTH_URL = "/auth";

// Đăng nhập
export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/login`, {
      username,
      password,
    });

    const accessToken =
      response.headers["authorization"] || response.headers["Authorization"];
    const refreshToken = response.data.refreshToken;

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Đăng ký
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/register`, userData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Làm mới token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Refresh token not found");

    const response = await axiosInstance.post(
      `${AUTH_URL}/refresh-token`,
      {},
      {
        headers: {
          Authorization: refreshToken,
        },
      }
    );

    return response.data.accessToken;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Gửi OTP
export const sendOtp = async (identifier, userData) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/send-otp`, {
      identifier,
      userData,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Gửi lại OTP
export const resendOtp = async (identifier, userData) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/resend-otp`, {
      identifier,
      userData,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Xác thực OTP
export const verifyOtp = async (identifier, otp) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/verify-otp`, {
      identifier,
      otp,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/reset-password`, {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Đăng xuất
export const logout = async (userId) => {
  try {
    await axiosInstance.post(`${AUTH_URL}/logout`, {
      userId,
    });
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userDetail");
};
