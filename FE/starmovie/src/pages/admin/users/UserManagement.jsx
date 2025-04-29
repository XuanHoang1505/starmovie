import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { TableManagement, Page500 } from "../../../components/admin/index";
import UserService from "../../../services/admin/UserService";
import { Helmet } from "react-helmet-async";
import {
  formatDateTimeToDMY,
  formatDateTimeToISO,
  formatToDateInput,
} from "../../../utils/formatDate";
import { Spinner, Form, Image, Button, Row, Col } from "react-bootstrap";

const UserManagement = () => {
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    phoneNumber: "",
    avatar: "",
    birthDate: "",
    gender: "",
    username: "",
    email: "",
    role: "USER",
    status: "ACTIVE",
    registeredDate: "",
    lastLogin: "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [errorFields, setErrorFields] = useState({});
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });

  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  const fileInputRef = useRef(null);

  const userColumns = [
    { key: "avatar", label: "Avatar" },
    { key: "id", label: "ID" },
    { key: "fullName", label: "Họ và tên" },
    { key: "email", label: "Email" },
    { key: "role", label: "Vai Trò" },
    { key: "registeredDate", label: "Ngày đăng ký" },
    { key: "lastLogin", label: "Lần đăng nhập cuối" },
    { key: "status", label: "Trạng thái" },
  ];

  const keysToRemove = ["lastLogin", "id"];
  const defaultColumns = userColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  const fetchUserData = async () => {
    setLoadingPage(true);
    try {
      const data = await UserService.getUsers();
      console.log("data", data);
      const formattedData = data.map((user) => ({
        ...user,
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        avatar: user.avatar || "",
        gender: user.gender === null ? "" : user.gender ? "1" : "0",
      }));
      setUserData(formattedData);
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "fullName":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        } else if (/\d/.test(formData.fullName)) {
          error = "Tên không được chứa số.";
        }
        break;

      case "email":
        if (!value || value.trim() === "") {
          error = "Email không được để trống.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email không hợp lệ.";
        }
        break;

      default:
        break;
    }

    setErrorFields((prevErrors) => ({
      ...prevErrors,
      [key]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!statusFunction.isEditing) {
      // nếu là edit thì sẽ không validate trường này
      if (!formData.fullName || formData.fullName.trim() === "") {
        newErrors.fullName = "Tên không được để trống.";
      } else if (/\d/.test(formData.fullName)) {
        newErrors.fullName = "Tên không được chứa chữ số.";
      }
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    // Validate phone number format (e.g., only digits and length between 10-15)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
    }

    if (formData.birthDate) {
      const dob = new Date(formData.birthDate);
      const today = new Date();
      if (dob > today) {
        newErrors.birthDate = "Ngày sinh không được lớn hơn ngày hiện tại.";
      }
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prevStatus) => ({
      ...prevStatus, // Giữ lại các thuộc tính trước đó
      ...newStatus, // Cập nhật các thuộc tính mới
    }));
  };

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
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result, // Cập nhật avatar để hiển thị xem trước
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  const handleReset = () => {
    setFormData({
      id: "",
      fullName: "",
      phoneNumber: "",
      avatar: "",
      birthDate: "",
      gender: "",
      username: "",
      email: "",
      role: "USER",
      status: "ACTIVE",
      registeredDate: "",
      lastLogin: "",
    });
    handleResetStatus();
    setErrorFields({});
  };
  const handleEdit = (item) => {
    setFormData({
      ...item,
      birthDate: formatToDateInput(item.birthDate),
      registeredDate: formatDateTimeToISO(item.registeredDate),
      lastLogin:
        item.lastLogin === "" ? null : formatDateTimeToISO(item.lastLogin),
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;
    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        const updatedFormData = {
          ...formData,
          birthDate: formData.birthDate || null,
          gender:
            formData.gender === ""
              ? null
              : formData.gender === "1"
              ? true
              : false,
        };
        const updatedUser = await UserService.updateUser(
          formData.id,
          updatedFormData,
          selectedAvatar
        );
        const formattedUser = {
          ...updatedUser,
          birthDate: formatDateTimeToDMY(updatedUser.birthDate),
          registeredDate: formatDateTimeToDMY(updatedUser.registeredDate),
          lastLogin: formatDateTimeToDMY(updatedUser.lastLogin),
          gender: formData.gender === null ? "" : formData.gender ? "1" : "0",
        };

        const updatedUsers = userData.map((user) =>
          user.id === formattedUser.id ? formattedUser : user
        );

        setUserData(updatedUsers);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        const cleanString = (value) => (value?.trim() === "" ? null : value);

        const { id, ...rest } = formData;

        const newFormData = {
          ...rest,
          birthDate: rest.birthDate || null,
          avatar: cleanString(rest.avatar),
          phoneNumber: cleanString(rest.phoneNumber),
          gender:
            rest.gender === "" ? null : rest.gender === "1" ? true : false,
          status: rest.status,
          registeredDate: null,
          lastLogin: null,
          username: cleanString(rest.username),
        };

        const newUser = await UserService.createUser(newFormData);
        const formattedUser = {
          ...newUser,
          birthDate: formatDateTimeToDMY(newUser.birthDate),
          registeredDate: formatDateTimeToDMY(newUser.registeredDate),
          lastLogin: formatDateTimeToDMY(newUser.lastLogin),
          gender:
            formData.gender === null
              ? ""
              : formData.gender === true
              ? "1"
              : "0",
        };

        setUserData([...userData, formattedUser]);
        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      console.error("Lỗi khi lưu user:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      await UserService.deleteUser(deleteId);
      setUserData((prevData) =>
        prevData.filter((item) => item.id !== deleteId)
      );
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa không thành công!");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <>
      {formData && statusFunction.isEditing ? (
        <>
          <Row className="mb-3">
            {/* Avatar + hướng dẫn */}
            <Col
              xs={12}
              sm={4}
              className="d-flex flex-column justify-content-start align-items-center mt-1 mb-5 mb-md-0"
            >
              <div onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
                <Image
                  src={
                    formData.avatar ||
                    "/src/assets/admin/images/avatars/avatar-default-lg.png"
                  }
                  alt={formData.fullName || "User Avatar"}
                  roundedCircle
                  fluid
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    border: "3px solid black",
                  }}
                />
                <Form.Control
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
              <small className="text-primary fst-italic my-3">
                Nhấp vào ảnh để thay đổi!
              </small>
            </Col>

            {/* Thông tin chi tiết */}
            <Col xs={12} sm={8} className="pe-3 pb-2">
              {/* Họ và tên */}
              <Form.Group controlId="formFullName" className="mb-2">
                <Form.Label>
                  Họ và tên <span className="text-danger">(*)</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName || ""}
                  maxLength={100}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  isInvalid={!!errorFields.fullName}
                  placeholder="VD: Nguyễn Văn A"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.fullName}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Email */}
              <Form.Group controlId="formEmail" className="mb-2">
                <Form.Label>
                  Email <span className="text-danger">(*)</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  maxLength={100}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Số điện thoại */}
              <Form.Group controlId="formPhoneNumber" className="mb-2">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  maxLength={15}
                  isInvalid={!!errorFields.phoneNumber}
                  required
                  placeholder="Nhập số điện thoại"
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBirthDate" className="mb-2">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  isInvalid={!!errorFields.birthDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.birthDate}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Giới tính */}
              <Form.Group controlId="formGender" className="mb-2">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <option value="">Chưa có</option>
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                </Form.Select>
              </Form.Group>

              {/* Vai trò */}
              <Form.Group controlId="formRole" className="mb-2">
                <Form.Label>
                  Vai trò <span className="text-danger">(*)</span>
                </Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  isInvalid={!!errorFields.role}
                  required
                >
                  <option value="ADMIN">Quản Trị</option>
                  <option value="USER">Người dùng</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errorFields.role}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Trạng thái */}
              <Form.Group controlId="formStatus" className="mb-2">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={
                    formData.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hóa"
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      e.target.checked ? "ACTIVE" : "DISABLED"
                    )
                  }
                  checked={formData.status === "ACTIVE"}
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Group controlId="formFullName">
                <Form.Label>
                  Họ và tên <span className="text-danger">(*)</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName || ""}
                  maxLength={100}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  isInvalid={!!errorFields.fullName}
                  placeholder="VD: Nguyen Van A"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.fullName}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group controlId="formEmail">
                <Form.Label>
                  Email <span className="text-danger">(*)</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  isInvalid={!!errorFields.email}
                  placeholder="Nhập email"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errorFields.email}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group controlId="formRole">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  isInvalid={!!errorFields.role}
                  required
                >
                  <option value="ADMIN">Quản Trị</option>
                  <option value="USER">Người dùng</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errorFields.role}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="col-md-6 mb-3">
              <Form.Group controlId="formStatus">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={
                    formData.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hóa"
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      e.target.checked ? "ACTIVE" : "DISABLED"
                    )
                  }
                  checked={formData.status === "ACTIVE"}
                />
              </Form.Group>
            </div>
          </div>
        </>
      )}
    </>
  );
  console.log("formData", formData);
  return (
    <>
      <Helmet>
        <title>Quản lý người dùng - Star Movie</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0 ">
          <TableManagement
            columns={userColumns}
            data={userData}
            title={"Quản lý người dùng"}
            defaultColumns={defaultColumns}
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            buttonCustom={button}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
          />
        </section>
      )}
    </>
  );
};

export default UserManagement;
