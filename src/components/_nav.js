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
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Role Management',
    to: '/role-management',
    icon: <CIcon icon={cilUserX} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'User Management',
    to: '/user-management',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Player Management',
    to: '/player-list',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
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
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Transaction Management',
    to: '/admin-transaction-list',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Admin Transaction',
        to: '/admin-transaction-list',
      },
      {
        component: CNavItem,
        name: 'Add Cash Transaction',
        to: '/add-cash-transaction-list',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Report Management',
    to: '/tds-report',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'TDS',
        to: '/tds-report',
      },
      {
        component: CNavItem,
        name: 'GST',
        to: '/gst-report',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Revenue',
    to: '/revenue',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
]

export default _nav
