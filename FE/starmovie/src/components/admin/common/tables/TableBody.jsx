import { Fragment } from "react";

const TableBody = ({
  columns,
  visibleColumns,
  handleSort,
  sortConfig,
  currentData,
  handleRowToggle,
  renderCustomCell,
  expandedRows,
  handleRenderBtn,
  onEdit,
  handleShowModal,
  handleShowConfirmModal,
  onViewDetail,
}) => {
  console.log(currentData);
  return (
    <div className="table__wrapper row m-0">
      <div className="light__text table-responsive col-12 p-0 custom-scrollbar">
        <table className="table table-hover mb-2">
          <thead>
            <tr>
              {columns
                .filter((col) => visibleColumns.includes(col.key))
                .map((column) => (
                  <th
                    scope="col"
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    <span className="icon_sort ps-2 light__text">
                      <i
                        className={`bi bi-arrow-up ${
                          sortConfig.key === column.key &&
                          sortConfig.direction === "asc"
                            ? "text-black"
                            : "opacity-50"
                        }`}
                      ></i>
                      <i
                        className={`bi bi-arrow-down ${
                          sortConfig.key === column.key &&
                          sortConfig.direction === "desc"
                            ? "text-black"
                            : "opacity-50"
                        }`}
                      ></i>
                    </span>
                  </th>
                ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <Fragment key={item.id}>
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowToggle(item.id)}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((column) => (
                      <td key={column.key} className="align-middle">
                        {renderCustomCell(column, item)}
                      </td>
                    ))}
                  <td className="align-middle text-end">
                    <button
                      className="btn btn__show p-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên tr
                        handleRowToggle(item.id);
                      }}
                    >
                      {expandedRows.includes(item.id) ? (
                        <i className="bi bi-dash-circle"></i>
                      ) : (
                        <i className="bi bi-plus-circle"></i>
                      )}
                    </button>
                  </td>
                </tr>
                {expandedRows.includes(item.id) && (
                  <tr key={item.id + "-expanded"} className="expand-row">
                    <td colSpan={columns.length + 1}>
                      <div className="collapse-content">
                        <ul className="px-2 m-0 list-unstyled">
                          {columns
                            .filter(
                              (column) => !visibleColumns.includes(column.key)
                            ) // Lọc các cột chưa được hiển thị
                            .map((column) => (
                              <li
                                key={column.key}
                                className="py-2 w-75 m-0 text-truncate d-flex align-items-center"
                              >
                                <strong className="me-3 p-0">
                                  {column.label}:
                                </strong>
                                <span className="p-0">
                                  {renderCustomCell(column, item)}
                                </span>
                              </li>
                            ))}
                          <li>
                            {handleRenderBtn().btnEdit && (
                              <button
                                className="btn btn__edit me-3 my-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(item);
                                  handleShowModal();
                                }}
                              >
                                <i className="bi bi-pencil-square"></i> Chỉnh
                                sửa
                              </button>
                            )}
                            {handleRenderBtn().btnDelete && (
                              <button
                                className="btn btn__delete p-1 me-4"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowConfirmModal(item.id);
                                }}
                              >
                                <i className="bi bi-trash-fill"></i> Xóa
                              </button>
                            )}
                            {handleRenderBtn().btnDetail && (
                              <button
                                className="btn btn__detail p-1 me-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewDetail(item);
                                  handleShowModal();
                                }}
                              >
                                <i className="bi bi-card-list"></i> Xem chi tiết
                              </button>
                            )}
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {currentData.length === 0 && (
          <div className="text-muted text-nowrap d-flex justify-content-center mt-4 p-4">
            Chưa có bản ghi nào!
          </div>
        )}
      </div>
    </div>
  );
};

export default TableBody;
