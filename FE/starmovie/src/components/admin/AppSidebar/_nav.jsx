import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilExternalLink,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
  cilHome,
  cilMovie
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" size='sm'/>,
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Nội dung quản lý',
  },
  {
    component: CNavItem,
    name: 'Phim',
    to: '/movies',
    icon: <CIcon icon={cilMovie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Thể loại',
    to: '/genres',
    icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bình luận',
    to: '/comments',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Đánh giá',
    to: '/reviews',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  }
]

export default _nav
