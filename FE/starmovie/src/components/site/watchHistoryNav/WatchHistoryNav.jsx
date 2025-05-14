import TippyWrapper from "../common/tippyWrapper/TippyWrapper";
import styles from "./WatchHistoryNav.module.scss";
const WatchHistoryNav = ({ watchHistories = [], hasUser = false }) => {
  const renderContent = () => (
    <div className={`${styles.wrapper}`}>
      {watchHistories.map((item, index) => (
        <div key={index} className={`${styles.watch_item}`}>
          <div className={styles.img_box}>
            <img src={item.poster} />
          </div>
          <div className={`${styles.watch_item_info}`}>
            <p className={styles.movie_title}>{item.movieTitle}</p>
            <span>Xem đến {item.episodeTitle}</span>
          </div>
        </div>
      ))}
      <button className={`${styles.tippy_footer}`}>
        {hasUser ? <span>Khác</span> : <span>Đăng nhập để xem thêm</span>}
        <i className="bi bi-chevron-right ps-2"></i>
      </button>
    </div>
  );
  return (
    <TippyWrapper renderContent={renderContent}>
      <div className={styles.nav_content}>
        <i class="bi bi-clock fs-5"></i>
        <span className={`${styles.nav_title} d-none d-lg-block`}>Lịch sử xem</span>
      </div>
    </TippyWrapper>
  );
};
export default WatchHistoryNav;
