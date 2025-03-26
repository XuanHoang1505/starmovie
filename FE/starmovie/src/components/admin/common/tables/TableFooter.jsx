import { Form, Pagination } from "react-bootstrap";

const TableFooter = ({
  handleItemsPerPageChange,
  itemsPerPage,
  handlePageChange,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="box__control d-flex flex-column flex-md-row justify-content-md-between justify-content-center align-items-center mt-3 light__text">
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center">
          <span className="me-1">Xem</span>
          <Form.Select
            aria-label="Số bản ghi"
            className="w-auto light__text me-1"
            onChange={handleItemsPerPageChange}
            value={itemsPerPage}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Form.Select>
          <span>mục</span>
        </div>
      </div>

      <Pagination className="m-0 mt-3 mt-md-0">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default TableFooter;
