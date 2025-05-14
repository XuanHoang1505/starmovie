import TippyWrapper from "../common/tippyWrapper/TippyWrapper";
import styles from "./VipNav.module.scss";

const VipNav = () => {
  const renderContent = () => (
    <div className={`${styles.wrapper}`}>
      <div className={`${styles.vip_title}`}>
        <span className={`${styles.vip_title_text}`}>Quyền lợi thành viên</span>
        <i className="bi bi-chevron-right ps-2"></i>
      </div>
      <div className={styles.vip_content}>
        <div className={styles.row}>
          <div className={styles.feature}>
            <div className={styles.icon}>
              <i className="bi bi-laptop"></i>
            </div>
            <div className={styles.text}>
              Hỗ Trợ Đa
              <br />
              Nền Tảng
            </div>
          </div>
          <div className={styles.feature}>
            <div className={`${styles.icon} ${styles.label}`}>HD</div>
            <div className={styles.text}>1080P</div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.feature}>
            <div className={`${styles.icon} ${styles.fire}`}>
              <i className="bi bi-fire"></i>
            </div>
            <div className={styles.text}>
              Nội Dung
              <br />
              Độc Quyền
            </div>
          </div>
          <div className={styles.feature}>
            <div className={`${styles.icon} ${styles.label}`}>AD</div>
            <div className={styles.text}>
              Không
              <br />
              Quảng Cáo
            </div>
          </div>
        </div>
      </div>
      <button className={styles.vip_button}>VIP</button>
      <div className={styles.redeem}>Mã đổi quà</div>
    </div>
  );
  return (
    <TippyWrapper renderContent={renderContent} placement="bottom-end">
      <div className={styles.nav_content}>
        <i className="bi bi-gem fw-bolder"></i>
        <span className={`${styles.nav_title}`}>vip</span>
        <span className={`${styles.badge}`}>Gia hạn</span>
      </div>
    </TippyWrapper>
  );
};
export default VipNav;
