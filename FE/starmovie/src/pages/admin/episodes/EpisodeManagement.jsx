import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableManagement, Page500 } from "../../../components/admin/index";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import EpisodeService from "../../../services/admin/EpisodeService";
import MovieService from "../../../services/admin/MovieService";
import {
  formatDateTimeToDMY,
  formatDateTimeToISO,
} from "../../../utils/formatDate";

const EpisodeManagement = () => {
  // State để lưu trữ dữ liệu tập phim từ API
  const [movieData, setEpisodeData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    episodeTitle: "",
    duration: "00:00:00",
    releaseDate: "",
    image: "",
    trailerUrl: "",
    movieUrl: "",
    movieId: "",
  }); // State quản lý dữ liệu hiện tại
  const [imageFile, setImageFile] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [trailerFile, setTrailerFile] = useState("");
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

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
  const episodeColumns = [
    { key: "id", label: "ID" },
    { key: "episodeTitle", label: "Tiêu đề tập phim" },
    { key: "duration", label: "Thời lượng" },
    { key: "releaseDate", label: "Ngày phát hành" },
    { key: "image", label: "Ảnh của tập phim" },
    { key: "trailerUrl", label: "Video Giới thiệu" },
    { key: "movieUrl", label: "Video phim" },
    { key: "movieId", label: "Mã phim" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi discountColumns
  const keysToRemove = ["releaseDate"];
  const defaultColumns = episodeColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchEpisodeData = async () => {
    setLoadingPage(true);
    try {
      // Fetch danh sách phim
      const episodes = await EpisodeService.getEpisodes();

      // Format dữ liệu phim
      const formattedEpisodes = episodes.map((episode) => ({
        ...episode,
        releaseDate: formatDateTimeToDMY(episode.releaseDate),
      }));
      setEpisodeData(formattedEpisodes); // Lưu vào state
    } catch (err) {
      setErrorServer(err.message);
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
      toast.error("Lỗi khi lấy danh sách loại sản phẩm");
    }
  };
  // Gọi API khi component mount
  useEffect(() => {
    fetchEpisodeData();
  }, []);
  useEffect(() => {
    fetchMovies();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "episodeTitle":
        if (!value || value.trim() === "") {
          error = "Tiêu đề tập phim không được để trống.";
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

    // Kiểm tra tiêu đề tập phim
    if (!formData.episodeTitle || formData.episodeTitle.trim() === "") {
      newErrors.episodeTitle = "Tiêu đề tập phim không được để trống.";
    }

    // Kiểm tra ngày phát hành
    if (!formData.releaseDate) {
      newErrors.releaseDate = "Ngày phát hành không được để trống.";
    } else {
      const releaseDate = new Date(formData.releaseDate);
      if (isNaN(releaseDate.getTime())) {
        newErrors.releaseDate = "Ngày phát hành không hợp lệ.";
      }
    }

    // Kiểm tra ảnh tập phim
    if (!formData.image || formData.image.trim() === "") {
      newErrors.image = "Poster không được để trống.";
    }

    // Kiểm tra URL trailer
    if (
      formData.trailerUrl &&
      !formData.trailerUrl.startsWith("blob:") && // Bỏ qua nếu là blob URL
      !/^https?:\/\/\S+$/.test(formData.trailerUrl)
    ) {
      newErrors.trailerUrl = "URL trailer không hợp lệ.";
    }

    if (
      formData.movieUrl &&
      !formData.movieUrl.startsWith("blob:") && // Bỏ qua nếu là blob URL
      !/^https?:\/\/\S+$/.test(formData.movieUrl)
    ) {
      newErrors.movieUrl = "URL tập phim không hợp lệ.";
    }

    // Kiểm tra ID phim
    if (!formData.movieId || isNaN(formData.movieId) || formData.movieId <= 0) {
      newErrors.movieId = "ID phim không hợp lệ.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback(
    (key, value) => {
      setFormData((prevData) => {
        if (prevData[key] !== value) {
          validateField(key, value);
          return { ...prevData, [key]: value };
        }
        return prevData;
      });
    },
    [setFormData]
  );

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
      episodeTitle: "",
      duration: "00:00:00",
      releaseDate: "",
      image: "",
      trailerUrl: "",
      movieUrl: "",
      movieId: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    console.log("Dữ liệu item trước khi chỉnh sửa:", item);

    setFormData((prevFormData) => ({
      ...prevFormData,
      ...item,
      releaseDate: formatDateTimeToISO(item.releaseDate), // Format lại ngày
      image: item.image ?? "",
      trailerUrl: item.trailerUrl ?? "",
      movieUrl: item.movieUrl ?? "",
      movieId: item.movieId ?? "",
      movieTitle: item.movieTitle ?? "",
      duration: item.duration ?? "",
    }));

    // Đợi `setFormData` cập nhật xong rồi mới log ra console
    setTimeout(() => {
      console.log("Dữ liệu formData sau khi chỉnh sửa:", formData);
    }, 0);

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
        // Gọi API cập nhật sử dụng EpisodeService
        const updatedEpisode = await EpisodeService.updateEpisode(
          formData.id,
          formData,
          imageFile,
          trailerFile,
          videoFile
        );

        if (!updatedEpisode || !updatedEpisode.releaseDate) {
          toast.error("Lỗi khi cập nhật phim. Dữ liệu không hợp lệ!");
          return false;
        }
        const formattedEpisode = {
          ...updatedEpisode,
          releaseDate: formatDateTimeToDMY(updatedEpisode.releaseDate),
        };

        // Cập nhật state movieData với movie đã được sửa
        const updatedEpisodes = movieData.map((movie) =>
          movie.id === formattedEpisode.id ? formattedEpisode : movie
        );

        setEpisodeData(updatedEpisodes);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newEpisode = await EpisodeService.createEpisode(
          formData,
          imageFile,
          trailerFile,
          videoFile
        );

        // Đổi định dạng ngày giờ trước khi lưu vào mảng
        const formattedEpisode = {
          ...newEpisode,
          releaseDate: formatDateTimeToDMY(newEpisode.releaseDate),
        };

        // Cập nhật mảng movieData với item vừa được thêm
        setEpisodeData([...movieData, formattedEpisode]);
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
      await EpisodeService.deleteEpisode(deleteId); // Thực hiện xóa
      setEpisodeData((prevData) =>
        prevData.filter((movie) => movie.id !== deleteId)
      );
      toast.success("Xóa tập phim thành công!");
    } catch (error) {
      console.error("Lỗi khi tập xóa phim:", error);
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
            Poster tập phim <span className="text-danger">(*)</span>
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
            {formData.image ? (
              <img
                src={formData.image}
                alt="Poster phim"
                className="w-100 h-100 object-fit-cover rounded"
              />
            ) : (
              <span className="text-muted">Chưa có hình ảnh nào</span>
            )}
          </div>
          <Form.Group controlId="formImage">
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setImageFile(file); // lưu file vào imgFile để guwỉ lên server
                  const fileUrl = URL.createObjectURL(file);
                  handleInputChange("image", fileUrl); // lưu file vào img để xem trước
                } else {
                  // Nếu người dùng xóa hình ảnh đã chọn thì xóa cả image và imageFile
                  handleInputChange("image", "");
                  setImageFile("");
                }
              }}
              isInvalid={!!errorFields.poster}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.image}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formEpisodeTitle">
            <Form.Label>
              Tên tập phim <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="episodeTitle"
              value={formData.episodeTitle}
              maxLength={100}
              onChange={(e) =>
                handleInputChange("episodeTitle", e.target.value)
              }
              isInvalid={!!errorFields.episodeTitle}
              placeholder="Nhập vào tên tập phim"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.episodeTitle}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formCategory" className="mt-3">
            <Form.Label>
              Phim <span className="text-danger">(*)</span>
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

        <div className="col-md-6 mb-3">
          <Form.Label>
            Trailer tập phim <span className="text-danger">(*)</span>
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
          <Form.Group controlId="formTrailer">
            <Form.Control
              type="file"
              name="trailer"
              accept="trailer/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setTrailerFile(file); // lưu file vào imgFile để guwỉ lên server
                  const fileUrl = URL.createObjectURL(file);
                  handleInputChange("trailerUrl", fileUrl); // lưu file vào img để xem trước
                } else {
                  // Nếu người dùng xóa hình ảnh đã chọn thì xóa cả image và imageFile
                  handleInputChange("trailerUrl", "");
                  setTrailerFile("");
                }
              }}
              isInvalid={!!errorFields.trailerUrl}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.trailerUrl}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Label>
            Video tập phim <span className="text-danger">(*)</span>
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
            {formData.movieUrl ? (
              <video
                src={formData.movieUrl}
                controls
                className="w-100 h-100 object-fit-cover rounded"
              />
            ) : (
              <span className="text-muted">Chưa có video nào</span>
            )}
          </div>
          <Form.Group controlId="formMovieUrl">
            <Form.Control
              type="file"
              name="video"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setVideoFile(file); // lưu file vào imgFile để guwỉ lên server
                  const fileUrl = URL.createObjectURL(file);
                  handleInputChange("movieUrl", fileUrl); // lưu file vào img để xem trước
                } else {
                  // Nếu người dùng xóa hình ảnh đã chọn thì xóa cả image và imageFile
                  handleInputChange("movieUrl", "");
                  setVideoFile("");
                }
              }}
              isInvalid={!!errorFields.movieUrl}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.movieUrl}
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

          <Form.Group controlId="formDuration">
            <Form.Label>
              Thời lượng phim <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="time"
              step="1" // Cho phép nhập giây
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              isInvalid={!!errorFields.duration}
              required
            />
            {errorFields.duration && (
              <div className="invalid-feedback d-block">
                {errorFields.duration}
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
            columns={episodeColumns}
            data={movieData}
            title={"Quản lý tập phim"}
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

export default EpisodeManagement;
