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
  // Add more demo rows as needed...
];

const AdminTransactionManagement = () => {
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
            <h5>Admin Transaction List</h5>
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
                filename="admin-transaction-list"
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
                  <CTableHeaderCell>Win Wallet (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Main Wallet (Rs)</CTableHeaderCell>
                  <CTableHeaderCell>Bonus Wallet (Rs)</CTableHeaderCell>
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
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color={item.txnAmount >= 0 ? 'success' : 'danger'}
                            style={{ pointerEvents: 'none' }}
                          >
                            {item.txnAmount}
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>{item.winWallet.toFixed(2)}</CTableDataCell>
                        <CTableDataCell>{item.mainWallet.toFixed(2)}</CTableDataCell>
                        <CTableDataCell>{item.bonusWallet.toFixed(2)}</CTableDataCell>
                        <CTableDataCell>{item.date}</CTableDataCell>
                        <CTableDataCell>{item.type}</CTableDataCell>
                        <CTableDataCell>{item.remark}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="success"
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
