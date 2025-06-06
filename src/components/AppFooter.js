import React from 'react'
import { CFooter } from '@coreui/react'
const d = new Date();
let year = d.getFullYear();

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; {year} Fair Rummy Admin</span>
      </div>
    </CFooter>
  )
}
export default React.memo(AppFooter)
