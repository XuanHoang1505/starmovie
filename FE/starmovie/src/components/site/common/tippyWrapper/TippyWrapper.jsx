import Tippy from "@tippyjs/react/headless";
import PropTypes from "prop-types";
import { useState, useRef } from "react";

export default function TippyWrapper({
  children,
  renderContent,
  placement = "bottom",
  delay = [0, 200],
  offset = [0, 6],
  className = "",
  onHover = () => {},
}) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef();
  const hasHoveredRef = useRef(false);
  const handleShow = () => {
    clearTimeout(timeoutRef.current);
    setVisible(true);
    if (!hasHoveredRef.current) {
      hasHoveredRef.current = true;
      onHover();
    }
  };

  const handleHide = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      onHover();
    }, 50);
  };

  return (
    <div onMouseEnter={handleShow} onMouseLeave={handleHide}>
      <Tippy
        interactive
        visible={visible}
        placement={placement}
        delay={delay}
        offset={offset}
        render={(attrs) => (
          <div tabIndex="-1" {...attrs}>
            {renderContent()}
          </div>
        )}
      >
        <div className={className}>{children}</div>
      </Tippy>
    </div>
  );
}
TippyWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  renderContent: PropTypes.func.isRequired,
  placement: PropTypes.string,
  delay: PropTypes.array,
  offset: PropTypes.array,
  className: PropTypes.string,
};
