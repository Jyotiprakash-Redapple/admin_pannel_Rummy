
import React, {useState, useEffect} from 'react';
import styles from './RevenueSection.module.css';
import {  CCard,
  CCardHeader,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CTooltip, CCardBody, CCardTitle, CRow, CCol } from '@coreui/react';
import { cilArrowTop, cilCalendar, cilCloudDownload } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import { cilSearch } from '@coreui/icons';
import { useSelector, useDispatch } from 'react-redux';
const RevenueSection = () => {
  const token = useSelector((state) => state.user.token);
  const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
  return (

     <CCard className="mt-4">
          <ToastContainer />
          <div className="card shadow-lg rounded">
            <div className="card-body">
              <CCardHeader className="d-flex justify-content-between align-items-center">
                <h5>Revenue</h5>
              </CCardHeader>
    
              {/* Search and Export */}
          <div className="row mb-4">
                 <div className="col-md-6">
                  <label htmlFor="search" className="form-label">From Date</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      placeholder="from date..."
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </CInputGroup>
                </div>
                 <div className="col-md-6">
                  <label htmlFor="search" className="form-label">To date</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      placeholder="to date..."
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </CInputGroup>
                </div>
                {/* <div className="col-md-3">
                  <label htmlFor="search" className="form-label">Search</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </CInputGroup>
                </div>
                 <div className="col-md-3">
                  <label htmlFor="search" className="form-label">From Date</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      placeholder="from date..."
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </CInputGroup>
                </div>
                 <div className="col-md-3">
                  <label htmlFor="search" className="form-label">To date</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      placeholder="to date..."
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </CInputGroup>
                </div>
              
                <div className="col-md-3 d-flex justify-content-end align-items-end">
                  <AllInOneExportButton
                    data={filteredTransactionData}
                    filename="admin-transaction-list"
                  />
                </div> */}
              </div>
    
              {/* Table */}
     
      <CRow>
        {/* Total Amount Received */}
        <CCol xs="12" md="6">
          <div className={styles.card}>
            <div className={styles.iconBoxBlue}>CF</div>
            <div className={styles.cardBody}>
              <div className={styles.ctnArea}>
                TOTAL AMOUNT RECEIVED <span className={styles.subTitle}>(DEPOSIT VIA CASHFREE)</span>
                  <p className={styles.amount}>0</p>
              </div>
              <div className={styles.btnArea}>
                  <p className={styles.transactions}>0 Transactions</p>
              <CButton color="success" size="sm">Export</CButton>
              </div>
            
            </div>
          </div>
        </CCol>

        {/* Total Amount Withdrawal */}
        <CCol xs="12" md="6">
          <div className={styles.card}>
            <div className={styles.iconBoxGreen}>
              <CIcon icon={cilArrowTop} size="lg" />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.ctnArea}>
                TOTAL AMOUNT WITHDRAWAL
                 <p className={styles.amount}>0</p>
              </div>
              <div className={styles.btnArea} >
                <p className={styles.transactions}>0 Transactions</p>
              <CButton color="success" size="sm">Export</CButton>
             </div>
              
            </div>
          </div>
        </CCol>
      </CRow>

      <p className={styles.note}>
         *Based on transaction created date, not on updated date
      </p>
            </div>
          </div>
        </CCard>
    


    // <div className={styles.container}>
    //   <div className={styles.header}>
    //     <h2>Revenue</h2>
    //     <div className={styles.dateRange}>
    //       <CIcon icon={cilCalendar} className={styles.icon} />
    //       <span>9 Jun 2025 - 9 Jun 2025</span>
    //     </div>
    //   </div>

    //   <CRow className={styles.cardRow}>
    //     {/* Total Amount Received */}
    //     <CCol xs="12" md="6">
    //       <div className={styles.card}>
    //         <div className={styles.iconBoxBlue}>CF</div>
    //         <div className={styles.cardBody}>
    //           <div className={styles.ctnArea}>
    //             TOTAL AMOUNT RECEIVED <span className={styles.subTitle}>(DEPOSIT VIA CASHFREE)</span>
    //               <p className={styles.amount}>0</p>
    //           </div>
    //           <div className={styles.btnArea}>
    //               <p className={styles.transactions}>0 Transactions</p>
    //           <CButton color="success" size="sm">Export</CButton>
    //           </div>
            
    //         </div>
    //       </div>
    //     </CCol>

    //     {/* Total Amount Withdrawal */}
    //     <CCol xs="12" md="6">
    //       <div className={styles.card}>
    //         <div className={styles.iconBoxGreen}>
    //           <CIcon icon={cilArrowTop} size="lg" />
    //         </div>
    //         <div className={styles.cardBody}>
    //           <div className={styles.ctnArea}>
    //             TOTAL AMOUNT WITHDRAWAL
    //              <p className={styles.amount}>0</p>
    //           </div>
    //           <div className={styles.btnArea} >
    //             <p className={styles.transactions}>0 Transactions</p>
    //           <CButton color="success" size="sm">Export</CButton>
    //          </div>
              
    //         </div>
    //       </div>
    //     </CCol>
    //   </CRow>

    //   <p className={styles.note}>
    //     *Based on transaction created date, not on updated date
    //   </p>
    // </div>
  );
};

export default RevenueSection;




