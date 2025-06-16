
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
import { cilSearch } from '@coreui/icons';
import { useSelector, useDispatch } from 'react-redux';
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants } from "../../../apis/Constant";
import { ToastContainer, toast } from "react-toastify";
const today = new Date()
const toDateStr = today.toISOString().split('T')[0]

// Create fromDate by subtracting 30 days
const fromDateObj = new Date()
fromDateObj.setDate(today.getDate() - 30)
const fromDateStr = fromDateObj.toISOString().split('T')[0]

const RevenueSection = () => {
  const token = useSelector((state) => state.user.token);
  const [fromDate, setFromDate] = useState(fromDateStr);
  const [toDate, setToDate] = useState(toDateStr);
  const [revenueDeposit, setRevenueDeposit] = useState([]);
  const [totalRevenueDeposit, setTotalRevenueDeposit] = useState(0);
  const [revenueWithdraw, setRevenueWithDraw] = useState([]);
  const [totalRevenueWithDraw, setTotalRevenueWithDraw] = useState(0);
    const playerExportDeposit = () => {
      let params = JSON.stringify({
    from_date : fromDate,
    to_date : toDate,
    export_deposit: true,
    export_withdrawn: false
      });
  
      Service.apiPostCallRequest(RouteURL.admin_revenue, params, token)
        .then((res) => {
          console.log(res, "filter playerExportDeposit List");
          if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
       
            setTotalRevenueDeposit(res.data.revenuedata.total_deposit);
            setRevenueDeposit(res.data.revenuedatadeposit)
            
          } else {
            toast.error(res.message, {
              position: "bottom-right",
              closeOnClick: true,
            });
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message, {
            position: "bottom-right",
          });
        });
    };
    const playerExportWithDraw = () => {
      let params = JSON.stringify({
    from_date : fromDate,
    to_date : toDate,
    export_deposit:false,
    export_withdrawn:true
      });
  
      Service.apiPostCallRequest(RouteURL.admin_revenue, params, token)
        .then((res) => {
          console.log(res, "filter playerExportWithDraw List");
          if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
              setTotalRevenueWithDraw(res.data.revenuedata.total_withdrawn);
            setRevenueWithDraw(res.data.revenuedatawidhdrwan
)
          } else {
            toast.error(res.message, {
              position: "bottom-right",
              closeOnClick: true,
            });
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message, {
            position: "bottom-right",
          });
        });
    };
    useEffect(() => {
      playerExportDeposit();
      playerExportWithDraw()
    }, []);
  
  
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




