import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
    setTimeout(() => {
       
       if (document.documentElement.getAttribute('data-coreui-theme') === 'dark') {
        document.documentElement.setAttribute('data-coreui-theme', 'light');
        console.log('Theme changed to light after full page load.');
       } else {
         document.documentElement.setAttribute('data-coreui-theme', 'light');
      }
    }, 300)
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
