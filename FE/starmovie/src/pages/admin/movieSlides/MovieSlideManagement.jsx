import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableManagement, Page500 } from "../../../components/admin/index";
import MovieSlideService from "../../../services/admin/MovieSlideService";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import { Spinner, Form } from "react-bootstrap";
import MovieService from "../../../services/admin/MovieService";

const MovieSlideManagement = () => {
  // State để lưu trữ dữ liệu giảm giá từ API
  const [movieSlideData, setMovieSlideData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    position: "",
    movieId: "",
  }); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

  const [listMovieOption, setListMovieOption] = useState([]);

  // State để xử lý trạng thái tải dữ liệu và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);
  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };
  // Mảng cột của bảng
  const movieSlideColumns = [
    { key: "id", label: "ID" },
    { key: "position", label: "Vị trí" },
    { key: "movieId", label: "Mã phim" },
    { key: "title", label: "Tên phim" },
  ];

  // Gọi API để lấy dữ liệu từ server
  const fetchMovieSlideData = async () => {
    setLoadingPage(true);
    try {
      const data = await MovieSlideService.getMovieSlides();
      const dataFormat = data.map((item) => ({
        id: item.id,
        position: item.position,
        movieId: item.movieId,
        title: item.movie?.title || "Chưa có tên", // Lấy title từ movie, nếu không có thì ghi "Chưa có tên"
      }));

      setMovieSlideData(dataFormat); // Lưu dữ liệu đã format vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const movies = await MovieService.getMovies();
      const movieOptions = movies.map((movie) => ({
        value: movie.id,
        label: `#${movie.id} - ${movie.title}`,
      }));
      setListMovieOption(movieOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách phim");
    }
  };
  useEffect(() => {
    fetchMovieSlideData();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "position":
        if (value === "" || value === null) {
          error = "Vị trí không được để trống.";
        } else if (isNaN(value) || value < 0 || value == 0) {
          error = "Vị trí phải là số lớn hơn 0.";
        }
        break;
      case "movieId":
        if (!value || value.length === 0) {
          error = "Lựa chọn phim không được để trống.";
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

    if (!formData.position || formData.position.trim() === "") {
      newErrors.position = "Tên danh mục không được để trống.";
    }

    if (!formData.movieId || formData.movieId === "") {
      newErrors.movieId = "Lựa chọn phim không được để trống.";
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
      position: "",
      movieId: "",
    });
    handleResetStatus();
    setErrorFields({});
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
        // Gọi API cập nhật sử dụng MovieSlideService
        const updatedMovieSlide = await MovieSlideService.updateMovieSlide(
          formData.id,
          formData
        );

        // Cập nhật state MovieSlideData với MovieSlide đã được sửa
        const updateMovieSlideData = movieSlideData.map((movieSlide) =>
          movieSlide.id === updatedMovieSlide.id
            ? updatedMovieSlide
            : movieSlide
        );

        setMovieSlideData(updateMovieSlideData);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newMovieSlide = await MovieSlideService.createMovieSlide(
          formData
        );

        // Cập nhật mảng MovieSlideData với item vừa được thêm
        setMovieSlideData([...movieSlideData, newMovieSlide]);

        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      toast.error(`Đã xảy ra lỗi :${error}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return; // kiểm tra sớm

    setIsLoading(true);
    try {
      await MovieSlideService.deleteMovieSlide(deleteId); // Thực hiện xóa
      setMovieSlideData((prevData) =>
        prevData.filter((movieSlide) => movieSlide.id !== deleteId)
      );
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsLoading(false); // Đảm bảo tắt loading trong mọi trường hợp
    }
  };
  console.log(formData);

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-12 mb-3">
          <Form.Group controlId="formPosition">
            <Form.Label>
              Nhập vị trí <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="position"
              value={formData.position}
              min="1"
              max="5"
              onChange={(e) => handleInputChange("position", e.target.value)}
              isInvalid={!!errorFields.position}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.position}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formCategory" className="mt-3">
            <Form.Label>
              Chọn phim liên kết<span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listMovieOption} // Danh sách các tùy chọn loại sản phẩm
              value={listMovieOption.find(
                (option) => option.value === formData.movieId
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "movieId",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Chọn phim"
              isInvalid={!!errorFields.movieId}
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
              styles={{
                menu: (provided) => ({
                  ...provided,
                }),
              }}
            />
            {errorFields.movieId && (
              <div className="invalid-feedback d-block">
                {errorFields.movieId}
              </div>
            )}
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý phân loại - Star Movie</title>
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
            columns={movieSlideColumns}
            data={movieSlideData}
            title={"Quản lý danh mục"}
            defaultColumns={movieSlideColumns}
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

export default MovieSlideManagement;
