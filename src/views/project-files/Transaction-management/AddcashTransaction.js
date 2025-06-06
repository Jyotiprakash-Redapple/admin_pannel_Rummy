import React, { useState } from 'react';
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

const AddCashTransactionManagement = () => {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');
  const [transaction, setTransaction] = useState([...transactionData]);
  const [limit, setLimit] = useState(10);
  const [isLoadMoreInActive, setIsLoadMoreInActive] = useState(true);

  const onCopy = (id) => {
    setCopied(id);
    toast.success('Order ID copied to clipboard!');
  };

  const filteredTransactionData = transaction.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
    if (limit + 10 >= filteredTransactionData.length) {
      setIsLoadMoreInActive(true);
    }
  };

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
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">Search</label>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Search by username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CInputGroup>
            </div>
            <div className="col-md-6 d-flex justify-content-end align-items-end">
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
                  <CTableHeaderCell>Order ID</CTableHeaderCell>
                  <CTableHeaderCell>Username</CTableHeaderCell>
                  <CTableHeaderCell>Txn Amount (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>GST (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Main Wallet (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
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
                          <span style={{ color: copied !== item.id ? "" : "#1b9e3e" }}>
                            {item.id}
                          </span>
                          <CopyToClipboard text={item.id} onCopy={() => onCopy(item.id)}>
                            <a href="#" style={{ marginLeft: '5px', color: copied !== item.id ? "" : "#1b9e3e" }}>
                              <CTooltip content="Copy Order ID">
                                {copied !== item.id ? (
                                  <i className="bi bi-copy" />
                                ) : (
                                  <i className="bi bi-check-lg" />
                                )}
                              </CTooltip>
                            </a>
                          </CopyToClipboard>
                        </CTableDataCell>
                        <CTableDataCell>{item.username}</CTableDataCell>
                        <CTableDataCell>{item.txnAmount}</CTableDataCell>
                        <CTableDataCell>{item.gst.toFixed(2)}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="success"
                            style={{ pointerEvents: 'none' }}
                          >
                            {item.mainWallet.toFixed(2)}
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>{item.date}</CTableDataCell>
                        <CTableDataCell>{item.type}</CTableDataCell>
                        <CTableDataCell>{item.remark}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color={item.status === 'Success' ? 'success' : 'danger'}
                            style={{ pointerEvents: 'none' }}
                          >
                            {item.status}
                          </CButton>
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
