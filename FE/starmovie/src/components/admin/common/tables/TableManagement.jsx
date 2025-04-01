import { useState } from "react";
import CustomModal from "../CustomModal";
import ImageModal from "../ImageModal";
import DeleteModal from "../DeleteModal";
import "../../../../assets/admin/css/table-management.css";
import defaultImage from "../../../../assets/admin/images/defaultImage.png";
import defaultVideo from "../../../../assets/admin/images/defaultVideo.png";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableFooter from "./TableFooter";
import { Badge } from "react-bootstrap";
import VideoModal from "../VideoModal";

const TableManagement = ({
  data,
  columns,
  title,
  defaultColumns,
  modalContent,
  statusFunction,
  handleReset,
  onEdit,
  onViewDetail,
  handleSaveItem,
  onDelete,
  onSetting,
  isLoading,
  buttonCustom,
  onResetStatus,
}) => {
  // State management
  const [visibleColumns, setVisibleColumns] = useState(
    defaultColumns.map((col) => col.key)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [showModal, setShowModal] = useState(false); // Hiển thị modal thêm/sửa
  const [deleteId, setDeleteId] = useState(null); // ID của item cần xóa
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Hiển thị modal xác nhận xóa
  const [expandedRows, setExpandedRows] = useState([]); // Theo dõi các hàng đang được mở
  const [showModalImage, setShowModalImage] = useState(false); // Hiển thị modal hình ảnh lớn
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModalVideo, setShowModalVideo] = useState(false); // Hiển thị modal hình ảnh lớn
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleRenderBtn = () => {
    // Danh sách button mặc định nếu button không được định nghĩa
    const defaultButtonConfig = {
      btnAdd: true,
      btnEdit: true,
      btnDelete: true,
      btnDetail: false,
      btnSetting: true,
    };

    // Sử dụng buttonCustom nếu có, nếu không thì lấy defaultButtonConfig
    const buttonConfig = buttonCustom ?? defaultButtonConfig;
    return buttonConfig;
  };

  // Hàm render custom cell dựa trên loại cột
  const renderCustomCell = (column, item) => {
    switch (column.key) {
      case "status":
        // eslint-disable-next-line no-case-declarations
        let statusClass = "";
        // eslint-disable-next-line no-case-declarations
        let statusText = "";

        switch (item.status) {
          case "ACTIVE":
            statusClass = "text-bg-success";
            statusText = "Hoạt động";
            break;
          case "DISABLED":
            statusClass = "text-bg-secondary";
            statusText = "Vô hiệu hóa";
            break;
          case "PENDING":
            statusClass = "text-bg-warning";
            statusText = "Đang chờ xử lý";
            break;
          case "COMPLETED":
            statusClass = "text-bg-success";
            statusText = "Hoàn thành";
            break;
          case "EXPIRED":
            statusClass = "text-bg-secondary";
            statusText = "Đã hết hạn";
            break;
          case true:
            statusClass = "text-bg-info";
            statusText = "Chưa xem";
            break;
          case false:
            statusClass = "text-bg-secondary";
            statusText = "Đã xem";
            break;
          default:
            statusClass = "text-bg-muted"; // Trường hợp mặc định
            statusText = "Không xác định";
        }

        return (
          <span
            className={`rounded-3 fw-bold px-2 py-1 ${statusClass}`}
            style={{ fontSize: "13px" }}
          >
            {statusText}
          </span>
        );
      case "image":
      case "avatar":
        return (
          <img
            src={item[column.key] || defaultImage} // Nếu item[column.key] không có, hiển thị ảnh mặc định
            alt={item.name || "Ảnh mặc định"} // Đổi alt thành "Default Image" nếu item.name không tồn tại
            className="object-fit-cover rounded-circle"
            style={{ width: "45px", height: "45px", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation(); // ngăn chặn sự kiện lan truyền sang cha.
              handleImageClick(item[column.key] || defaultImage);
            }}
          />
        );
      case "poster":
        return (
          <img
            src={item[column.key] || defaultImage} // Nếu item[column.key] không có, hiển thị ảnh mặc định
            alt={item.poster || "Ảnh mặc định"} // Đổi alt thành "Default Image" nếu item.name không tồn tại
            className="object-fit-cover"
            style={{ width: "45px", height: "45px", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation(); // ngăn chặn sự kiện lan truyền sang cha.
              handleImageClick(item[column.key] || defaultImage);
            }}
          />
        );
      case "trailerUrl":
        return item[column.key] ? (
          <img
            src={defaultVideo} // Nếu item[column.key] không có, hiển thị ảnh mặc định
            alt="Chưa có trailler" // Đổi alt thành "Default Image" nếu item.name không tồn tại
            className="object-fit-cover"
            onClick={(e) => {
              e.stopPropagation();
              handleVideoClick(item[column.key]);
            }}
            style={{ width: "60px", height: "45px", cursor: "pointer" }}
          />
        ) : (
          <p>Chưa có trailler</p>
        );
      case "images":
        return item[column.key] ? (
          <div
            className="py-3"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0",
            }}
          >
            {item[column.key]
              .split(",") // Tách chuỗi thành mảng các URL
              .map((image, index) => (
                <img
                  key={index}
                  src={image.trim() || defaultImage} // Xóa khoảng trắng dư thừa
                  alt={`Ảnh ${index + 1}`}
                  className="rounded-circle object-fit-cover"
                  style={{
                    width: "40px",
                    height: "40px",
                    position: "absolute",
                    left: `${index * 10}px`, // Dịch chuyển một chút sang phải
                    zIndex: index, // Mỗi ảnh có z-index tương ứng
                    cursor: "pointer",
                    transition: "transform 0.2s, z-index 0.2s",
                    border: "2px solid white", // Tạo đường viền giữa các ảnh
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.zIndex = 100; // Đưa ảnh lên trên cùng khi hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.zIndex = index; // Trả lại z-index ban đầu khi không hover
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
                    handleImageClick(image.trim());
                  }}
                />
              ))}
          </div>
        ) : (
          "Không có"
        );
      case "rating":
        // eslint-disable-next-line no-case-declarations
        const stars = [];

        for (let i = 1; i <= 5; i++) {
          if (i <= Math.floor(item.rating)) {
            stars.push(
              <i
                key={i}
                className="bi bi-star-fill text-warning me-1"
                style={{ fontSize: "15px" }}
              />
            );
          } else if (i === Math.ceil(item.rating) && item.rating % 1 !== 0) {
            stars.push(
              <i
                key={i}
                className="bi bi-star-half text-warning me-1"
                style={{ fontSize: "15px" }}
              />
            );
          } else {
            stars.push(
              <i
                key={i}
                className="bi bi-star text-warning me-1"
                style={{ fontSize: "15px" }}
              />
            );
          }
        }
        return <div>{stars}</div>;
      case "gender":
        return (
          <span className={`rounded-3 px-1 py-1 `}>
            {item.gender === true ? (
              <>
                <i className="bi bi-gender-male"></i> Nam
              </>
            ) : (
              <>
                <i className="bi bi-gender-female"></i> Nữ
              </>
            )}
          </span>
        );
      // case "vipType":
      //   let ticketTypeClass = "";
      //   let ticketTypeText = "";

      //   switch (item.ticketType) {
      //     case "ONETIME_TICKET":
      //       ticketTypeClass = "text-bg-primary"; // Vé cơ bản
      //       ticketTypeText = "Vé một lần";
      //       break;
      //     case "WEEKLY_TICKET":
      //       ticketTypeClass = "text-bg-success"; // Vé tuần
      //       ticketTypeText = "Vé tuần";
      //       break;
      //     case "MONTHLY_TICKET":
      //       ticketTypeClass = "text-bg-warning"; // Vé tháng (ưu đãi cao)
      //       ticketTypeText = "Vé tháng";
      //       break;
      //     case "STUDENT_TICKET":8
      //       ticketTypeClass = "text-bg-danger"; // Vé học viên
      //       ticketTypeText = "Vé học viên";
      //       break;
      //     default:
      //       ticketTypeClass = "text-bg-muted"; // Trường hợp mặc định
      //       ticketTypeText = "Không xác định";
      //   }

      //   return (
      //     <span
      //       className={`rounded-3 fw-bold px-2 py-1 ${ticketTypeClass}`}
      //       style={{ fontSize: "13px" }}
      //     >
      //       {ticketTypeText}
      //     </span>
      //   );

      case "role":
        return (
          <span className="d-flex align-items-center">
            {item.role === "ADMIN" && (
              <>
                <i className="bi bi-shield-fill text-danger fs-5 mx-1 me-1"></i>
                Quản Lý
              </>
            )}
            {item.role === "USER" && (
              <>
                <i className="bi bi-person-fill fs-4 text-info me-1"></i>Khách
                Hàng
              </>
            )}
          </span>
        );
      case "genres":
        return item.genres && item.genres.length > 0 ? (
          item.genres.map((genre, index) => (
            <Badge key={`genre-${index}`} variant="outline" className="mr-1">
              {genre.genreName}
            </Badge>
          ))
        ) : (
          <span>Không có thể loại</span>
        );

      case "categories":
        return item.categories && item.categories.length > 0 ? (
          item.categories.map((category, index) => (
            <Badge
              key={`category-${index}`}
              variant="secondary"
              className="mr-1"
            >
              {category.categoryName}
            </Badge>
          ))
        ) : (
          <span>Không có danh mục</span>
        );

      case "price":
        // eslint-disable-next-line no-case-declarations
        const formattedPrice = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(item[column.key]);
        return <span>{formattedPrice}</span>;

      case "percentage":
        return <span>{item[column.key]} %</span>;
      case "qrCodeBase64":
        return (
          <img
            src={`data:image/png;base64,${item.qrCodeBase64}`}
            alt="QR Code"
            width={45}
            height={45}
            style={{ objectFit: "cover", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation(); // ngăn chặn sự kiện lan truyền sang cha.
              handleImageClick(
                // eslint-disable-next-line no-constant-binary-expression
                `data:image/png;base64,${item.qrCodeBase64}` || defaultImage
              );
            }}
          />
        );
      case "progress":
        return (
          <div
            className="progress"
            style={{ height: "15px", width: "100px" }}
            role="progressbar"
            aria-label="Tiến trình lớp học"
            aria-valuenow={item[column.key]}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-success"
              style={{
                width: item[column.key],
                fontSize: "10px",
                fontWeight: "bolder",
              }}
            >
              {item[column.key]}%
            </div>
          </div>
        );

      default:
        return item[column.key] || (item[column.key] === 0 ? 0 : "Không có"); // Trả về giá trị mặc định nếu không cần custom
    }
  };

  // Xử lý toggle mở rộng hàng
  const handleRowToggle = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Tính toán tổng số trang
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Sắp xếp dữ liệu theo cấu hình hiện tại
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key) {
      let compareA = a[sortConfig.key];
      let compareB = b[sortConfig.key];

      // Chuẩn hóa dữ liệu dạng chuỗi để so sánh
      if (typeof compareA === "string" && typeof compareB === "string") {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      // So sánh theo chiều tăng hoặc giảm
      return sortConfig.direction === "asc"
        ? compareA > compareB
          ? 1
          : compareA < compareB
          ? -1
          : 0
        : compareA < compareB
        ? 1
        : compareA > compareB
        ? -1
        : 0;
    }
    return 0;
  });

  // Lọc dữ liệu theo từ khóa tìm kiếm và cột hiển thị
  const filteredData = sortedData.filter((item) =>
    visibleColumns.some((key) =>
      item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Phân trang dữ liệu
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Xử lý thay đổi số mục hiển thị mỗi trang
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Xử lý sắp xếp
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Xử lý ẩn/hiện các cột
  const handleColumnToggle = (key) => {
    setVisibleColumns((prevColumns) =>
      prevColumns.includes(key)
        ? prevColumns.filter((colKey) => colKey !== key)
        : [...prevColumns, key]
    );
  };
  const handleImageClick = (imageSrc) => {
    // xử lý khi click vào hình ảnh trên bảng
    setSelectedImage(imageSrc);
    setShowModalImage(true);
  };

  const handleVideoClick = (videoSrc) => {
    // xử lý khi video trên bảng
    setSelectedVideo(videoSrc);
    setShowModalVideo(true);
  };

  const handleCloseModalImage = () => setShowModalImage(false);

  const handleCloseVideo = () => setShowModalVideo(false);
  // Mở modal thêm/sửa
  const handleShowModal = () => setShowModal(true);

  // Đóng modal thêm/sửa
  const handleCloseModal = () => {
    onResetStatus(); // cập nhật trạng thái các công việc
    setShowModal(false); // Đóng modal
  };

  // Xử lý lưu dữ liệu
  const handleSubmit = async () => {
    if (await handleSaveItem()) {
      handleCloseModal();
    }
  };

  // Xử lý mở modal xác nhận xóa
  const handleShowConfirmModal = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  // Đóng modal xác nhận xóa
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  // Xác nhận xóa
  const handleConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      handleCloseConfirmModal();
    }
  };

  return (
    <div className="table__management bg-white col-12 p-4 rounded-3">
      <h5 className="mb-4 text-uppercase fw-bold">{title}</h5>
      {/* Table Header */}
      <TableHeader
        handleReset={handleReset}
        onSetting={onSetting}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleRenderBtn={handleRenderBtn}
        handleShowModal={handleShowModal}
        columns={columns}
        handleColumnToggle={handleColumnToggle}
        visibleColumns={visibleColumns}
      />
      {/* Table Body */}
      <TableBody
        columns={columns}
        currentData={currentData}
        expandedRows={expandedRows}
        handleRowToggle={handleRowToggle}
        renderCustomCell={renderCustomCell}
        visibleColumns={visibleColumns}
        handleSort={handleSort}
        sortConfig={sortConfig}
        handleRenderBtn={handleRenderBtn}
        onEdit={onEdit}
        handleShowModal={handleShowModal}
        handleShowConfirmModal={handleShowConfirmModal}
        onViewDetail={onViewDetail}
      />
      {/* Table Footer */}
      <TableFooter
        handleItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        totalPages={totalPages}
      />
      {/* Modal Thêm Item */}
      <CustomModal
        show={showModal}
        handleClose={handleCloseModal}
        title={
          statusFunction.isEditing ? (
            <>
              CẬP NHẬT BẢN GHI{" "}
              <i className="bi bi-arrow-repeat text-success fs-4"></i>
            </>
          ) : statusFunction.isAdd ? (
            <>
              THÊM MỚI BẢN GHI{" "}
              <i className="bi bi-plus-circle-dotted text-success ms-1 fs-4"></i>
            </>
          ) : (
            <>
              XEM CHI TIẾT{" "}
              <i className="bi bi-card-list text-succes ms-1 fs-4"></i>
            </>
          )
        }
        onSubmit={handleSubmit}
        isLoading={isLoading}
        statusFunction={statusFunction}
      >
        {/* Truyền children modal thông qua props */}
        {modalContent}
      </CustomModal>
      <DeleteModal
        show={showConfirmModal}
        onConfirm={handleConfirm}
        onClose={handleCloseConfirmModal}
        isLoading={isLoading}
      />
      {/* Sử dụng ImageModal */}
      <ImageModal
        show={showModalImage}
        imageSrc={selectedImage}
        onClose={handleCloseModalImage}
      />
      <VideoModal
        show={showModalVideo}
        videoSrc={selectedVideo}
        onClose={handleCloseVideo}
      />
    </div>
  );
};

export default TableManagement;
