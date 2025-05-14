import TippyWrapper from "../common/tippyWrapper/TippyWrapper";
import styles from "./LanguageNav.module.scss";
const LanguageNav = ({ languages = [] }) => {
  const renderContent = () => (
    <div className={`${styles.wrapper}`}>
      {languages.map((item, index) => (
        <div
          key={index}
          className={`${styles.language_item}`}
        >
          {item}
        </div>
      ))}
    </div>
  );
  return (
    <TippyWrapper renderContent={renderContent}>
      <div className={styles.nav_content}>
        <i class="bi bi-translate  fs-5"></i>
        <span className={`${styles.nav_title} d-none d-lg-block`}>Ngôn ngữ</span>
      </div>
    </TippyWrapper>
  );
};
export default LanguageNav;
