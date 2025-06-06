import React, { useState } from 'react';
import {
  CInputGroupText,
  CInputGroup,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormTextarea,
  CCardHeader
} from "@coreui/react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTooltip,
  CCard
} from "@coreui/react";
import { CButton } from '@coreui/react';
import { cilSpreadsheet } from '@coreui/icons';
import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import Pagination from "../../../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AllInOneExportButton from '../../../components/AllInOneExportButton';
export const referralData = [
  { id: 1, username: 'laxk', totalReferral: 2, bonusEarn: 25 },
  { id: 2, username: '28V3IARZKL', totalReferral: 2, bonusEarn: 4 },
  { id: 3, username: '2O6J9YND35', totalReferral: 1, bonusEarn: 0 },
  { id: 4, username: 'Deva', totalReferral: 1, bonusEarn: 25 },
  { id: 5, username: 'Viraj', totalReferral: 1, bonusEarn: 15 },
  { id: 6, username: 'ZODFHHXUNC', totalReferral: 1, bonusEarn: 0 },
  { id: 7, username: 'OK0A2DNARQ', totalReferral: 1, bonusEarn: 0 },
  { id: 8, username: 'Thome', totalReferral: 1, bonusEarn: 15 },
  { id: 9, username: 'Raja', totalReferral: 1, bonusEarn: 10 },
  { id: 10, username: 'Jack', totalReferral: 1, bonusEarn: 15 }
];
const ReferralManagement = () => {
  const [search, setSearch] = useState('');
  const [list, setList] = useState([...referralData])
  const [copied, setCopied]=useState({ copied: false,
        copyText: ''})
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(10)
  const [limit, setLimit]=useState(10)
    const onCopy = React.useCallback((id) => {
      setCopied((prevState) => ({
        ...prevState,
        copied: true,
        copyText: id,
      }));
    }, []);


  const filteredReferralList = list.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <CCard className="mt-4">
     

      <ToastContainer />
            <div className='card shadow-lg rounded'>
            
              <div className="card-body">
                  <CCardHeader className="d-flex justify-content-between align-items-center">
                        <h5>Referral List</h5>
                      </CCardHeader>
       
      
        {/* Filter Inputs */}
        <div className="row mb-4">

          <div className="col-md-6">
            <label htmlFor="search" className="form-label">Search</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Search ...."
                id="search"
                autoComplete="off"
                value={search}
                onChange={(e) => {
                  setSearch(e?.target?.value);
                }}
              />
            </CInputGroup>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="status_id" className="form-label" style={{
                      visibility: 'hidden'
                    }}>.</label>
                    <div className="input-group" style={{
                      justifyContent: 'flex-end'
                    }}> {filteredReferralList.length > 0 && (
                        <>
                        {/* <CButton color="primary" size="sm">
        <CIcon icon={cilSpreadsheet} className="me-2" />
        Export
                          </CButton> */}
                          
                          <AllInOneExportButton data={filteredReferralList} filename={'referral-list'}/>
                        </>
            )}</div>
                    
                  </div>
                  
        </div>
      
        {/* Player Table */}
        <div className="table-responsive">
          <CTable hover bordered responsive>
            <CTableHead className="table-primary text-center align-middle">
              <CTableRow>
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total Referral</CTableHeaderCell>
                <CTableHeaderCell scope="col">Bonus Earn (Rs)</CTableHeaderCell>
              
              </CTableRow>
            </CTableHead>
      
            <CTableBody>
              {filteredReferralList.length > 0 ? (
                filteredReferralList.map((data, key) => (
                  <CTableRow key={key}>
                    <CTableDataCell className="text-center">
                      <span
                        className="me-2"
                        style={{ color: copied.copyText !== data.id ? "" : "#1b9e3e" }}>
                        {data.id}
                      </span>
                      <CopyToClipboard text={data.id} onCopy={() => onCopy(data.id)}>
                        <a href="#" style={{ color: copied.copyText !== data.id ? "" : "#1b9e3e" }}>
                          <CTooltip content="Copy ID">
                            {copied.copyText !== data.id ? (
                              <i className="bi bi-copy" />
                            ) : (
                              <i className="bi bi-check-lg" style={{ color: "#1b9e3e" }} />
                            )}
                          </CTooltip>
                        </a>
                      </CopyToClipboard>
                    </CTableDataCell>
      
                    <CTableDataCell
                     
                      >
                      {data.username}
                    </CTableDataCell>
        <CTableDataCell
             
                      >
                      {data.totalReferral}
                    </CTableDataCell>
                 
                   <CTableDataCell
                     
                      >
                      {data.bonusEarn}
                    </CTableDataCell>
                  
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={4} className="text-center">
                    No data found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      
        {/* Pagination */}
        {filteredReferralList.length > 0 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              page={page}
              totalPages={total}
              onPageChange={(newPage) =>
                setPage(newPage)
              }
            />
          </div>
        )}
      </div>
      
      
      
            </div>
    </CCard>
  );
};

export default ReferralManagement;
