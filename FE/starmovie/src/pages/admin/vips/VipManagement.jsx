import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableManagement, Page500 } from "../../../components/admin/index";
import VipService from "../../../services/admin/VipService";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import { Spinner, Form } from "react-bootstrap";
import VipTypeService from "../../../services/admin/VipTypeService";
import UserService from "../../../services/admin/UserService";
import {
  formatDateTimeToDMY,
  formatDateTimeToISO,
} from "../../../utils/formatDate";

const VipManagement = () => {
  // State để lưu trữ dữ liệu giảm giá từ API
  const [vipData, setVipData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    vipTypeId: "",
  }); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  }); // Trạng thái để biết đang thêm mới hay chỉnh sửa hay xem chi tiết

  const [listVipTypeOption, setListVipTypeOption] = useState([]);
  const [listUserOption, setListUserOption] = useState([]);

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
  const vipColumns = [
    { key: "id", label: "ID" },
    { key: "username", label: "Người đăng kí" },
    { key: "vipTypeName", label: "Tên gói vip" },
    { key: "registeredDate", label: "Ngày đăng kí" },
    { key: "expirationDate", label: "Ngày hết hạn" },
  ];

  // Gọi API để lấy dữ liệu từ server
  const fetchVipData = async () => {
    setLoadingPage(true);
    try {
      const data = await VipService.getVips();
      const dataFormat = data.map((item) => ({
        ...item,
        registeredDate: formatDateTimeToDMY(item.registeredDate),
        expirationDate: formatDateTimeToDMY(item.expirationDate),
      }));

      setVipData(dataFormat); // Lưu dữ liệu đã format vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  const fetchVipTypes = async () => {
    try {
      const vipTypes = await VipTypeService.getVipTypes();
      const vipTypeOptions = vipTypes.map((vipType) => ({
        value: vipType.id,
        label: vipType.typeName,
      }));
      setListVipTypeOption(vipTypeOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách loại vip");
    }
  };
  const fetchUsers = async () => {
    try {
      const users = await UserService.getUsers();
      const userOptions = users.map((user) => ({
        value: user.id,
        label: user.fullName,
      }));
      setListUserOption(userOptions);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách người dùng");
    }
  };
  useEffect(() => {
    fetchVipData();
  }, []);

  useEffect(() => {
    fetchVipTypes();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "userId":
        if (!value || value.length === 0) {
          error = "Lựa chọn người dùng đăng kí không được để trống.";
        }
        break;
      case "vipTypeId":
        if (!value || value.length === 0) {
          error = "Lựa chọn gói vip không được để trống.";
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

    if (!formData.userId || formData.userId === "") {
      newErrors.userId = "Lựa chọn người dùng đăng kí không được để trống.";
    }
    if (!formData.vipTypeId || formData.vipTypeId === "") {
      newErrors.vipTypeId = "Lựa chọn gói vip không được để trống.";
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
      id: "",
      userId: "",
      vipTypeId: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      registeredDate: formatDateTimeToISO(item.registeredDate),
      expirationDate: formatDateTimeToISO(item.expirationDate),
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };
  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng VipService
        console.log(formData);
        const updatedVip = await VipService.updateVip(formData.id, formData);

        const formatVip = {
          ...updatedVip,
          registeredDate: formatDateTimeToDMY(updatedVip.registeredDate),
          expirationDate: formatDateTimeToDMY(updatedVip.expirationDate),
        };

        // Cập nhật state VipData với Vip đã được sửa
        const updateVipData = vipData.map((vip) =>
          vip.id === formatVip.id ? formatVip : vip
        );

        setVipData(updateVipData);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        const { id, ...rest } = formData; // Tách id ra khỏi formData để không gửi lên server
        const newVip = await VipService.createVip(rest);

        // Cập nhật mảng VipData với item vừa được thêm
        setVipData([...vipData, newVip]);
        fetchVipData(); // Gọi lại hàm để lấy dữ liệu mới nhất từ server

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
      await VipService.deleteVip(deleteId); // Thực hiện xóa
      setVipData((prevData) => prevData.filter((vip) => vip.id !== deleteId));
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
        <div className="col-md-12 mb-3">
          <Form.Group controlId="formUserId" className="mt-3">
            {statusFunction.isEditing ? (
              <Form.Label>
                Người dùng đăng kí <span className="text-danger">(*)</span>
              </Form.Label>
            ) : (
              <Form.Label>
                Chọn người dùng đăng kí <span className="text-danger">(*)</span>
              </Form.Label>
            )}
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
              placeholder="Chọn nguời dùng"
              isInvalid={!!errorFields.userId}
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
              isDisabled={statusFunction.isEditing} // Disable nếu không phải trạng thái thêm mới
              styles={{
                menu: (provided) => ({
                  ...provided,
                }),
              }}
            />
            {errorFields.userId && statusFunction.isAdd && (
              <div className="invalid-feedback d-block">
                {errorFields.userId}
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="formVipTypeId" className="mt-3">
            <Form.Label>
              Chọn gói vip <span className="text-danger">(*)</span>
            </Form.Label>
            <Select
              options={listVipTypeOption} // Danh sách các tùy chọn loại sản phẩm
              value={listVipTypeOption.find(
                (option) => option.value === formData.vipTypeId
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "vipTypeId",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder="Chọn loại VIP"
              isInvalid={!!errorFields.vipTypeId}
              isClearable // Cho phép xóa chọn lựa
              isSearchable // Bật tính năng tìm kiếm
              styles={{
                menu: (provided) => ({
                  ...provided,
                }),
              }}
            />
            {errorFields.vipTypeId && (
              <div className="invalid-feedback d-block">
                {errorFields.vipTypeId}
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
        <title>Quản lý Thành viên VIP - Star Movie</title>
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
            columns={vipColumns}
            data={vipData}
            title={"Quản lý thành viên VIP"}
            defaultColumns={vipColumns}
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

export default VipManagement;
