import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar, cilWallet, cilShieldAlt, cilPeople, cilGamepad
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

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
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
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

  // {
  //   component: CNavGroup,
  //   name: 'Client Management',
  //   to: '/client-management',
  //   icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Client List',
  //       to: '/client-list',
  //     },

  //     // {
  //     //   component: CNavItem,
  //     //   name: 'User Transaction History',
  //     //   to: '/client-transaction-history',
  //     // },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Provider Management',
  //   to: '/provider-list',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Provider List',
  //       to: '/provider-list',
  //     },
  //   ],
  // },
 
  // {
  //   component: CNavItem,
  //   name: 'Games',
  //   to: '/game-list',
  //   icon: <CIcon icon={cilGamepad} customClassName="nav-icon" />,
  // },
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

  // {
  //   component: CNavItem,
  //   name: 'Assign Providers',
  //   to: '/assign-provider',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Assign Games',
  //   to: '/assign-games',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Report Management',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Provider Wise Report',
  //       to: '/provider-wise-report',
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Category Wise Report',
  //     //   to: '/category-wise-report',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Game Wise Report',
  //     //   to: '/game-wise-report',
  //     // },
  //     {
  //       component: CNavItem,
  //       name: 'Wallet Transaction Report',
  //       to: '/wallet-transaction-report',
  //     },
  //   ]
  // },
]

export default _nav
