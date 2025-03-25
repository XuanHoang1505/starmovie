import { Form, Dropdown, DropdownButton } from "react-bootstrap";

const TableHeader = ({
  handleReset,
  onSetting,
  searchTerm,
  setSearchTerm,
  handleRenderBtn,
  handleShowModal,
  columns,
  handleColumnToggle,
  visibleColumns,
}) => {
  return (
    <div className="row mb-4">
      <div className="col-lg-8 col-12">
        {/* Input tìm kiếm */}
        <input
          type="text"
          className="form-control shadow-none"
          placeholder="Tìm kiếm"
          value={searchTerm} // Giá trị của input
          onChange={(e) => setSearchTerm(e.target.value)} // Xử lý thay đổi giá trị
        />
      </div>
      <div className="col-lg-4 col-12 d-flex justify-content-lg-end mt-3 mt-lg-0">
        {handleRenderBtn().btnSetting && (
          <button
            className="btn btn-success me-2 text-nowrap"
            onClick={onSetting}
          >
            <i className="bi bi-gear me-2"></i>Cài đặt
          </button>
        )}
        {handleRenderBtn().btnAdd && (
          <button
            className="btn btn-primary me-2 text-nowrap"
            onClick={() => {
              handleReset();
              handleShowModal();
            }}
          >
            <i className="bi bi-plus-circle"></i> Thêm
          </button>
        )}
        <div className="dropdown text-nowrap">
          <DropdownButton
            id="dropdown-basic-button"
            title={<i className="bi bi-layout-three-columns me-1"></i>}
          >
            {columns.map((column) => (
              <Dropdown.Item
                key={column.key}
                onClick={() => handleColumnToggle(column.key)}
              >
                <Form.Check
                  type="checkbox"
                  label={column.label}
                  checked={visibleColumns.includes(column.key)}
                  readOnly
                />
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
