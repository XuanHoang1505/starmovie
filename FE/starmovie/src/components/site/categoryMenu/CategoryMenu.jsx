import TippyWrapper from "../common/tippyWrapper/TippyWrapper";
import { NavLink } from "react-router-dom";
import styles from "./CategoryMenu.module.scss";

export default function CategoryMenu({ categories = [], children, onHover}) {
  return (
    <TippyWrapper
      renderContent={() => (
        <div className={`${styles.dropdown}`}>
          {categories.map((item, index) => (
            <NavLink
              to={`/${item}`}
              key={index}
              className={`${styles.dropdown_item}`}
            >
              {item}
            </NavLink>
          ))}
        </div>
      )}
      onHover={onHover}
    >
      <span
        style={{
          color: "white",
          cursor: "pointer",
        }}
      >
       {children}
      </span>
    </TippyWrapper>
  );
}
