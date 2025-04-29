import React, { useContext } from "react";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import {
  cilCreditCard,
  cilFile,
  cilSettings,
  cilUser,
  cilAccountLogout,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import defaultAvatar from "../../../assets/admin/images/avatars/user.png";
import { UserContext } from "../../../contexts/UserContext";
import { logout } from "../../../services/site/AuthService";

const AppHeaderDropdown = () => {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    logout(user.userId);
    updateUser(null);
    navigate("/");
    toast.success("Đăng xuất thành công!");
  };
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <img
          src={user.avatar || defaultAvatar}
          alt="avatar"
          size="md"
          className="object-fit-cover rounded-circle"
          style={{ width: "40px", height: "40px" }}
        />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Account
        </CDropdownHeader>

        <CDropdownItem as={NavLink} to="/admin/myProfile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: "pointer" }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
