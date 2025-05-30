import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useSelector } from 'react-redux'
// routes config
import routes from '../routes'

const AppContent = () => {
  const token = useSelector((state) => state.user.token);

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
                  element={<route.element />}
                />
              )
            )
          })}
          {/* <Route path="/" element={<Navigate to="dashboard" replace />} /> */}
          {/* {path = { import.meta.env.VITE_APP_WEB_PLATFORM_HOMEPAGE == 'development' ? "/" : '/cl' }} */}
          <Route path="/*" element={token ? <Navigate to="dashboard" replace /> : <Navigate to="login" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}
export default React.memo(AppContent)
