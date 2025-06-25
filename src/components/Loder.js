import React from 'react'
import { CSpinner, CContainer } from '@coreui/react'

const PageLoader = () => (
  <CContainer className="d-flex justify-content-center align-items-center vh-100">
    <CSpinner color="primary" />
  </CContainer>
)

export { PageLoader }
