import { Modal } from "react-bootstrap";

function VideoModal({ show, videoSrc, onClose }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="border-0"
      contentClassName="bg-transparent border-0 d-flex justify-content-center align-items-center"
    >
      <div
        className="position-relative video-modal-container"
        style={{
          width: "900px", // Tăng kích thước video
          maxWidth: "95%", // Để không vượt quá màn hình
          aspectRatio: "16/9", // Đảm bảo tỷ lệ video chuẩn
        }}
      >
        <iframe
          src={videoSrc}
          title="Video player"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-100 h-100 rounded"
          style={{ border: "none" }}
        ></iframe>
        <button
          type="button"
          className="bg-light p-3 btn-close position-absolute"
          aria-label="Close"
          onClick={onClose}
          style={{
            top: "15px",
            right: "15px",
            borderRadius: "50%",
          }}
        ></button>
      </div>
    </Modal>
  );
}

export default VideoModal;
