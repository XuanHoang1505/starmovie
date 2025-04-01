import { useEffect, useState } from "react";
import { Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { TableManagement, Page500 } from "../../../components/admin/index";
import GenreService from "../../../services/admin/GenreService";
import { toast } from "react-toastify";

const GenreManagement = () => {
  const [genreData, setGenreData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);

  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };
  // Mảng cột của bảng
  const genreColumns = [
    { key: "id", label: "ID" },
    { key: "genreName", label: "Tên thể loại" },
  ];

  const fetchGenreData = async () => {
    setLoadingPage(true);
    try {
      const data = await GenreService.getGenres();
      console.log(data);
      setGenreData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchGenreData();
  }, []);

  const handleReset = () => {
    setFormData({
      genreName: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((preStatus) => ({
      ...preStatus,
      ...newStatus,
    }));
  };

  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "genreName":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
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

  // Hàm validate toàn bộ form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.genreName || formData.genreName.trim() === "") {
      newErrors.genreName = "Tên thể loại không được để trống.";
    }
    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;
    setIsLoading(true);
    try {
      if (statusFunction.isEditing) {
        const updatedGenre = await GenreService.updateGenre(
          formData.id,
          formData
        );

        // Cập nhật state GenreData với Genre đã được sửa
        const updateGenredData = genreData.map((genre) =>
          genre.id === updatedGenre.id ? updatedGenre : genre
        );

        setGenreData(updateGenredData);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newGenre = await GenreService.createGenre(formData);
        fetchGenreData(); // Fetch lại dữ liệu mới

        // Cập nhật mảng GenreData với item vừa được thêm
        setGenreData([...genreData, newGenre]);
        updateStatus({ isAdd: false });
        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      toast.error("Lỗi khi lưu thể loại:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      await GenreService.deleteGenre(deleteId);
      setGenreData((prevData) =>
        prevData.filter((genre) => genre.id !== deleteId)
      );
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };
  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-12 mb-3">
          <Form.Group controlId="formName">
            <Form.Label>
              Tên danh mục <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="genreName"
              value={formData.genreName}
              maxLength={100}
              onChange={(e) => handleInputChange("genreName", e.target.value)}
              isInvalid={!!errorFields.genreName}
              placeholder="Nhập vào tên thể loại"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.genreName}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
    </>
  );
  return (
    <>
      <Helmet>
        <title>Quản lý thể loại - Star Movie</title>
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
            columns={genreColumns}
            data={genreData}
            title={"Quản lý thể loại"}
            defaultColumns={genreColumns}
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

export default GenreManagement;
