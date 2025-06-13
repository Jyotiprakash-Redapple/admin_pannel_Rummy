import React, { useState , useEffect} from 'react';
import {
  CCard,
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
  CTooltip
} from '@coreui/react';
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import AllInOneExportButton from '../../../components/AllInOneExportButton';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { useSelector } from 'react-redux';
import { Constants } from "../../../apis/Constant";
function balanceRefactor(b) {
		return b / 100;
	}
// Updated Admin Transaction Data
export const transactionData = [
  {
    id: '682dd5eddabab2775b379fc2',
    username: 'Will jack',
    txnAmount: 5000,
    winWallet: 0.00,
    mainWallet: 5000.00,
    bonusWallet: 0.00,
    date: '21/05/2025 07:02PM',
    type: 'ADMIN',
    remark: 'Deposit by admin',
    status: 'Success'
  },
  {
    id: '68323d6ddabab214bc3b8db2',
    username: 'Hiten',
    txnAmount: -10,
    winWallet: -10.00,
    mainWallet: 0.00,
    bonusWallet: 0.00,
    date: '13/05/2025 05:00PM',
    type: 'ADMIN',
    remark: 'Deduct by admin',
    status: 'Success'
  },
  {
    id: '6811c23fdabab278aeac538b',
    username: 'Viraj',
    txnAmount: -20,
    winWallet: -20.00,
    mainWallet: 0.00,
    bonusWallet: 0.00,
    date: '30/04/2025 11:54AM',
    type: 'ADMIN',
    remark: 'Deduct by admin',
    status: 'Success'
  }
];

const AdminTransactionManagement = () => {
   const token = useSelector((state) => state.user.token);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');
  const [transaction, setTransaction] = useState([]);
  const [limit, setLimit] = useState(10);
  const [isLoadMoreInActive, setIsLoadMoreInActive] = useState(true);
const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const onCopy = (id) => {
    setCopied(id);
    toast.success('Transaction ID copied to clipboard!');
  };


  const filteredTransactionData = transaction.filter((item) =>
     Object.values(item).some((value) =>
    String(value).toLowerCase().includes(search.toLowerCase())
  )
  );

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
    if (limit + 10 >= filteredTransactionData.length) {
      setIsLoadMoreInActive(true);
    }
  };
  const fetchAdminCashTransaction = () => {
    let params = {
      report_type: 'tds',
      search: search,
			from_date: fromDate,
			to_date: toDate,
			page: 1,
			limit: limit,
		};
		Service.apiPostCallRequest(RouteURL.admin_report_management, params, token)
			.then((res) => {
				console.log(res, "report");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					if (res.data.total == res.data.tdsTransactions.length) {
						setIsLoadMoreInActive(true);
					}
					setTransaction(res.data.tdsTransactions);
				} else {
					toast.error(res.data.message, {
						position: "bottom-right",
						closeOnClick: true,
					});
				}
			})
      .catch((error) => {
        console.log(error)
				toast.error(error.response.data.message, {
					position: "bottom-right",
				});
			});
    };
  
  useEffect(() => {
    fetchAdminCashTransaction()
  }, [limit, fromDate, toDate])
  
  console.log(transaction, "TRANSACTION___")
  return (
    <CCard className="mt-4">
      <ToastContainer />
      <div className="card shadow-lg rounded">
        <div className="card-body">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5>GST Reports</h5>
          </CCardHeader>

          {/* Search and Export */}
          <div className="row mb-4">
            <div className="col-md-3">
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
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <CTable hover bordered responsive>
              <CTableHead className="table-primary text-center align-middle">
                <CTableRow>
                  <CTableHeaderCell>Transactions ID</CTableHeaderCell>
                  <CTableHeaderCell>Player Name</CTableHeaderCell>
                  <CTableHeaderCell>Display Name</CTableHeaderCell>
                  
                  <CTableHeaderCell>Deposit Amount (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Bonus Amount (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Withdrawable Amount (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Total Amount (Rs)</CTableHeaderCell>

                  <CTableHeaderCell>Available Deposit Amount (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Available Bonus Amount (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Available Withdrawable Amount (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Available Total Amount (Rs)</CTableHeaderCell>

                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                      {/* <CTableHeaderCell>Actions</CTableHeaderCell> */}
                  <CTableHeaderCell>Remark</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredTransactionData.length > 0 ? (
                  filteredTransactionData.slice(0, limit).map((item, index) => (
                    <>
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <span style={{ color: copied !== item.wallet_trnx_id ? "" : "#1b9e3e" }}>
                            {item.wallet_trnx_id}
                          </span>
                          <CopyToClipboard text={item.wallet_trnx_id} onCopy={() => onCopy(item.wallet_trnx_id)}>
                            <a href="#" style={{ marginLeft: '5px', color: copied !== item.wallet_trnx_id ? "" : "#1b9e3e" }}>
                              <CTooltip content="Copy Order ID">
                                {copied !== item.wallet_trnx_id ? (
                                  <i className="bi bi-copy" />
                                ) : (
                                  <i className="bi bi-check-lg" />
                                )}
                              </CTooltip>
                            </a>
                          </CopyToClipboard>
                        </CTableDataCell>
                        <CTableDataCell>{item.player_name}</CTableDataCell>
                        <CTableDataCell>{item.player_display_name}</CTableDataCell>
                        <CTableDataCell>
                           {item.wallet_trnx_deposit_amount / 100}
                          {/* <CButton
                            size="sm"
                            color={item.wallet_trnx_deposit_amount / 100 >= 0 ? 'success' : 'danger'}
                            style={{ pointerEvents: 'none' }}
                          >
                            {item.wallet_trnx_deposit_amount / 100}
                          </CButton> */}
                        </CTableDataCell>
                        <CTableDataCell>{item.wallet_trnx_bonus_amount / 100}</CTableDataCell>
                        <CTableDataCell>{item.wallet_trnx_withdrawable_amount / 100}</CTableDataCell>
                        <CTableDataCell>{item.total_amount / 100}</CTableDataCell>

                        <CTableDataCell>{item.wallet_trnx_available_deposit_balance / 100}</CTableDataCell>
                         <CTableDataCell>{item.wallet_trnx_available_bonus_balance / 100}</CTableDataCell>
                         <CTableDataCell>{item.wallet_trnx_available_withdrawable_balance / 100}</CTableDataCell>
                         <CTableDataCell>{item.total_available_balance / 100}</CTableDataCell>
                        

                        <CTableDataCell> {new Date(item.wallet_trnx_date).toLocaleString()}</CTableDataCell>
                        <CTableDataCell>{item.wallet_trnx_type}</CTableDataCell>
                         {/* <CTableDataCell>{item.wallet_trnx_action}</CTableDataCell> */}
                        <CTableDataCell>{item.wallet_trnx_description}</CTableDataCell>
                        <CTableDataCell>
                          {/* <CButton
                            size="sm"
                            color="success"
                            style={{ pointerEvents: 'none' }}
                          > */}
                            {item.wallet_trnx_status}
                          {/* </CButton> */}
                        </CTableDataCell>
                      </CTableRow>
                      {index === limit - 1 && filteredTransactionData.length > limit && (
                        <CTableRow>
                          <CTableDataCell colSpan="100%" className="text-center">
                            <CButton
                              color="secondary"
                              variant="outline"
                              onClick={handleLoadMore}
                            >
                              Load More
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="10" className="text-center">
                      No data found.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </div>
      </div>
    </CCard>
  );
};

export default AdminTransactionManagement;
