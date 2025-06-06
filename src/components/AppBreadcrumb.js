import React from 'react'
import { useLocation } from 'react-router-dom'
import routes from '../routes'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)
  
  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href={import.meta.env.VITE_APP_PLATFORM_ENVIROMENT == 'development' ? '/dashboard' : '/dashboard'}>Home</CBreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
        return (
          <React.Fragment key={index}>
            <span className="mx-2"> - </span> 
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: import.meta.env.VITE_APP_PLATFORM_ENVIROMENT == 'development' ? breadcrumb.pathname : '/cl' + breadcrumb.pathname })}
              key={index}
            >
              {breadcrumb.name}
            </CBreadcrumbItem>
          </React.Fragment>
        )
      })}
    </CBreadcrumb>
  )
}
export default React.memo(AppBreadcrumb)
