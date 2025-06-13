import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPeople,
  cilUserPlus,
  cilGroup,
  cilCash,
  cilBank,
  cilGamepad,
  cilDollar,
  cilWallet,
  cilChartPie
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
    component: CNavGroup,
    name: 'Role Management',
    to: '/role-management',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Role List',
        to: '/role-management',
      },
      {
        component: CNavItem,
        name: 'User Role Management',
        to: '/user-management',
      },
    ],
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
    component: CNavGroup,
    name: 'Referral List',
    to: '/referral-list',

    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  
  },

  {
    component: CNavGroup,
    name: 'Transaction Management',
    to: '/admin-transaction-list',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Game Play Transaction',
      //   to: '/game-play-transaction-list',
      //   // icon: <CIcon icon={cilGamepad} customClassName="nav-icon" />,
      // },
      {
        component: CNavItem,
        name: 'Admin Transaction',
        to: '/admin-transaction-list',
        // icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Add Cash Transaction',
        to: '/add-cash-transaction-list',
        // icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
      },
    ],
  },
   {
    component: CNavGroup,
    name: 'Report Management',
    to: '/tds-report',
    icon: <CIcon icon={ cilBank} customClassName="nav-icon" />,
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
       
      }
    ],
  }, {
    component: CNavItem,
    name: 'Revenue',
    to: '/revenue',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />
   
  },
]

export default _nav
