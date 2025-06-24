import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilGroup,
  cilUser,
  cilUserPlus,
  cilPeople,
  cilWallet,
  cilCash,
  cilBank,
  cilChart,
  cilChartPie,
  cilFile,
  cilList,
  cilGraph,
  cilMoney,
  cilUserFollow,
  cilUserX,
  cilDollar,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    menu_id: -1,
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    parent_menu_id: 0,
    menu_id: 47,
    component: CNavItem,
    name: 'Role Management',
    to: '/role-management',
    icon: <CIcon icon={cilUserX} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'User Management',
    menu_id: 36,
    parent_menu_id: 0,
    to: '/user-management',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Player Management',
    parent_menu_id: 0,
    to: '/player-list',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        menu_id: 38,
        component: CNavItem,
        name: 'Player List',
        to: '/player-list',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Referral List',
    to: '/referral-list',
    menu_id: 39,
    parent_menu_id: 0,
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    parent_menu_id: 40,

    name: 'Transaction Management',
    to: '/admin-transaction-list',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        menu_id:39,
        name: 'Admin Transaction',
        to: '/admin-transaction-list',
      },
      {
        component: CNavItem,
        menu_id: 41,
        name: 'Add Cash Transaction',
        to: '/add-cash-transaction-list',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Report Management',
    parent_menu_id: 43,
    to: '/tds-report',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        menu_id:44,
        component: CNavItem,
        name: 'TDS',
        to: '/tds-report',
      },
      {
        component: CNavItem,
        menu_id: 45,
        name: 'GST',
        to: '/gst-report',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Revenue',
    to: '/revenue',
    parent_menu_id: 0,
    menu_id: 46,
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Game Tamplate',
    to: '/game-tamplate',
    parent_menu_id: 0,
    menu_id: 46,
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
]

export default _nav
