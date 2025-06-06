import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from 'src/assets/images/rummy_fair.png';
import { sideBarOpen, sideBarClose } from "../redux/slices/superAdminStateSlice";
// sidebar nav config
import navigation from './_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {        
        dispatch(sideBarOpen({ type: 'set', sidebarShow: visible }))
        // dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <CSidebarBrand to={import.meta.env.VITE_APP_PLATFORM_ENVIROMENT == 'development' ? '/dashboard' : '/dashboard'} >
          <img src={logo} height={100} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(sideBarOpen({ type: 'set', sidebarShow: false }))
            // dispatch({ type: 'set', sidebarShow: false })
          }
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch(sideBarClose({ type: 'set', sidebarUnfoldable: !unfoldable }))
            }
        />
      </CSidebarFooter>
    </CSidebar>
  )
}
export default React.memo(AppSidebar)
