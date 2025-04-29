import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableManagement, Page500 } from "../../../components/admin/index";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";
import Select from "react-select";
import CommentService from "../../../services/admin/CommentService";
import EpisodeService from "../../../services/admin/EpisodeService";
import UserService from "../../../services/admin/UserService";

const CommentManagement = () => {
  // State để lưu trữ dữ liệu sản phẩm từ API
  const [commentData, setCommentData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    episodeId: "",
    content: "",
    parentCommentId: "",
  }); // State quản lý dữ liệu hiện tại

  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

  const [listUserOption, setListUserOption] = useState([]);
  const [listEpisodeOption, setListEpisodeOption] = useState([]);
  const [listParentCommentOption, setListParentCommentOption] = useState([]);

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
  const commentColumns = [
    { key: "id", label: "ID" },
    { key: "fullName", label: "Nguời bình luận" },
    { key: "episodeTitle", label: "Tập phim - Phim" },
    { key: "content", label: "Bình luận" },
    { key: "timestamp", label: "Thời gian bình luận" },
    { key: "parentContent", label: "Bình luận cha" },
    { key: "parentCommentId", label: "ID bình luận cha" },
    { key: "userId", label: "ID nguời dùng" },
    { key: "episodeId", label: "ID tập phim" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi commentColumns
  const keysToRemove = [
    "timestamp",
    "parentContent",
    "parentCommentId",
    "userId",
    "episodeId",
  ];
  const defaultColumns = commentColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchCommentData = async () => {
    setLoadingPage(true);
    try {
      // Fetch danh sách phim
      const comments = await CommentService.getComments();
      const formattedComments = comments.map((comment) => ({
        ...comment,
        episodeTitle: `${comment.episodeTitle} - ${comment.movieTitle}`,
      }));
      setCommentData(formattedComments); // Lưu vào state
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }

    try {
      let episodes = await EpisodeService.getEpisodes();
      const episodeOptions = episodes.map((episode) => ({
        value: episode.id,
        label: episode.episodeTitle,
      }));
      setListEpisodeOption(episodeOptions);

      let users = await UserService.getUsers();
      const userOptions = users.map((user) => ({
        value: user.id,
        label: user.fullName,
      }));

      setListUserOption(userOptions);

      const comments = await CommentService.getComments();
      const parentCommentOptions = comments.map((comment) => ({
        value: comment.id,
        label: `#${comment.id} - ${comment.content}`,
      }));

      setListParentCommentOption(parentCommentOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách thể loại hoặc danh mục phim");
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchCommentData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "content":
        if (value === "" || value === null) {
          error = "Nội dung bình luận không được để trống.";
        }
        break;

      case "episodeId":
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

    if (!formData.episodeId || formData.episodeId === "") {
      newErrors.episodeId = "Lựa chọn phim không được để trống.";
    }

    if (!formData.userId || formData.userId === "") {
      newErrors.userId = "Lựa chọn người bình luận không được để trống.";
    }

    if (!formData.content || formData.content.trim() === "") {
      newErrors.content = "Nội dung bình luận không được để trống.";
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
      episodeId: "",
      content: "",
      parentCommentId: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    console.log(item);
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
        // Gọi API cập nhật sử dụng CommentService
        const updatedComment = await CommentService.updateComment(
          formData.id,
          formData
        );

        // Cập nhật state commentData với comment đã được sửa
        const updatedComments = commentData.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        );

        setCommentData(updatedComments);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const formatData = {
          ...formData,
          id: null, // Đặt id là null để server tự động tạo
          parentCommentId:
            formData.parentCommentId === "" ? null : formData.parentCommentId,
        }; // loại bỏ id khỏi formData
        const newComment = await CommentService.createComment(formatData);

        fetchCommentData();

        // Cập nhật mảng commentData với item vừa được thêm
        setCommentData([...commentData, newComment]);
        toast.success("Thêm mới bình luận thành công!");
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
      await CommentService.deleteComment(deleteId); // Thực hiện xóa
      setCommentData((prevData) =>
        prevData.filter((comment) => comment.id !== deleteId)
      );
      toast.success("Xóa bình luận thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      toast.error("Xóa không thành công!");
    } finally {
      setIsLoading(false); // Đảm bảo tắt loading trong mọi trường hợp
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          {/* Phần chọn tập phim */}
          <Form.Group controlId="formEpisode" className="mt-3">
            <Form.Label>
              Chọn tập phim bình luận<span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listEpisodeOption} // Danh sách các tùy chọn loại sản phẩm
              value={listEpisodeOption.find(
                (option) => option.value === formData.episodeId
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "episodeId",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Chọn phim bình luận"
              isInvalid={!!errorFields.episodeId}
              isDisabled={statusFunction.isEditing} // Disable nếu không phải trạng thái thêm mới
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
              styles={{
                menu: (provided) => ({
                  ...provided,
                }),
              }}
            />
            {errorFields.episodeId && (
              <div className="invalid-feedback d-block">
                {errorFields.episodeId}
              </div>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          {/* Phần chọn người dùng */}
          <Form.Group controlId="formUser" className="mt-3">
            <Form.Label>
              Chọn nguời dùng bình luận<span className="text-danger">(*)</span>
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
              placeholder="Chọn người bình luận"
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
          {/* Phần chọn bình luận cha */}
          <Form.Group controlId="formParentComment" className="mt-3">
            <Form.Label>Chọn bình luận cha</Form.Label>
            <Select
              options={listParentCommentOption} // Danh sách các tùy chọn loại sản phẩm
              value={listParentCommentOption.find(
                (option) => option.value === formData.parentCommentId
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "parentCommentId",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Chọn phim bình luận"
              isInvalid={!!errorFields.parentCommentId}
              isDisabled={statusFunction.isEditing} // Disable nếu không phải trạng thái thêm mới
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
              styles={{
                menu: (provided) => ({
                  ...provided,
                }),
              }}
            />
          </Form.Group>
        </div>
        {/* <div className="row"> */}
        <div className="col-md-12 mb-2">
          <Form.Group controlId="formContent">
            <Form.Label>Bình luận</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="content"
              value={formData.content || ""}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Viết nội dung bình luận ..."
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
        <title>Quản lý bình luận - Star Movie</title>
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
            columns={commentColumns}
            data={commentData}
            title={"Quản lý bình luận"}
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

export default CommentManagement;
