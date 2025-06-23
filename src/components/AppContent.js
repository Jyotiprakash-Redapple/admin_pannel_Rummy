import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useSelector } from 'react-redux'
// routes config
import routes from '../routes'


const ProtectedRoute = ({ element: Component, permissionKey, userPermissions }) => {
  console.log(userPermissions, "PROTECTED++++++++++>")
  const hasId = userPermissions.some(item => item.menu_id === permissionKey);
  
  if (!permissionKey || hasId || permissionKey === -1) {
    return <Component />;
  } else {
    return <Navigate to="/403" replace />;
  }
};
const AppContent = () => {
  const token = useSelector((state) => state.user.token);
  const menu_permission =  useSelector((state) => state.menu_permission);
  return (
    <CContainer className="px-4" fluid>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {token && routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={ <ProtectedRoute
            element={route.element}
            permissionKey={route.permissionKey}
            userPermissions={menu_permission} 
          />}
                />
              )
            )
          })}
          {/* <Route path="/" element={<Navigate to="dashboard" replace />} /> */}
          {/* {path = { import.meta.env.VITE_APP_WEB_PLATFORM_HOMEPAGE == 'development' ? "/" : '/cl' }} */}
          <Route path="/*" element={token ? <Navigate to="/" replace /> : <Navigate to="login" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}
export default React.memo(AppContent)
