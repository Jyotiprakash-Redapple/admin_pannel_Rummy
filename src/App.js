import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes,BrowserRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/auth/Login'))
const Register = React.lazy(() => import('./views/auth/Register'))
const ForgotPassword = React.lazy(() => import('./views/auth/ForgotPass'))
const Page404 = React.lazy(() => import('./views/auth/Page404'))
const Page500 = React.lazy(() => import('./views/auth/Page500'))
const OTP = React.lazy(() => import('./views/auth/OTP'))
const ChangePassword = React.lazy(() => import('./views/auth/ChangePass'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))


const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const token = useSelector((state) => state.user.token);

console.log(token, "GETTOKEN++++++++++++++++++")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode('light')
    }

    if (isColorModeSet()) {
      return
    }
  
    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_WEB_PLATFORM_HOMEPAGE}>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={token ? <DefaultLayout /> : <Login />} />          
          {/* <Route exact path="/login" name="Login Page" element={<Login />} /> */}
          <Route exact path="/forgot-password" name="Forgot Password" element={<ForgotPassword />} />
          <Route exact path="/otp" name="OTP" element={<OTP />} />
          <Route exact path="/change-password" name="OTP" element={<ChangePassword />} />          
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/*" name="Home" element={<DefaultLayout />} />
          {/* <Route path="/*" name="Home" element={<DefaultLayout />} /> */}

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
