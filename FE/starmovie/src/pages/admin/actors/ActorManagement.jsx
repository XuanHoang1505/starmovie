import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableManagement, Page500 } from "../../../components/admin/index";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";
import ActorService from "../../../services/admin/ActorService";
import { formatDateToDMY, formatDateToISO } from "../../../utils/formatDate";

const ActorManagement = () => {
  // State để lưu trữ dữ liệu diễn viên từ API
  const [actorData, setActorData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [imageFile, setImageFile] = useState("");
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

  // State để xử lý trạng thái tải dữ liệu và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);
  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };

  // Mảng cột của bảng
  const actorColumns = [
    { key: "avatar", label: "Avatar" },
    { key: "id", label: "ID" },
    { key: "name", label: "Tên diễn viên" },
    { key: "birthDate", label: "Ngày sinh" },
    { key: "nationality", label: "Quốc tịch" },
  ];

  // Gọi API để lấy dữ liệu từ server
  const fetchActorData = async () => {
    setLoadingPage(true);
    try {
      const data = await ActorService.getActors();

      const formatData = data.map((actor) => ({
        ...actor,
        birthDate: formatDateToDMY(actor.birthDate), // Định dạng lại ngày tháng
      }));
      setActorData(formatData); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchActorData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "name":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }
        break;

      case "nationality":
        if (!value || value.trim() === "") {
          error = "Quốc tịch không được để trống.";
        } else if (/[^a-zA-Z\s]/.test(value)) {
          error = "Quốc tịch chỉ được chứa chữ cái và khoảng trắng.";
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

    // Kiểm tra tên
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Tên không được để trống.";
    }

    // Kiểm tra quốc tịch
    if (!formData.nationality || formData.nationality.trim() === "") {
      newErrors.nationality = "Quốc tịch không được để trống.";
    } else if (/[^a-zA-Z\s]/.test(formData.nationality)) {
      newErrors.nationality =
        "Quốc tịch chỉ được chứa chữ cái và khoảng trắng.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
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
  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  // Hàm reset form khi thêm mới
  const handleReset = () => {
    setFormData({
      name: "",
      avatar: "",
      birthDate: "",
      nationality: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một diễn viên
  const handleEdit = (item) => {
    setFormData({
      ...item,
      name: item.name || "",
      avatar: item.avatar || "", // Đảm bảo trường avatar tồn tại
      birthDate: formatDateToISO(item.birthDate) || "",
      nationality: item.nationality || "",
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng ActorService
        const updatedActor = await ActorService.updateActor(
          formData.id,
          formData,
          imageFile
        );

        const formattedActor = {
          ...updatedActor,
          birthDate: formatDateToDMY(formData.birthDate), // Định dạng lại ngày tháng
        };

        // Cập nhật state actorData với actor đã được sửa
        const updatedActors = actorData.map((actor) =>
          actor.id === formattedActor.id ? formattedActor : actor
        );

        setActorData(updatedActors);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newActor = await ActorService.createActor(formData, imageFile);

        // Đổi định dạng ngày giờ trước khi lưu vào mảng
        const formattedActor = {
          ...newActor,
          birthDate: formatDateToDMY(formData.birthDate), // Định dạng lại ngày tháng
        };

        // Cập nhật mảng productData với item vừa được thêm
        setActorData([...actorData, formattedActor]);

        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return; // kiểm tra sớm

    setIsLoading(true);
    try {
      await ActorService.deleteActor(deleteId); // Thực hiện xóa
      setActorData((prevData) =>
        prevData.filter((actor) => actor.id !== deleteId)
      );
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsLoading(false); // Đảm bảo tắt loading trong mọi trường hợp
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          {/* Phần hiển thị hình ảnh */}
          <Form.Label>
            Hình ảnh diễn viên <span className="text-danger">(*)</span>
          </Form.Label>
          <div
            className="d-flex justify-content-center align-items-center mb-3 rounded bg-light"
            style={{
              width: "100%",
              height: "240px",
              overflow: "hidden",
              border: "2px dashed #ddd",
            }}
          >
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Hình ảnh khóa học"
                className="w-100 h-100 object-fit-cover rounded"
              />
            ) : (
              <span className="text-muted">Chưa có hình ảnh nào</span>
            )}
          </div>
          <Form.Group controlId="formImage">
            <Form.Control
              type="file"
              name="avatar"
              accept="avatar/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setImageFile(file); // lưu file vào imgFile để guwỉ lên server
                  const fileUrl = URL.createObjectURL(file);
                  handleInputChange("avatar", fileUrl); // lưu file vào img để xem trước
                } else {
                  // Nếu người dùng xóa hình ảnh đã chọn thì xóa cả image và imageFile
                  handleInputChange("avatar", "");
                  setImageFile("");
                }
              }}
              isInvalid={!!errorFields.avatar}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.avatar}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formName">
            <Form.Label>
              Tên diễn viên <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="actorName"
              value={formData.name}
              maxLength={100}
              onChange={(e) => handleInputChange("name", e.target.value)}
              isInvalid={!!errorFields.actorName}
              placeholder="Nhập vào tên diễn viên"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.productName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formBirthDate">
            <Form.Label>
              Ngày sinh <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              isInvalid={!!errorFields.birthDate}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.birthDate}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formNationality">
            <Form.Label>
              Quốc tịch <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="nationality"
              value={formData.nationality}
              maxLength={100}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              isInvalid={!!errorFields.nationality}
              placeholder="Nhập quốc tịch"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.nationality}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý diễn viên - Star Movie</title>
      </Helmet>
      {/* Hiển thị loader khi đang tải trang */}
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0 ">
          <TableManagement
            columns={actorColumns}
            data={actorData}
            title={"Quản lý diễn viên"}
            defaultColumns={actorColumns} // Truyền mảng cột đã lọc
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
            buttonCustom={button}
          />
        </section>
      )}
    </>
  );
};

export default ActorManagement;
