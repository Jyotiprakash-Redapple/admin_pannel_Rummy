import React, { useEffect, useState } from "react";
import {
	CCard,
	CCardBody,
	CRow,
	CCol,
	CNav,
	CNavItem,
	CNavLink,
	CTabContent,
	CTabPane,
	CButton,
	CFormInput,
	CTable,
	CTableBody,
	CTableDataCell,
	CTableHead,
	 CBadge,
	CTableHeaderCell,
	 CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,

  CForm,

  CFormSelect,
  CFormLabel,
  CFormTextarea,
	CTableRow,
} from "@coreui/react";

import { cilMoney, cilXCircle, cilCheckCircle } from '@coreui/icons';
import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants } from "../../../apis/Constant";
import { ToastContainer, toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // this registers the plugin
import styles from './PlayerDetails.module.css'
import AllInOneExportButton from "../../../components/AllInOneExportButton";
const mockProfile = {
	name: "John Doe",
	email: "john@example.com",
	phone: "+91-9876543210",
	profilePic: "https://cdn-icons-png.flaticon.com/512/11478/11478365.png",
	wallets: {
		deposit: 1500,
		bonus: 300,
		withdrawable: 1200,
	},
};

const formatHeader = (key) =>
	key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const downloadTransactionsPDF = (transactions) => {
	if (!transactions || transactions.length === 0) {
		alert("No transactions to download.");
		return;
	}

	const doc = new jsPDF();

	doc.setFontSize(16);
	doc.text("Transaction Report", 14, 20);

	// Dynamically build headers
	const headers = Object.keys(transactions[0]).map((key) => formatHeader(key));

	// Build rows
	const rows = transactions.map((tx) =>
		Object.keys(tx).map((key) => {
			let val = tx[key];

			// Convert amount (if large) from paise to ₹
			if (typeof val === "number" && /amount/.test(key.toLowerCase())) {
				return (val / 100).toFixed(2);
			}

			// Format ISO dates
			if (typeof val === "string" && val.includes("T")) {
				return new Date(val).toLocaleString();
			}

			return val;
		})
	);

	// Add table
	autoTable(doc, {
		head: [headers],
		body: rows,
		startY: 30,
		styles: {
			fontSize: 9,
			cellPadding: 0,
		},
		headStyles: {
			fillColor: [22, 160, 133],
			textColor: 255,
			halign: "center",
		},
		bodyStyles: {
			halign: "left",
		},
		alternateRowStyles: {
			fillColor: [240, 240, 240],
		},
		theme: "grid",
	});

	doc.save("transactions.pdf");
};

const mockStatements = Array.from({ length: 5 }, (_, i) => ({
	id: i + 1,
	date: "2025-05-28",
	amount: 100 * (i + 1),
	type: "Credit",
}));


const AddMoneyModal = ({ visible, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [txnMode, setTxnMode] = useState('Refund');
  const [remark, setRemark] = useState('');
  const [walletType, setWalletType] = useState('main');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      amount,
      txnMode,
      remark,
      walletType
    });
    // Reset the form
    setAmount('');
    setTxnMode('Refund');
    setRemark('');
    setWalletType('main');
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>Add Money</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel htmlFor="amount">Amount</CFormLabel>
            <CFormInput
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <CFormLabel htmlFor="remark">Remark</CFormLabel>
            <CFormTextarea
              id="remark"
              placeholder="Enter remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Add to</CFormLabel>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="mainWallet"
                  name="walletType"
                  value="main"
                  checked={walletType === 'main'}
                  onChange={(e) => setWalletType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="mainWallet">
                  Main wallet
                </label>
              </div>
              
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="bonusWallet"
                  name="walletType"
                  value="bonus"
                  checked={walletType === 'bonus'}
                  onChange={(e) => setWalletType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="bonusWallet">
                  Bonus wallet
                </label>
              </div>
            </div>
          </div>
          <CButton type="submit" color="success">
            Add
          </CButton>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
const DeDuctMoneyModal = ({ visible, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [txnMode, setTxnMode] = useState('Refund');
  const [remark, setRemark] = useState('');
  const [walletType, setWalletType] = useState('main');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      amount,
      txnMode,
      remark,
      walletType
    });
    // Reset the form
    setAmount('');
    setTxnMode('Refund');
    setRemark('');
    setWalletType('main');
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>DeDuct Money</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel htmlFor="amount">Amount</CFormLabel>
            <CFormInput
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <CFormLabel htmlFor="remark">Remark</CFormLabel>
            <CFormTextarea
              id="remark"
              placeholder="Enter remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Deduct From</CFormLabel>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="mainWallet"
                  name="walletType"
                  value="main"
                  checked={walletType === 'main'}
                  onChange={(e) => setWalletType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="mainWallet">
                  Main wallet
                </label>
              </div>
              
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="bonusWallet"
                  name="walletType"
                  value="bonus"
                  checked={walletType === 'bonus'}
                  onChange={(e) => setWalletType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="bonusWallet">
                  Bonus wallet
                </label>
              </div>
            </div>
          </div>
          <CButton type="submit" color="danger">
            Deduct
          </CButton>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};


const Profile = () => {
	const dispatch = useDispatch();
	let navigate = useNavigate();
	let location = useLocation();
	const token = useSelector((state) => state.user.token);
	const [activeTab, setActiveTab] = useState("1");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [addMoneyModal, setAddMoneyModal] = useState(false)
	const [dedubtMoneyModal, setDedubtMoneyModal]=useState(false)
	const [profile, setProfile] = useState({});
	const [accountTransaction, setAccountTransaction] = useState([]);
	const [addCashTransaction, setAddcashTransaction] = useState([]);
	const [bonusTransaction, setBonusTransaction] = useState([]);
	const [limit, setLimit] = useState(10);
	const [isLoadMoreInActive, setIsLoadMoreInActive] = useState(false);
	function balanceRefactor(b) {
		return b / 100;
	}
	const PlayerDetails = () => {
		console.log(location.state, "SATTE");

		Service.apiPostCallRequest(
			RouteURL.get_profile_details,
			{ player_id: location?.state?.playerId },
			token
		)
			.then((res) => {
				console.log(res, "filter Player List");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					setProfile(res.data.profile_details);
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

	const fetchAccountTransaction = () => {
		let params = {
			player_id: location?.state?.playerId,
			from_date: fromDate,
			to_date: toDate,
			page: 1,
			limit: limit,
		};
		Service.apiPostCallRequest(RouteURL.get_account_statement, params, token)
			.then((res) => {
				console.log(res, "transaction Player List");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					setAccountTransaction(res.data.statements);
					if (res.data.total === res.data.statements.length) {
						setIsLoadMoreInActive(true);
					}
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
	const fetchAddCashTransaction = () => {
		let params = {
			player_id: location?.state?.playerId,
			from_date: fromDate,
			to_date: toDate,
			page: 1,
			limit: limit,
		};
		Service.apiPostCallRequest(RouteURL.add_cash_account_statement, params, token)
			.then((res) => {
				console.log(res, "transaction get_account_statement_add_cash Player List");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					if (res.data.total == res.data.transactions.length) {
						setIsLoadMoreInActive(true);
					}
					setAddcashTransaction(res.data.transactions);
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

	const fetchBonusransaction = () => {
		let params = {
			player_id: location?.state?.playerId,
			from_date: fromDate,
			to_date: toDate,
			page: 1,
			limit: limit,
		};
		Service.apiPostCallRequest(RouteURL.bonus_account_statement, params, token)
			.then((res) => {
				console.log(res, "traget_account_statement_bonus_historynsaction Player List");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					if (res.data.total === res.data.bonusTransactions) {
							setIsLoadMoreInActive(true);
					}
					setBonusTransaction(res.data.bonusTransactions);
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
		if (activeTab == 1) {
			fetchAccountTransaction();
		} else if (activeTab == 2) {
			fetchAddCashTransaction();
		} else if (activeTab == 3) {
			fetchBonusransaction();
		}
	}, [activeTab, fromDate, toDate, limit]);

	useEffect(() => {
		PlayerDetails();
	}, []);

	return (
		<CRow>
			{/* Left Side */}
			<CCol md={4}>
				<AddMoneyModal visible={addMoneyModal} onClose={() => setAddMoneyModal(false)} onSubmit={() => { }} />
				<DeDuctMoneyModal visible={dedubtMoneyModal} onClose={() => setDedubtMoneyModal(false)} onSubmit={() => { }}/>
    <CCard className={styles.card}>
					<CCardBody>
						 <div className={styles.header}>
          <img
            src={profile?.profile || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png'}
            alt="Profile"
            className={styles.profilePicture}
          />
          <div className={styles.displayName}>{profile.display_name}</div>
        </div>
        {/* Status Indicators */}
        <div className={styles.statusRow}>
          <span>KYC Status:</span>
          <CBadge color={profile.kyc_status ? 'success' : 'danger'}>
            {profile.kyc_status ? 'Done' : 'Not Done'}
          </CBadge>
        </div>
      
        <div className={styles.statusRow}>
          <span>Status:</span>
          <CBadge color={profile.status === 'active' ? 'success' : 'danger'}>
            {profile.status?.charAt(0).toUpperCase() + profile.status?.slice(1)}
          </CBadge>
        </div>
        <div className={styles.statusRow}>
          <span>Pan Verification:</span>
          <CBadge color={profile?.pan_verified ? 'success' : 'danger'}>
            {profile.email_verified ? 'Verified' : 'Unverified'}
          </CBadge>
        </div>
 <div className={styles.statusRow}>
          <span>Aadhaar Verification:</span>
          <CBadge color={profile?.pan_verified ? 'success' : 'danger'}>
            {profile.email_verified ? 'Verified' : 'Unverified'}
          </CBadge>
						</div>
						<div className={styles.statusRow}>
          <span>Bank Verification:</span>
          <CBadge color={profile?.pan_verified ? 'success' : 'danger'}>
            {profile.email_verified ? 'Verified' : 'Unverified'}
          </CBadge>
        </div>
        {/* Profile Info Rows */}
        <div className={styles.row}>
          <span>Name</span>
          <span className={styles.value}>{profile?.name}</span>
        </div>
        <div className={styles.row}>
          <span>Display Name</span>
          <span className={styles.value}>{profile?.display_name}</span>
        </div>
        <div className={styles.row}>
          <span>Mobile No</span>
          <span className={styles.value}>{profile?.mobile_no}</span>
        </div>
        <div className={styles.row}>
          <span>Player ID</span>
          <span className={styles.value}>{profile?.player_id}</span>
        </div>
        <div className={styles.row}>
          <span>Bank Verified</span>
          <span className={styles.value}>{profile?.bank_verified ? 'Yes' : 'No'}</span>
        </div>
        <div className={styles.row}>
          <span>PAN Verified</span>
          <span className={styles.value}>{profile?.pan_verified ? 'Yes' : 'No'}</span>
        </div>
        <div className={styles.row}>
          <span>KYC Aadhar Verified</span>
          <span className={styles.value}>{profile?.kyc_aadhar_verified ?? 'Not available'}</span>
        </div>
        <div className={styles.row}>
          <span>KYC PAN Verified</span>
          <span className={styles.value}>{profile?.kyc_pan_verified ?? 'Not available'}</span>
        </div>
        <div className={styles.row}>
          <span>Last Login</span>
          <span className={styles.value}>{new Date(profile?.last_login_timestamp).toLocaleString()}</span>
        </div>

        {/* Wallet Info Rows */}
        <div className={styles.row}>
          <span>Total Balance</span>
          <span className={styles.value}>₹{profile?.wallets?.total ? profile?.wallets?.total / 100 : 0}</span>
        </div>
        {/* <div className={styles.row}>
          <span>Bonus</span>
          <span className={styles.value}>₹{profile?.wallets?.bonus / 100}</span>
        </div>
        <div className={styles.row}>
          <span>Withdrawable</span>
          <span className={styles.value}>₹{profile?.wallets?.withdrawable / 100}</span>
        </div> */}

        {/* Action Buttons */}
        <div className={styles.buttons}>
          <CButton
            color={profile.status === 'active' ? 'danger' : 'success'}
            className={styles.button}
              style={{ color: 'white' }}
          >
            {profile.status === 'active' ? (
              <>
                {/* <CIcon icon={cilXCircle} className="me-2" /> */}
                Deactivate
              </>
            ) : (
              <>
                {/* <CIcon icon={cilCheckCircle} className="me-2" /> */}
                Activate
              </>
            )}
          </CButton>

          <CButton
								color="info"
								  style={{ color: 'white' }}
            className={styles.button}
            onClick={()=>{setAddMoneyModal(true)}}
          >
            {/* <CIcon icon={cilMoney} className="me-2" /> */}
            Add Money
          </CButton>

          <CButton
								color="danger"
								  style={{ color: 'white' }}
            className={styles.button}
            onClick={()=> setDedubtMoneyModal(true)}
          >
            {/* <CIcon icon={cilMoney} className="me-2" /> */}
            Deduct Money
          </CButton>
        </div>
      </CCardBody>
    </CCard>


			</CCol>

			{/* Right Side */}
			<CCol md={8}>
				<CCard>
					<CNav variant='tabs'>
						<CNavItem>
							<CNavLink
								active={activeTab === "1"}
								onClick={() => {
									setActiveTab("1");
									setFromDate("");
									setToDate("");
									setIsLoadMoreInActive(false);
									setLimit(10)
								}}
								role='button'>
								Account Statement
							</CNavLink>
						</CNavItem>
						<CNavItem>
							<CNavLink
								active={activeTab === "2"}
								onClick={() => {
									setActiveTab("2");
									setFromDate("");
									setToDate("");
											setLimit(10)
									setIsLoadMoreInActive(false);
								}}
								role='button'>
								Add Cash Transaction
							</CNavLink>
						</CNavItem>
						<CNavItem>
							<CNavLink
								active={activeTab === "3"}
								onClick={() => {
									setFromDate("");
									setToDate("");
									setActiveTab("3");
											setLimit(10)
									setIsLoadMoreInActive(false);
								}}
								role='button'>
								Bonus History
							</CNavLink>
						</CNavItem>
					</CNav>
					<CCardBody>
						<div className='d-flex gap-2 mb-3'>
							<CFormInput
								type='date'
								value={fromDate}
								onChange={(e) => setFromDate(e.target.value)}
								placeholder='From'
							/>
							<CFormInput
								type='date'
								value={toDate}
								onChange={(e) => setToDate(e.target.value)}
								placeholder='To'
							/>

							

							<AllInOneExportButton 
  data={
    activeTab == 1 
      ? accountTransaction 
      : activeTab == 2 
        ? addCashTransaction 
        : bonusTransaction
  }
  filename={
    activeTab == 1 
      ? 'accountTransaction' 
      : activeTab === 2 
        ? 'addCashTransaction' 
        : 'bonusTransaction'
  }
/>

							

							{/* <CButton
								color='primary'
								onClick={() => {
									if (activeTab == 1) {
										downloadTransactionsPDF(accountTransaction);
									} else if (activeTab == 2) {
										downloadTransactionsPDF(addCashTransaction);
									} else if (activeTab == 3) {
										downloadTransactionsPDF(bonusTransaction);
									}
								}}>
								Download
							</CButton> */}
						</div>

						<CTabContent>
							<CTabPane role='tabpanel' visible={activeTab === "1"}>
								<TransactionList
									data={accountTransaction}
									title='Account Statement'
									tab={activeTab}
									setLimit={setLimit}
									isLoadMoreInActive={isLoadMoreInActive}
								/>
							</CTabPane>
							<CTabPane role='tabpanel' visible={activeTab === "2"}>
								<TransactionList
									data={addCashTransaction}
									title='Add Cash Transaction'
									tab={activeTab}
									setLimit={setLimit}
									isLoadMoreInActive={isLoadMoreInActive}
								/>
							</CTabPane>
							<CTabPane role='tabpanel' visible={activeTab === "3"}>
								<TransactionList
									data={bonusTransaction}
									title='Bonus History'
									tab={activeTab}
									setLimit={setLimit}
									isLoadMoreInActive={isLoadMoreInActive}
								/>
							</CTabPane>
						</CTabContent>
					</CCardBody>
				</CCard>
			</CCol>
		</CRow>
	);
};

const TransactionList = ({
	data,
	title,
	tab,
	setLimit,
	isLoadMoreInActive,
}) => {
	function balanceRefactor(b) {
		return b / 100;
	}
	if (tab == 1) {
		return (
			<div>
				{/* <h6 className="mb-3">{title}</h6> */}

				<CTable striped hover responsive>
					<CTableHead className="table-primary text-center align-middle">
						<CTableRow>
							<CTableHeaderCell scope='col'>Transaction ID</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Reference ID</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Deposit Amount</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Bonus Amount</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Withdrawable Amount</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Total Amount</CTableHeaderCell>

							<CTableHeaderCell scope='col'>Available Bonus Balance</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Available Deposit Balance</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Available Withdrawable Balance</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Action</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Status</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Date</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Description</CTableHeaderCell>
						</CTableRow>
					</CTableHead>
					<CTableBody>
						{data.map((txn) => (
							<CTableRow key={txn.wallet_transaction_id}>
								<CTableDataCell>{txn.wallet_transaction_id}</CTableDataCell>
								<CTableDataCell>{txn.reference_id}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.deposit_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.bonus_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.withdrawable_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.total_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.available_bonus_balance)}</CTableDataCell>
								<CTableDataCell>
									₹{balanceRefactor(txn.available_deposit_balance)}
								</CTableDataCell>
								<CTableDataCell>
									₹{balanceRefactor(txn.available_withdrawable_balance)}
								</CTableDataCell>
								<CTableDataCell>{txn.transaction_action}</CTableDataCell>
								<CTableDataCell>{txn.transaction_status}</CTableDataCell>
								<CTableDataCell>
									{new Date(txn.transaction_date).toLocaleString()}
								</CTableDataCell>
								<CTableDataCell>{txn.description}</CTableDataCell>
							</CTableRow>
						))}
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
					</CTableBody>
				</CTable>
			</div>
		);
	}
	if (tab == 2) {
		return (
			<div>
				{/* <h6 className="mb-3">{title}</h6> */}

				<CTable striped hover responsive>
					<CTableHead>
						<CTableRow>
							<CTableHeaderCell>Transaction ID</CTableHeaderCell>
							<CTableHeaderCell>Reference ID</CTableHeaderCell>
							<CTableHeaderCell>Deposit</CTableHeaderCell>
							<CTableHeaderCell>Bonus</CTableHeaderCell>
							<CTableHeaderCell>Withdrawable</CTableHeaderCell>
							<CTableHeaderCell>Total</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Available Bonus Balance</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Available Deposit Balance</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Available Withdrawable Balance</CTableHeaderCell>

							<CTableHeaderCell>Action</CTableHeaderCell>
							{/* <CTableHeaderCell>Type</CTableHeaderCell> */}
							<CTableHeaderCell>Status</CTableHeaderCell>
							<CTableHeaderCell>Date</CTableHeaderCell>
							<CTableHeaderCell>Description</CTableHeaderCell>
						</CTableRow>
					</CTableHead>
					<CTableBody>
						{data.map((txn) => (
							<CTableRow key={txn.wallet_transaction_id}>
								<CTableDataCell>{txn.wallet_transaction_id}</CTableDataCell>
								<CTableDataCell>{txn.reference_id}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.deposit_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.bonus_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.withdrawable_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.total_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.available_bonus_balance)}</CTableDataCell>
								<CTableDataCell>
									₹{balanceRefactor(txn.available_deposit_balance)}
								</CTableDataCell>
								<CTableDataCell>
									₹{balanceRefactor(txn.available_withdrawable_balance)}
								</CTableDataCell>
								<CTableDataCell>{txn?.transaction_action || "TFB"}</CTableDataCell>
								{/* <CTableDataCell>{txn.transaction_type}</CTableDataCell> */}
								<CTableDataCell>{txn.transaction_status}</CTableDataCell>
								<CTableDataCell>
									{new Date(txn.transaction_date).toLocaleString()}
								</CTableDataCell>
								<CTableDataCell>{txn.description}</CTableDataCell>
							</CTableRow>
						))}
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
					</CTableBody>
				</CTable>
			</div>
		);
	}
	if (tab == 3) {
		return (
			<div>
				{/* <h6 className="mb-3">{title}</h6> */}

				<CTable striped hover responsive>
					<CTableHead>
						<CTableRow>
							<CTableHeaderCell>Transaction ID</CTableHeaderCell>
							<CTableHeaderCell>Reference ID</CTableHeaderCell>
							<CTableHeaderCell>Bonus Amount</CTableHeaderCell>
							<CTableHeaderCell>Total Amount</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Available Bonus Balance</CTableHeaderCell>
							<CTableHeaderCell>Action</CTableHeaderCell>
							<CTableHeaderCell>Status</CTableHeaderCell>
							<CTableHeaderCell>Type</CTableHeaderCell>
							<CTableHeaderCell>Date</CTableHeaderCell>
							<CTableHeaderCell>Description</CTableHeaderCell>
						</CTableRow>
					</CTableHead>
					<CTableBody>
						{data.map((txn) => (
							<CTableRow key={txn.wallet_transaction_id}>
								<CTableDataCell>{txn.wallet_transaction_id}</CTableDataCell>
								<CTableDataCell>{txn.reference_id}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.bonus_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.total_amount)}</CTableDataCell>
								<CTableDataCell>₹{balanceRefactor(txn.available_bonus_balance)}</CTableDataCell>
								<CTableDataCell>{txn.transaction_action}</CTableDataCell>
								<CTableDataCell>{txn.transaction_status}</CTableDataCell>
								<CTableDataCell>{txn.transaction_type}</CTableDataCell>
								<CTableDataCell>
									{new Date(txn.transaction_date).toLocaleString()}
								</CTableDataCell>
								<CTableDataCell>{txn.description}</CTableDataCell>
							</CTableRow>
						))}
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
					</CTableBody>
				</CTable>
			</div>
		);
	}
};

export default Profile;
