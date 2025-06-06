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
import { cilSearch, cilSpreadsheet } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import AllInOneExportButton from '../../../components/AllInOneExportButton';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
export const transactionData = [
  {
    id: '684030fef8c1fd0d22170f5c',
    username: 'Grace',
    txnAmount: 26,
    winWallet: 26.0,
    mainWallet: 0.0,
    bonusWallet: 0,
    date: '04/06/2025 05:11PM',
    type: 'Game',
    remark: 'For Game ID 476909215427511',
    status: 'Success',
    roomCode: '476909215427511'
  },
  {
    id: '1aa06pz4g3mbhvgxye',
    username: 'Xlk9a3w37s',
    txnAmount: -13,
    winWallet: 0.0,
    mainWallet: -13.0,
    bonusWallet: 0,
    date: '04/06/2025 05:06PM',
    type: 'Game',
    remark: 'For Game ID 476909215427511',
    status: 'Success',
    roomCode: '476909215427511'
  },
 
];


const TransactionManagement = () => {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');
  const [transaction, setTransaction] = useState([...transactionData])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isLoadMoreInActive, setIsLoadMoreInActive]=useState(true)
  const onCopy = (id) => {
    setCopied(id);
    toast.success('Order ID copied to clipboard!');
  };

  const filteredTransactionData = transaction.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CCard className="mt-4">
      <ToastContainer />
      <div className="card shadow-lg rounded">
        <div className="card-body">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5>Game Play Transaction List</h5>
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
                filename="transaction-list"
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
                  <CTableHeaderCell>Room Code</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredTransactionData.length > 0 ? (
                  filteredTransactionData.map((item, index) => (
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
                      <CTableDataCell>{item.bonusWallet}</CTableDataCell>
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
                      <CTableDataCell>{item.roomCode}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                                  {isLoadMoreInActive ? (
                                    <></>
                                  ) : (
                                    <CTableDataCell colSpan='100%' className='text-center'>
                                      <CButton
                                        color='secondary'
                                        variant='outline'
                                        onClick={() => setLimit((prev) => prev + 20)}>
                                        Load More
                                      </CButton>
                                    </CTableDataCell>
                                  )}
                      </CTableRow>
                      </>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="11" className="text-center">
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

export default TransactionManagement;
