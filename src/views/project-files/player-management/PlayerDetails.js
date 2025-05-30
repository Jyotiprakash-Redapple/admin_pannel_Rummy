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
	CTableHeaderCell,
	CTableRow,
} from "@coreui/react";
import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants } from "../../../apis/Constant";
import { ToastContainer, toast } from "react-toastify";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // this registers the plugin
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
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const downloadTransactionsPDF = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to download.');
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Transaction Report', 14, 20);

  // Dynamically build headers
  const headers = Object.keys(transactions[0]).map((key) => formatHeader(key));

  // Build rows
  const rows = transactions.map((tx) =>
    Object.keys(tx).map((key) => {
      let val = tx[key];

      // Convert amount (if large) from paise to ₹
      if (typeof val === 'number' && /amount/.test(key.toLowerCase())) {
        return (val / 100).toFixed(2);
      }

      // Format ISO dates
      if (typeof val === 'string' && val.includes('T')) {
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
      halign: 'center',
    },
    bodyStyles: {
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    theme: 'grid',
  });

  doc.save('transactions.pdf');
};






const mockStatements = Array.from({ length: 5 }, (_, i) => ({
	id: i + 1,
	date: "2025-05-28",
	amount: 100 * (i + 1),
	type: "Credit",
}));

const Profile = () => {
	const dispatch = useDispatch();
	let navigate = useNavigate();
	let location = useLocation();
	const token = useSelector((state) => state.user.token);
	const [activeTab, setActiveTab] = useState("1");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");

	const [profile, setProfile] = useState({});
	const [accountTransaction, setAccountTransaction] = useState([]);
	const [addCashTransaction, setAddcashTransaction] = useState([]);
	const [bonusTransaction, setBonusTransaction] = useState([]);
  const [limit, setLimit] = useState(10);
  
  function balanceRefactor(b) {
    return b / 100
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
		Service.apiPostCallRequest(
			RouteURL.get_account_statement,
			params,
			token
		)
			.then((res) => {
				console.log(res, "transaction Player List");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					setAccountTransaction(res.data.statements);
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
		Service.apiPostCallRequest(
			RouteURL.add_cash_account_statement,
			params,
			token
		)
			.then((res) => {
				console.log(res, "transaction get_account_statement_add_cash Player List");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
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
		Service.apiPostCallRequest(
			RouteURL.bonus_account_statement,
			params,
			token
		)
			.then((res) => {
				console.log(res, "traget_account_statement_bonus_historynsaction Player List");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
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
	}, [activeTab, fromDate, toDate]);

	useEffect(() => {
		PlayerDetails();
	}, []);

	return (
		<CRow>
			{/* Left Side */}
			<CCol md={4}>
				<CCard className='mb-4'>
					<CCardBody>
						<div className='text-center mb-3'>
							<img
								src={mockProfile.profilePic}
								alt='Profile'
								style={{ width: "120px", borderRadius: "50%" }}
							/>
						</div>

						<h6 className='text-muted'>Player Details</h6>
            <ul style={{
              listStyleType: 'none'
            }}>
							<li>Name: {profile?.name}</li>
							<li>Display Name: {profile?.display_name}</li>
							<li>Mobile No: {profile?.mobile_no}</li>
							<li>Player ID: {profile?.player_id}</li>
							<li>Status: {profile?.status}</li>
							<li>Bank Verified: {profile?.bank_verified ? "Yes" : "No"}</li>
							<li>PAN Verified: {profile?.pan_verified ? "Yes" : "No"}</li>
							<li>KYC Aadhar Verified: {profile?.kyc_aadhar_verified ?? "Not available"}</li>
							<li>KYC PAN Verified: {profile?.kyc_pan_verified ?? "Not available"}</li>
							<li>Last Login: {new Date(profile?.last_login_timestamp).toLocaleString()}</li>
						</ul>

						<hr />
						<h6 className='text-muted'>Wallet Details</h6>
						<ul style={{
              listStyleType: 'none'
            }}>
							<li>Deposit: ₹{balanceRefactor(mockProfile.wallets.deposit)}</li>
							<li>Bonus: ₹{balanceRefactor(mockProfile.wallets.bonus)}</li>
							<li>Withdrawable: ₹{balanceRefactor(mockProfile.wallets.withdrawable)}</li>
						</ul>
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
                  setActiveTab("1")
                  setFromDate('')
                    setToDate('')
                  
                }
                }
								role='button'>
								Account Statement
							</CNavLink>
						</CNavItem>
						<CNavItem>
							<CNavLink
								active={activeTab === "2"}
                onClick={() => {
                  setActiveTab("2")
                   setFromDate('')
                    setToDate('')
                }
                }
								role='button'>
								Add Cash Transaction
							</CNavLink>
						</CNavItem>
						<CNavItem>
							<CNavLink
								active={activeTab === "3"}
                onClick={() => {
                   setFromDate('')
                    setToDate('')
                  setActiveTab("3")
                }
                }
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
              <CButton color='primary' onClick={() => {
                if (activeTab == 1) {
                  downloadTransactionsPDF(accountTransaction)
                } else if (activeTab == 2) {
                  downloadTransactionsPDF(addCashTransaction)
                } else if (activeTab == 3) {
                   downloadTransactionsPDF(bonusTransaction)
                }
              }}>Download</CButton>
						</div>

						<CTabContent>
							<CTabPane role='tabpanel' visible={activeTab === "1"}>
								<TransactionList
									data={accountTransaction}
									title='Account Statement'
									tab={activeTab}
									setLimit={setLimit}
								/>
							</CTabPane>
							<CTabPane role='tabpanel' visible={activeTab === "2"}>
								<TransactionList
									data={addCashTransaction}
									title='Add Cash Transaction'
									tab={activeTab}
									setLimit={setLimit}
								/>
							</CTabPane>
							<CTabPane role='tabpanel' visible={activeTab === "3"}>
								<TransactionList
									data={bonusTransaction}
									title='Bonus History'
									tab={activeTab}
									setLimit={setLimit}
								/>
							</CTabPane>
						</CTabContent>
					</CCardBody>
				</CCard>
			</CCol>
		</CRow>
	);
};

const TransactionList = ({ data, title, tab, setLimit }) => {
  function balanceRefactor(b) {
    return b / 100
  }
	if (tab == 1) {
		return (
			<div>
				{/* <h6 className="mb-3">{title}</h6> */}

				<CTable striped hover responsive>
					<CTableHead>
						<CTableRow>
							<CTableHeaderCell scope='col'>Transaction ID</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Reference ID</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Deposit Amount</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Bonus Amount</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Withdrawable Amount</CTableHeaderCell>
							<CTableHeaderCell scope='col'>Total Amount</CTableHeaderCell>
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
								<CTableDataCell>{txn.transaction_action}</CTableDataCell>
								<CTableDataCell>{txn.transaction_status}</CTableDataCell>
								<CTableDataCell>
									{new Date(txn.transaction_date).toLocaleString()}
								</CTableDataCell>
								<CTableDataCell>{txn.description}</CTableDataCell>
							</CTableRow>
            ))}
            <CTableRow>
  <CTableDataCell colSpan="100%" className="text-center">
    <CButton
      color="secondary"
      variant="outline"
      onClick={() => setLimit((prev) => prev + 1)}
    >
      Load More
    </CButton>
  </CTableDataCell>
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
							<CTableHeaderCell>Action</CTableHeaderCell>
							<CTableHeaderCell>Type</CTableHeaderCell>
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
								<CTableDataCell>₹{txn.deposit_amount}</CTableDataCell>
								<CTableDataCell>₹{txn.bonus_amount}</CTableDataCell>
								<CTableDataCell>₹{txn.withdrawable_amount}</CTableDataCell>
								<CTableDataCell>₹{txn.total_amount}</CTableDataCell>
								<CTableDataCell>{txn.transaction_action}</CTableDataCell>
								<CTableDataCell>{txn.transaction_type}</CTableDataCell>
								<CTableDataCell>{txn.transaction_status}</CTableDataCell>
								<CTableDataCell>
									{new Date(txn.transaction_date).toLocaleString()}
								</CTableDataCell>
								<CTableDataCell>{txn.description}</CTableDataCell>
							</CTableRow>
            ))}
            <CTableRow>
  <CTableDataCell colSpan="100%" className="text-center">
    <CButton
      color="secondary"
      variant="outline"
      onClick={() => setLimit((prev) => prev + 1)}
    >
      Load More
    </CButton>
  </CTableDataCell>
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
								<CTableDataCell>₹{txn.bonus_amount}</CTableDataCell>
								<CTableDataCell>₹{txn.total_amount}</CTableDataCell>
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
  <CTableDataCell colSpan="100%" className="text-center">
    <CButton
      color="secondary"
      variant="outline"
      onClick={() => setLimit((prev) => prev + 1)}
    >
      Load More
    </CButton>
  </CTableDataCell>
</CTableRow>

					</CTableBody>
				</CTable>

				
			</div>
		);
	}
};

export default Profile;
