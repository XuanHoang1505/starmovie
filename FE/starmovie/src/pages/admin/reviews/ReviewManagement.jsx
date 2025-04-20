import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableManagement, Page500 } from "../../../components/admin/index";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";
import Select from "react-select";
import ReviewService from "../../../services/admin/ReviewService";
import MovieService from "../../../services/admin/MovieService";
import UserService from "../../../services/admin/UserService";

const ReviewManagement = () => {
  // State để lưu trữ dữ liệu sản phẩm từ API
  const [reviewData, setReviewData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    movieId: "",
    rating: "",
    comment: "",
  }); // State quản lý dữ liệu hiện tại

  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

  const [listUserOption, setListUserOption] = useState([]);
  const [listMovieOption, setListMovieOption] = useState([]);

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
  const reviewColumns = [
    { key: "id", label: "ID" },
    { key: "username", label: "Nguời đánh giá" },
    { key: "movieTitle", label: "Phim đánh giá" },
    { key: "rating", label: "Số sao đánh giá" },
    { key: "comment", label: "Bình luận" },
    { key: "timestamp", label: "Thời gian đánh giá" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi discountColumns
  const keysToRemove = ["timestamp", "comment"];
  const defaultColumns = reviewColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchReviewData = async () => {
    setLoadingPage(true);
    try {
      // Fetch danh sách phim
      const reviews = await ReviewService.getReviews();

      setReviewData(reviews); // Lưu vào state
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }

    try {
      let movies = await MovieService.getMovies();
      const movieOptions = movies.map((movie) => ({
        value: movie.id,
        label: movie.title,
      }));
      setListMovieOption(movieOptions);

      let users = await UserService.getUsers();
      console.log(users);
      const userOptions = users.map((user) => ({
        value: user.id,
        label: user.fullName,
      }));

      console.log(userOptions);
      setListUserOption(userOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách thể loại hoặc danh mục phim");
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchReviewData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "rating":
        if (value === "" || value === null) {
          error = "Đánh giá không được để trống.";
        } else if (isNaN(value) || value < 0 || value > 5) {
          error = "Đánh giá phải là một số từ 0 đến 5.";
        }
        break;

      case "movieId":
        if (!value || value.length === 0) {
          error = "Lựa chọn phim không được để trống.";
        }
        break;

      case "userId":
        if (!value || value.length === 0) {
          error = "Lựa chọn người bình luận không được để trống.";
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

    if (formData.rating === "" || formData.rating === null) {
      newErrors.rating = "Đánh giá không được để trống.";
    } else if (
      isNaN(formData.rating) ||
      formData.rating < 0 ||
      formData.rating > 5
    ) {
      newErrors.rating = "Đánh giá phải là số từ 0 đến 5.";
    }

    if (!formData.movieId || formData.movieId === "") {
      newErrors.movieId = "Lựa chọn phim không được để trống.";
    }

    if (!formData.userId || formData.userId === "") {
      newErrors.userId = "Lựa chọn người bình luận không được để trống.";
    }

    setErrorFields(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData((preData) => ({ ...preData, [key]: value }));
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
      id: "",
      userId: "",
      movieId: "",
      rating: "",
      comment: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    setFormData({
      ...item,
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) {
      return false;
    }

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng ReviewService
        const updatedReview = await ReviewService.updateReview(
          formData.id,
          formData
        );

        // Cập nhật state reviewData với review đã được sửa
        const updatedReviews = reviewData.map((review) =>
          review.id === updatedReview.id ? updatedReview : review
        );

        setReviewData(updatedReviews);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const { id, ...rest } = formData; // loại bỏ id khỏi formData
        const newReview = await ReviewService.createReview(rest);

        fetchReviewData();

        // Cập nhật mảng reviewData với item vừa được thêm
        setReviewData([...reviewData, newReview]);
        toast.success("Thêm mới đánh giá thành công!");
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
      await ReviewService.deleteReview(deleteId); // Thực hiện xóa
      setReviewData((prevData) =>
        prevData.filter((review) => review.id !== deleteId)
      );
      toast.success("Xóa đánh giá thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      toast.error("Xóa không thành công!");
    } finally {
      setIsLoading(false); // Đảm bảo tắt loading trong mọi trường hợp
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          {/* Phần chọn phim */}
          <Form.Group controlId="formMovie" className="mt-3">
            <Form.Label>
              Chọn phim đánh giá<span className="text-danger">(*)</span>
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
              placeholder="Chọn phim đánh giá"
              isInvalid={!!errorFields.movieId}
              isDisabled={statusFunction.isEditing} // Disable nếu không phải trạng thái thêm mới
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

          {/* Phần đánh giá */}
          <Form.Group controlId="formRating">
            <Form.Label>
              Đánh giá <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="rating"
              value={formData.rating}
              min="1"
              max="5"
              onChange={(e) => handleInputChange("rating", e.target.value)}
              isInvalid={!!errorFields.rating}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.rating}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          {/* Phần chọn người dùng */}
          <Form.Group controlId="formUser" className="mt-3">
            <Form.Label>
              Chọn nguời dùng đánh giá<span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listUserOption} // Danh sách các tùy chọn loại sản phẩm
              value={listUserOption.find(
                (option) => option.value === formData.userId
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "userId",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Chọn người đánh giá"
              isInvalid={!!errorFields.userId}
              isDisabled={statusFunction.isEditing} // Disable nếu không phải trạng thái thêm mới
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
              styles={{
                menu: (provided) => ({
                  ...provided,
                }),
              }}
            />
            {errorFields.userId && (
              <div className="invalid-feedback d-block">
                {errorFields.userId}
              </div>
            )}
          </Form.Group>
        </div>
        {/* <div className="row"> */}
        <div className="col-md-12 mb-2">
          <Form.Group controlId="formComment">
            <Form.Label>Bình luận</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comment"
              value={formData.comment || ""}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              placeholder="Viết bình luận cho đánh giá ..."
            />
          </Form.Group>
        </div>
        {/* </div> */}
      </div>
    </>
  );
  return (
    <>
      <Helmet>
        <title>Quản lý đánh giá - Star Movie</title>
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
            columns={reviewColumns}
            data={reviewData}
            title={"Quản lý đánh giá"}
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
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

export default ReviewManagement;
