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
  cilGraph,
  cilMoney,
  cilUserFollow,
  cilUserX,
  cilDollar,

  cilList,
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
    parent_menu_id: 4,
    menu_id: 4,
    component: CNavItem,
    name: 'Role Management',
    to: '/role-management',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'User Management',
    menu_id: 5,
    parent_menu_id: 5,
    to: '/user-management',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Player Management',
    parent_menu_id: 13,
    to: '/player-list',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    items: [
      {
        menu_id: 6,
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
    menu_id: 7,
    parent_menu_id: 7,
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    parent_menu_id: 2,

    name: 'Transaction Management',
    to: '/admin-transaction-list',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        menu_id:8,
        name: 'Admin Transaction',
        to: '/admin-transaction-list',
      },
      {
        component: CNavItem,
        menu_id: 9,
        name: 'Add Cash Transaction',
        to: '/add-cash-transaction-list',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Report Management',
    parent_menu_id: 3,
    to: '/tds-report',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        menu_id:10,
        component: CNavItem,
        name: 'TDS',
        to: '/tds-report',
      },
      {
        component: CNavItem,
        menu_id: 11,
        name: 'GST',
        to: '/gst-report',
      },
  
      {
        component: CNavItem,
        menu_id: 15,
        name: 'Withdraw',
        to: '/withdraw-report',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Revenue',
    to: '/revenue',
    parent_menu_id: 12,
    menu_id: 12,
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Game Tamplate',
    to: '/game-tamplate',
    parent_menu_id: 16,
    menu_id: 16,
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
]


export default _nav
