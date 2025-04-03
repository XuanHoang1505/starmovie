import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableManagement, Page500 } from "../../../components/admin/index";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";
import Select from "react-select";
import MovieService from "../../../services/admin/MovieService";
import {
  formatDateTimeToDMY,
  formatDateTimeToISO,
} from "../../../utils/formatDate";
import GenreService from "../../../services/admin/GenreService";
import CategoryService from "../../../services/admin/CategoryService";

const MovieManagement = () => {
  // State để lưu trữ dữ liệu sản phẩm từ API
  const [movieData, setMovieData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    poster: "",
    description: "",
    releaseDate: "",
    rating: "",
    TrailerUrl: "",
    genres: [],
    categories: [],
  }); // State quản lý dữ liệu hiện tại
  const [imageFile, setImageFile] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

  const [listCategoryOption, setListCategoryOption] = useState([]);
  const [listGenreOption, setListGenreOption] = useState([]);

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
  const movieColumns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Tiêu đề phim" },
    { key: "poster", label: "Poster" },
    { key: "trailerUrl", label: "Video Giới thiệu" },
    { key: "description", label: "Mô tả" },
    { key: "releaseDate", label: "Ngày phát hành" },
    { key: "rating", label: "Đánh giá" },
    { key: "genres", label: "Các thể loại" },
    { key: "categories", label: "Các danh mục" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi discountColumns
  const keysToRemove = ["description", "releaseDate"];
  const defaultColumns = movieColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchMovieData = async () => {
    setLoadingPage(true);
    try {
      // Fetch danh sách phim
      const movies = await MovieService.getMovies();

      // Format dữ liệu phim
      const formattedMovies = movies.map((movie) => ({
        ...movie,
        releaseDate: formatDateTimeToDMY(movie.releaseDate),
        rating: Number(movie.rating).toFixed(1),
      }));

      setMovieData(formattedMovies); // Lưu vào state
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }

    try {
      let genres = await GenreService.getGenres();
      const genreOptions = genres.map((genre) => ({
        value: genre.id,
        label: genre.genreName,
      }));
      setListGenreOption(genreOptions);

      let categories = await CategoryService.getCategories();
      const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.categoryName,
      }));
      setListCategoryOption(categoryOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách thể loại hoặc danh mục phim");
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchMovieData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "title":
        if (!value || value.trim() === "") {
          error = "Tiêu đề phim không được để trống.";
        }
        break;

      case "releaseDate":
        if (!value) {
          error = "Ngày phát hành không được để trống.";
        } else {
          const releaseDate = new Date(value);
          if (isNaN(releaseDate.getTime())) {
            error = "Ngày phát hành không hợp lệ.";
          }
        }
        break;

      case "rating":
        if (value === "" || value === null) {
          error = "Đánh giá không được để trống.";
        } else if (isNaN(value) || value < 0 || value > 5) {
          error = "Đánh giá phải là một số từ 0 đến 5.";
        }
        break;

      case "genres":
        if (!value || value.length === 0) {
          error = "Phim phải có ít nhất một thể loại.";
        }
        break;

      case "categories":
        if (!value || value.length === 0) {
          error = "Phim phải thuộc ít nhất một danh mục.";
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

    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Tiêu đề phim không được để trống.";
    }

    if (!formData.poster || formData.poster.trim() === "") {
      newErrors.poster = "Poster không được để trống.";
    }

    if (!formData.description || formData.description.trim().length < 5) {
      newErrors.description = "Mô tả phim phải có ít nhất 10 ký tự.";
    }

    if (!formData.releaseDate) {
      newErrors.releaseDate = "Ngày phát hành không được để trống.";
    } else {
      const releaseDate = new Date(formData.releaseDate);
      if (isNaN(releaseDate.getTime())) {
        newErrors.releaseDate = "Ngày phát hành không hợp lệ.";
      }
    }

    if (formData.rating === "" || formData.rating === null) {
      newErrors.rating = "Đánh giá không được để trống.";
    } else if (
      isNaN(formData.rating) ||
      formData.rating < 0 ||
      formData.rating > 5
    ) {
      newErrors.rating = "Đánh giá phải là số từ 0 đến 5.";
    }

    if (!formData.genres || formData.genres.length === 0) {
      newErrors.genres = "Phim phải có ít nhất một thể loại.";
    }

    if (!formData.categories || formData.categories.length === 0) {
      newErrors.categories = "Phim phải thuộc ít nhất một danh mục.";
    }

    if (
      formData.trailerUrl &&
      !formData.trailerUrl.startsWith("blob:") && // Bỏ qua nếu là blob URL
      !/^https?:\/\/\S+$/.test(formData.trailerUrl)
    ) {
      newErrors.trailerUrl = "URL trailer không hợp lệ.";
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
      title: "",
      poster: "",
      description: "",
      image: "", // Thêm trường image nếu cần
      releaseDate: "",
      rating: "",
      trailerUrl: "",
      genres: [],
      categories: [],
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    console.log(item);

    setFormData({
      ...item,
      releaseDate: formatDateTimeToISO(item.releaseDate), // Định dạng ngày phát hành
      rating: item.rating || 0, // Đảm bảo rating luôn có giá trị
      poster: item.poster || "", // Đảm bảo poster tồn tại
      trailerUrl: item.trailerUrl || "", // Đảm bảo trailerUrl tồn tại
      genres: item.genres,
      categories: item.categories,
    });
    console.log(formData);

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
        // Gọi API cập nhật sử dụng MovieService
        const updatedMovie = await MovieService.updateMovie(
          formData.id,
          formData,
          videoFile,
          imageFile
        );

        if (!updatedMovie || !updatedMovie.releaseDate) {
          toast.error("Lỗi khi cập nhật phim. Dữ liệu không hợp lệ!");
          return false;
        }
        const formattedMovie = {
          ...updatedMovie,
          releaseDate: formatDateTimeToDMY(updatedMovie.releaseDate),
        };

        // Cập nhật state movieData với movie đã được sửa
        const updatedMovies = movieData.map((movie) =>
          movie.id === formattedMovie.id ? formattedMovie : movie
        );

        setMovieData(updatedMovies);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newMovie = await MovieService.createMovie(
          formData,
          videoFile,
          imageFile
        );
        console.log(newMovie);

        // Đổi định dạng ngày giờ trước khi lưu vào mảng
        const formattedMovie = {
          ...newMovie,
          releaseDate: formatDateTimeToDMY(newMovie.releaseDate),
        };

        // Cập nhật mảng movieData với item vừa được thêm
        setMovieData([...movieData, formattedMovie]);
        toast.success("Thêm mới phim thành công!");
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
      await MovieService.deleteMovie(deleteId); // Thực hiện xóa
      setMovieData((prevData) =>
        prevData.filter((movie) => movie.id !== deleteId)
      );
      toast.success("Xóa phim thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      toast.error("Xóa không thành công!");
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
            Poster Phim <span className="text-danger">(*)</span>
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
            {formData.poster ? (
              <img
                src={formData.poster}
                alt="Poster phim"
                className="w-100 h-100 object-fit-cover rounded"
              />
            ) : (
              <span className="text-muted">Chưa có hình ảnh nào</span>
            )}
          </div>
          <Form.Group controlId="formPoster">
            <Form.Control
              type="file"
              name="poster"
              accept="poster/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setImageFile(file); // lưu file vào imgFile để guwỉ lên server
                  const fileUrl = URL.createObjectURL(file);
                  handleInputChange("poster", fileUrl); // lưu file vào img để xem trước
                } else {
                  // Nếu người dùng xóa hình ảnh đã chọn thì xóa cả image và imageFile
                  handleInputChange("poster", "");
                  setImageFile("");
                }
              }}
              isInvalid={!!errorFields.poster}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.poster}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formGenre" className="mt-3">
            <Form.Label>
              Thể loại phim <span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listGenreOption} // Danh sách các loại sản phẩm
              value={listGenreOption.filter((option) =>
                formData.genres.some((genre) => genre.id === option.value)
              )}
              onChange={(selectedOptions) =>
                handleInputChange(
                  "genres",
                  selectedOptions
                    ? selectedOptions.map((option) => ({
                        id: option.value,
                        genreName: option.label,
                      }))
                    : []
                )
              }
              placeholder="Chọn thể loại phim"
              isInvalid={!!errorFields.genres}
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
              isMulti={true} // Cho phép chọn nhiều loại sản phẩm
              styles={{
                menu: (provided) => ({
                  ...provided,
                }),
              }}
            />
            {errorFields.genres && (
              <div className="invalid-feedback d-block">
                {errorFields.genres}
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="formCategory" className="mt-3">
            <Form.Label>
              Danh mục phim <span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listCategoryOption} // Danh sách các danh mục phim
              value={listCategoryOption.filter((option) =>
                formData.categories.some(
                  (category) => category.id === option.value
                )
              )}
              onChange={(selectedOptions) =>
                handleInputChange(
                  "categories",
                  selectedOptions
                    ? selectedOptions.map((option) => ({
                        id: option.value,
                        categoryName: option.label,
                      }))
                    : []
                )
              }
              placeholder="Chọn danh mục phim"
              isInvalid={!!errorFields.categories}
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
              isMulti={true} // Cho phép chọn nhiều danh mục phim
              styles={{
                menu: (provided) => ({
                  ...provided,
                }),
              }}
            />
            {errorFields.categories && (
              <div className="invalid-feedback d-block">
                {errorFields.categories}
              </div>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formTitle">
            <Form.Label>
              Tên phim <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              maxLength={100}
              onChange={(e) => handleInputChange("title", e.target.value)}
              isInvalid={!!errorFields.title}
              placeholder="Nhập vào tên phim"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Label>
            Trailer Phim <span className="text-danger">(*)</span>
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
            {formData.trailerUrl ? (
              <video
                src={formData.trailerUrl}
                controls
                className="w-100 h-100 object-fit-cover rounded"
              />
            ) : (
              <span className="text-muted">Chưa có video nào</span>
            )}
          </div>
          <Form.Group controlId="formVideo">
            <Form.Control
              type="file"
              name="video"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setVideoFile(file); // lưu file vào imgFile để guwỉ lên server
                  const fileUrl = URL.createObjectURL(file);
                  handleInputChange("trailerUrl", fileUrl); // lưu file vào img để xem trước
                } else {
                  // Nếu người dùng xóa hình ảnh đã chọn thì xóa cả image và imageFile
                  handleInputChange("trailerUrl", "");
                  setVideoFile("");
                }
              }}
              isInvalid={!!errorFields.video}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.image}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formReleaseDate">
            <Form.Label>
              Ngày phát hành <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={(e) => handleInputChange("releaseDate", e.target.value)}
              isInvalid={!!errorFields.releaseDate}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.releaseDate}
            </Form.Control.Feedback>
          </Form.Group>

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
        {/* <div className="row"> */}
        <div className="col-md-12 mb-2">
          <Form.Group controlId="formDescription">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Viết mô tả cho phim..."
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
        <title>Quản lý phim - Star Movie</title>
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
            columns={movieColumns}
            data={movieData}
            title={"Quản lý phim"}
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

export default MovieManagement;
