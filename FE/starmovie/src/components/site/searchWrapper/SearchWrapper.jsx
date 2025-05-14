import PropTypes from "prop-types";
import styles from "./SearchWrapper.module.scss";

function SearchWrapper({ children, className }) {
  return <div className={`${styles.wrapper} ${className}`}>{children}</div>;
}

SearchWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default SearchWrapper;
