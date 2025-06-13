import React, { useEffect, useState } from 'react';
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
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
// Demo Data
export const transactionData = [
  {
    id: '68403440f8c1fd05712f79f4',
    username: 'Xlk9a3w37s',
    txnAmount: 1000,
    gst: 218.75,
    mainWallet: 781.25,
    date: '04/06/2025 05:25PM',
    type: 'CF',
    remark: 'Simulated response message',
    status: 'Success'
  },
  {
    id: '68401a17f8c1fd05711ae6a9',
    username: 'Xlk9a3w37s',
    txnAmount: 500,
    gst: 109.37,
    mainWallet: 390.63,
    date: '04/06/2025 03:34PM',
    type: 'CF',
    remark: 'User dropped and did not complete the transaction',
    status: 'Failed'
  }
  // Add more demo rows as needed...
];
function balanceRefactor(b) {
		return b / 100;
	}

const AddCashTransactionManagement = () => {
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
    toast.success('Order ID copied to clipboard!');
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

  const fetchAddCashTransaction = () => {
    let params = {
      player_id: "",
			from_date: fromDate,
			to_date: toDate,
			page: 1,
			limit: limit,
		};
		Service.apiPostCallRequest(RouteURL.add_cash_account_statement, params, token)
			.then((res) => {
				console.log(res, "transaction add cash transaction");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					if (res.data.total == res.data.transactions.length) {
						setIsLoadMoreInActive(true);
					}
					setTransaction(res.data.transactions);
				} else {
					toast.error(res.data.message, {
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
    fetchAddCashTransaction()
  },[limit])

  return (
    <CCard className="mt-4">
      <ToastContainer />
      <div className="card shadow-lg rounded">
        <div className="card-body">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5>Add Cash Transaction List</h5>
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
            <div className='col-md-3'></div>
            <div className='col-md-3'></div>
            <div className="col-md-3 d-flex justify-content-end align-items-end">
              <AllInOneExportButton
                data={filteredTransactionData}
                filename="add-cash-transaction-list"
              />
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <CTable hover bordered responsive>
              <CTableHead className="table-primary text-center align-middle">
                           <CTableRow>
                            <CTableHeaderCell>Transaction ID</CTableHeaderCell>
                            {/* <CTableHeaderCell>Reference ID</CTableHeaderCell> */}
                            <CTableHeaderCell>Deposit</CTableHeaderCell>
                            <CTableHeaderCell>Bonus</CTableHeaderCell>
                            <CTableHeaderCell>Withdrawable</CTableHeaderCell>
                            <CTableHeaderCell>Total</CTableHeaderCell>
               
                            <CTableHeaderCell scope='col'>Available Bonus Balance</CTableHeaderCell>
                            <CTableHeaderCell scope='col'>Available Deposit Balance</CTableHeaderCell>
                            <CTableHeaderCell scope='col'>Available Withdrawable Balance</CTableHeaderCell>
               
                            {/* <CTableHeaderCell>Action</CTableHeaderCell> */}
                            {/* <CTableHeaderCell>Type</CTableHeaderCell> */}
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Date</CTableHeaderCell>
                            <CTableHeaderCell>Description</CTableHeaderCell>
                          </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredTransactionData.length > 0 ? (
                  filteredTransactionData.slice(0, limit).map((txn, index) => (
                    <>
                      <CTableRow key={txn.wallet_trnx_id}>
                          <CTableDataCell>
                                                  <span style={{ color: copied !== txn.wallet_trnx_id ? "" : "#1b9e3e" }}>{txn.wallet_trnx_id}</span>
                                                  <CopyToClipboard text={txn.wallet_trnx_id} onCopy={() => onCopy(txn.wallet_trnx_id)}>
                                                    <a
                                                      href='#'
                                                      style={{ marginLeft: "5px", color: copied !== txn.wallet_trnx_id ? "" : "#1b9e3e" }}>
                                                      <CTooltip content='Copy Order ID'>
                                                        {copied !== txn.wallet_trnx_id ? (
                                                          <i className='bi bi-copy' />
                                                        ) : (
                                                          <i className='bi bi-check-lg' />
                                                        )}
                                                      </CTooltip>
                                                    </a>
                                                  </CopyToClipboard>
                        </CTableDataCell>
                        
                                
                                    {/* <CTableDataCell>{txn.reference_id}</CTableDataCell> */}
                                    <CTableDataCell>₹{balanceRefactor(txn.wallet_trnx_deposit_amount)}</CTableDataCell>
                                    <CTableDataCell>₹{balanceRefactor(txn.wallet_trnx_bonus_amount)}</CTableDataCell>
                                    <CTableDataCell>₹{balanceRefactor(txn.wallet_trnx_withdrawable_amount)}</CTableDataCell>
                                    <CTableDataCell>₹{balanceRefactor(txn.total_amount)}</CTableDataCell>
                                    <CTableDataCell>₹{balanceRefactor(txn.wallet_trnx_available_bonus_balance)}</CTableDataCell>
                                    <CTableDataCell>
                                      ₹{balanceRefactor(txn.wallet_trnx_available_deposit_balance)}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      ₹{balanceRefactor(txn.wallet_trnx_available_withdrawable_balance)}
                                    </CTableDataCell>
                                    {/* <CTableDataCell>{txn?.wallet_trnx_action || "TFB"}</CTableDataCell> */}
                                    {/* <CTableDataCell>{txn.transaction_type}</CTableDataCell> */}
                                    <CTableDataCell>{txn.wallet_trnx_status}</CTableDataCell>
                                    <CTableDataCell>
                                      {new Date(txn.wallet_trnx_date).toLocaleString()}
                                    </CTableDataCell>
                                    <CTableDataCell>{txn.wallet_trnx_description}</CTableDataCell>
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
                    <CTableDataCell colSpan="9" className="text-center">
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

export default AddCashTransactionManagement;
