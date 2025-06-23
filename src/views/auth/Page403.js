import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons'

const Page403 = () => {
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4"> <CIcon icon={cilWarning} className="text-warning" size="xxl" /> </h1>
              <h4 className="pt-3">Access Denied!</h4>
              <p className="text-body-secondary float-start">
                You are not allowed to access this page
              </p>
            </div>
           
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page403