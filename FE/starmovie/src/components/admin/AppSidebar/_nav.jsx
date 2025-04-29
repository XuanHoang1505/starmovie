import React from "react";
import CIcon from "@coreui/icons-react";
import { TfiLayoutSlider } from "react-icons/tfi";
import { RiMovie2AiLine, RiVipCrown2Line } from "react-icons/ri";
import {
  cilSpeedometer,
  cilList,
  cilStar,
  cilCommentBubble,
  cilPeople,
  cilUser,
} from "@coreui/icons";

import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Bảng điều khiển",
    to: "dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Nội dung quản lý",
  },
  {
    component: CNavItem,
    name: "Diễn Viên",
    to: "actors",
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "Kho phim",
    to: "movies",
    icon: <RiMovie2AiLine className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Phim",
        to: "movies/movies",
        // icon: <RiMovie2AiLine className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Tập phim",
        to: "movies/episodes",
        // icon: <CIcon icon={cilMediaPause} customClassName="nav-icon" size="sm"/>,
      },
    ],
  },
  {
    component: CNavItem,
    name: "Slide",
    to: "movieSlides",
    icon: <TfiLayoutSlider className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Thể loại",
    to: "genres",
    icon: <i className="bi bi-layout-text-sidebar-reverse nav-icon"></i>,
  },
  {
    component: CNavItem,
    name: "Danh mục",
    to: "categories",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Người dùng",
    to: "users",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "VIP",
    to: "vips",
    icon: <RiVipCrown2Line className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Thành viên VIP",
        to: "vips/vipMembers",
        // icon: <RiMovie2AiLine className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Loại VIP",
        to: "vips/vipTypes",
        // icon: <CIcon icon={cilMediaPause} customClassName="nav-icon" size="sm"/>,
      },
    ],
  },
  {
    component: CNavItem,
    name: "Bình luận",
    to: "comments",
    icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Đánh giá",
    to: "reviews",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
];

export default _nav;
