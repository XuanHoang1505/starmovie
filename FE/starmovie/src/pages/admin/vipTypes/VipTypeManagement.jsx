import { useEffect, useState } from "react";
import { Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { NumericFormat } from "react-number-format";
import { TableManagement, Page500 } from "../../../components/admin/index";
import VipTypeService from "../../../services/admin/VipTypeService";
import { toast } from "react-toastify";

const VipTypeManagement = () => {
  const [vipTypeData, setVipTypeData] = useState([]);
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
  const vipTypeColumns = [
    { key: "id", label: "ID" },
    { key: "typeName", label: "Tên loại vip" },
    { key: "price", label: "Giá" },
    { key: "duration", label: "Thời gian (ngày)" },
  ];

  const fetchVipTypeData = async () => {
    setLoadingPage(true);
    try {
      const data = await VipTypeService.getVipTypes();

      setVipTypeData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchVipTypeData();
  }, []);

  const handleReset = () => {
    setFormData({
      id: "",
      typeName: "",
      price: "",
      duration: "",
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
      case "typeName":
        if (!value || value.trim() === "") {
          error = "Tên loại vip không được để trống.";
        }
        break;

      case "price":
        if (!value || value === "") {
          error = "Giá không được để trống.";
        } else if (isNaN(value)) {
          error = "Giá phải là một số.";
        } else if (Number(value) < 0) {
          error = "Giá phải lớn hơn hoặc bằng 0.";
        }
        break;
      case "duration":
        if (!value || value.trim() === "") {
          error = "Thời gian không được để trống.";
        } else if (isNaN(value)) {
          error = "Thời gian phải là một số.";
        } else if (Number(value) <= 0) {
          error = "Thời gian phải lớn hơn 0.";
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

    // Kiểm tra vipTypeName
    if (!formData.typeName || formData.typeName.trim() === "") {
      newErrors.typeName = "Tên loại VIP không được để trống.";
    } else if (formData.typeName.length > 50) {
      newErrors.typeName = "Tên loại VIP không được vượt quá 50 ký tự.";
    }

    // Kiểm tra price
    if (!formData.price || formData.price === "") {
      newErrors.price = "Giá không được để trống.";
    } else if (isNaN(formData.price)) {
      newErrors.price = "Giá phải là một số.";
    } else if (Number(formData.price) < 0) {
      newErrors.price = "Giá phải lớn hơn hoặc bằng 0.";
    }

    if (!formData.duration || formData.duration === "") {
      newErrors.duration = "Thời hạn không được để trống.";
    } else if (isNaN(formData.duration)) {
      newErrors.duration = "Thời hạn phải là một số.";
    } else if (Number(formData.duration) <= 0) {
      newErrors.duration = "Thời hạn phải lớn  0.";
    }

    // Cập nhật lỗi vào state
    setErrorFields(newErrors);

    // Trả về true nếu không có lỗi
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
        console.log("formData", formData);

        const updatedVipType = await VipTypeService.updateVipType(
          formData.id,
          formData
        );

        // Cập nhật state VipTypeData với VipType đã được sửa
        const updateVipTypedData = vipTypeData.map((vipType) =>
          vipType.id === updatedVipType.id ? updatedVipType : vipType
        );

        setVipTypeData(updateVipTypedData);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        const newVipType = await VipTypeService.createVipType(formData);
        fetchVipTypeData(); // Fetch lại dữ liệu mới

        // Cập nhật mảng VipTypeData với item vừa được thêm
        setVipTypeData([...vipTypeData, newVipType]);
        updateStatus({ isAdd: false });
        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      toast.error("Lỗi khi lưu loại vip:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      await VipTypeService.deleteVipType(deleteId);
      setVipTypeData((prevData) =>
        prevData.filter((vipType) => vipType.id !== deleteId)
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
          <Form.Group controlId="formTypeName">
            <Form.Label>
              Tên loại vip <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="typeName"
              value={formData.typeName}
              maxLength={100}
              onChange={(e) => handleInputChange("typeName", e.target.value)}
              isInvalid={!!errorFields.typeName}
              placeholder="Nhập vào tên loại vip"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.typeName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPrice" className="mt-3">
            <Form.Label>
              Giá <span className="text-danger">(*)</span>
            </Form.Label>
            <NumericFormat
              thousandSeparator={true}
              suffix=" VNĐ"
              decimalScale={0} // Không cho phép số thập phân
              value={formData.price}
              onValueChange={(values) => {
                const { floatValue } = values;
                handleInputChange("price", floatValue); // Lấy giá trị số thực (floatValue là giá trị số thực không có dấu phân cách hay định dạng   )
              }}
              className={`form-control ${
                errorFields.price ? "is-invalid" : ""
              }`}
              placeholder="Nhập giá (VNĐ)"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.price}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formDuration" className="mt-3">
            <Form.Label>
              Thời lượng <span className="text-danger">(*)</span>
            </Form.Label>
            <NumericFormat
              thousandSeparator={true}
              suffix=" ngày"
              decimalScale={0} // Chỉ cho số nguyên
              allowNegative={false} // Không cho nhập số âm
              value={formData.duration}
              inputMode="numeric"
              onValueChange={(values) => {
                const { value } = values;
                handleInputChange("duration", value ?? "");
              }}
              className={`form-control ${
                errorFields.duration ? "is-invalid" : ""
              }`}
              placeholder="Nhập thời lượng (ngày)"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.duration}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
    </>
  );
  return (
    <>
      <Helmet>
        <title>Quản lý gói vip - Star Movie</title>
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
            columns={vipTypeColumns}
            data={vipTypeData}
            title={"Quản lý gói vip"}
            defaultColumns={vipTypeColumns}
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

export default VipTypeManagement;
