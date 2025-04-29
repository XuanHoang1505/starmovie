// src/components/MyProfile/MyProfile.js
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Spinner,
  Row,
  Col,
  Image,
  Button,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import UserService from "../../../services/admin/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  formatDateTimeToDMY,
  formatDateTimeToISO,
} from "../../../utils/formatDate";
import { UserContext } from "../../../contexts/UserContext";
import ChangePasswordModal from "./ChangePasswordModal";
import VerifyPasswordModal from "./VerifyPasswordModal";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { user, updateUser } = useContext(UserContext);
  const [profile, setProfile] = useState({});
  const [editProfile, setEditProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  // Ref for hidden file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.userId) {
      fetchUserProfile(user.userId);
    }
  }, [user, navigate]);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const data = await UserService.getUserById(userId);
      console.log(data);
      setProfile(data);
      setEditProfile({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        birthDate: data.birthDate || "",
        gender: data.gender === null ? "" : data.gender,
        avatar: data.avatar || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (field, value) => {
    setEditProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors for the field being edited
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // Handle avatar click to trigger file input
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại tệp ảnh
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn một tệp ảnh hợp lệ!");
        return;
      }

      // Kiểm tra kích thước tệp (10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        toast.error("Kích thước ảnh không được vượt quá 10MB!");
        return;
      }

      // Cập nhật file đã chọn để gửi lên server
      setSelectedAvatar(file);

      // Tạo xem trước ảnh bằng FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile((prev) => ({
          ...prev,
          avatar: reader.result || "", // Cập nhật avatar để hiển thị xem trước
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation function
  const validateProfile = () => {
    const newErrors = {};

    if (!editProfile.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống.";
    } else if (/\d/.test(editProfile.fullName)) {
      newErrors.fullName = "Tên không được chứa chữ số.";
    }

    if (!editProfile.email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else {
      const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(editProfile.email)) {
        newErrors.email = "Email không hợp lệ.";
      }
    }

    if (!editProfile.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại không được để trống.";
    } else {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(editProfile.phoneNumber)) {
        newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
      }
    }

    if (editProfile.birthDate) {
      const dob = new Date(editProfile.birthDate);
      const today = new Date();
      if (dob > today) {
        newErrors.birthDate = "Ngày sinh không được lớn hơn ngày hiện tại.";
      }
    }

    // Add other validations if necessary

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for Profile and Contact Info
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    try {
      setUpdating(true);

      // Prepare data for update
      const updatedData = {
        ...profile,
        fullName: editProfile.fullName,
        phoneNumber: editProfile.phoneNumber,
        email: editProfile.email,
        birthDate: editProfile.birthDate || null,
        registeredDate: formatDateTimeToISO(profile.registeredDate),
        lastLogin: formatDateTimeToISO(profile.lastLogin),
        gender: editProfile.gender,
        // Không cần set avatar ở đây nếu đã xử lý trong handleAvatarChange
      };

      // Call API to update profile with selectedAvatar
      const updatedProfile = await UserService.updateUser(
        profile.id,
        updatedData,
        selectedAvatar
      );

      // Update state với dữ liệu mới
      setProfile({
        ...updatedProfile,
        updatedAt: formatDateTimeToDMY(updatedProfile.updatedAt),
      });
      setEditProfile({
        ...editProfile,
        avatar: updatedProfile.avatar || "",
      });

      // Cập nhật dữ liệu trong UserContext
      const updatedUser = {
        userId: updatedProfile.id,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        avatar: updatedProfile.avatar,
        role: user.role, // Giữ nguyên vai trò của người dùng
      };
      updateUser(updatedUser);

      toast.success("Cập nhật hồ sơ của bạn thành công!");

      // Reset selected avatar
      setSelectedAvatar(null);

      // Cập nhật dữ liệu trong context
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleVerified = () => {
    setIsVerified(true); // Cho phép thay đổi thông tin
  };

  if (loading)
    return (
      <div className="p-5 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Hồ sơ của tôi - Hight Star</title>
      </Helmet>

      {profile && (
        <>
          <Form
            onSubmit={handleFormSubmit}
            className="mt-2 mt-md-0 form-profile"
          >
            <Row>
              <Col>
                <Tabs
                  defaultActiveKey="profile"
                  id="my-profile-tabs"
                  className="mb-3"
                >
                  <Tab eventKey="profile" title="Thông Tin Cá Nhân">
                    <Row className="g-0">
                      <Col lg={4} className="pe-lg-2">
                        <div className="d-flex flex-column align-items-center p-4 py-lg-4 pt-5 bg-white">
                          <Image
                            src={
                              editProfile.avatar ||
                              "src/assets/admin/images/avatars/default-avatar.png"
                            }
                            alt={profile.fullName || "User Avatar"}
                            onClick={handleAvatarClick}
                            roundedCircle
                            style={{
                              width: "200px",
                              height: "200px",
                              objectFit: "cover",
                              border: "3px solid #0d6efd",
                              cursor: "pointer",
                            }}
                          />
                          <Form.Control
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                          />
                          <div className="text-center mt-3">
                            <span className="text-muted">
                              Nhấn vào ảnh để thay đổi avatar
                            </span>
                          </div>
                        </div>
                      </Col>

                      <Col lg={8} className="ps-lg-3">
                        <div className="px-4 py-3 bg-white">
                          <div>
                            <Form.Group
                              className="mb-4"
                              controlId="formFullName"
                            >
                              <Form.Label>
                                Họ và tên{" "}
                                <span className="text-danger">(*)</span>:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="fullName"
                                value={editProfile.fullName || ""}
                                maxLength={100}
                                onChange={(e) =>
                                  handleInputChange("fullName", e.target.value)
                                }
                                isInvalid={!!errors.fullName}
                                placeholder="VD: Nguyen Van A"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.fullName}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              className="mb-2 d-flex"
                              controlId="formGender"
                            >
                              <Form.Label>Giới tính:</Form.Label>
                              <div className="ms-3">
                                <Form.Check
                                  type="radio"
                                  label="Nam"
                                  name="gender"
                                  id="formGenderMale"
                                  value="true"
                                  checked={editProfile.gender === true}
                                  onChange={() =>
                                    handleInputChange("gender", true)
                                  }
                                  inline
                                  isInvalid={!!errors.gender}
                                />
                                <Form.Check
                                  type="radio"
                                  label="Nữ"
                                  name="gender"
                                  id="formGenderFemale"
                                  value="false"
                                  checked={editProfile.gender === false}
                                  onChange={() =>
                                    handleInputChange("gender", false)
                                  }
                                  inline
                                  isInvalid={!!errors.gender}
                                />
                              </div>
                              <Form.Control.Feedback type="invalid">
                                {errors.gender}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                              className="mb-4"
                              controlId="formDateOfBirth"
                            >
                              <Form.Label>Ngày sinh:</Form.Label>
                              <Form.Control
                                type="date"
                                name="birthDate"
                                value={editProfile.birthDate}
                                onChange={(e) =>
                                  handleInputChange("birthDate", e.target.value)
                                }
                                isInvalid={!!errors.birthDate}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.birthDate}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-end mb-3">
                              <Button
                                variant="link"
                                onClick={() => setShowChangePassword(true)}
                                className="p-0"
                              >
                                Đổi mật khẩu
                              </Button>
                            </div>
                          </div>
                          <div className="mb-3 text-center">
                            <Button
                              className="px-5 w-50 rounded-1 text-truncate"
                              variant="primary"
                              type="submit"
                              disabled={updating}
                            >
                              {updating ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />{" "}
                                  Đang cập nhật...
                                </>
                              ) : (
                                "Lưu thay đổi"
                              )}
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="contact" title="Thông Tin Liên Hệ">
                    {!isVerified ? (
                      // Hiển thị nút hoặc tự động gọi modal nếu chưa xác thực
                      <>
                        <div className="text-center mt-4">
                          <Button
                            variant="primary"
                            onClick={() => setShowVerifyModal(true)}
                          >
                            Xác minh mật khẩu để tiếp tục
                          </Button>
                        </div>
                      </>
                    ) : (
                      // Hiển thị form nếu đã xác thực
                      <Row className="bg-white p-4 mx-0">
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>
                              Email <span className="text-danger">(*)</span>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={editProfile.email || ""}
                              maxLength={100}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              isInvalid={!!errors.email}
                              placeholder="Nhập email"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group
                            className="mb-3"
                            controlId="formPhoneNumber"
                          >
                            <Form.Label>
                              Số điện thoại{" "}
                              <span className="text-danger">(*)</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="phoneNumber"
                              value={editProfile.phoneNumber || ""}
                              maxLength={15}
                              onChange={(e) =>
                                handleInputChange("phoneNumber", e.target.value)
                              }
                              isInvalid={!!errors.phoneNumber}
                              placeholder="Nhập số điện thoại"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.phoneNumber}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col sm={12}>
                          <div className="py-3 text-center">
                            <Button
                              variant="primary"
                              type="submit"
                              disabled={updating}
                              className="px-5 rounded-1 mt-2 text-truncate"
                            >
                              {updating ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />{" "}
                                  Đang cập nhật...
                                </>
                              ) : (
                                "Lưu thay đổi"
                              )}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Form>
          {/* Modal xác thực mật khẩu */}
          <VerifyPasswordModal
            show={showVerifyModal}
            handleClose={() => setShowVerifyModal(false)}
            onVerified={handleVerified}
          />

          {/* Change Password Modal */}
          <ChangePasswordModal
            show={showChangePassword}
            handleClose={() => setShowChangePassword(false)}
          />
        </>
      )}
    </>
  );
};

export default MyProfile;
