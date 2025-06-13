import React, { useState, useEffect } from "react";
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
	CTooltip,
} from "@coreui/react";
import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import AllInOneExportButton from "../../../components/AllInOneExportButton";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { useSelector } from "react-redux";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
function balanceRefactor(b) {
	return b / 100;
}
// Updated Admin Transaction Data
export const transactionData = [
	{
		id: "682dd5eddabab2775b379fc2",
		username: "Will jack",
		txnAmount: 5000,
		winWallet: 0.0,
		mainWallet: 5000.0,
		bonusWallet: 0.0,
		date: "21/05/2025 07:02PM",
		type: "ADMIN",
		remark: "Deposit by admin",
		status: "Success",
	},
	{
		id: "68323d6ddabab214bc3b8db2",
		username: "Hiten",
		txnAmount: -10,
		winWallet: -10.0,
		mainWallet: 0.0,
		bonusWallet: 0.0,
		date: "13/05/2025 05:00PM",
		type: "ADMIN",
		remark: "Deduct by admin",
		status: "Success",
	},
	{
		id: "6811c23fdabab278aeac538b",
		username: "Viraj",
		txnAmount: -20,
		winWallet: -20.0,
		mainWallet: 0.0,
		bonusWallet: 0.0,
		date: "30/04/2025 11:54AM",
		type: "ADMIN",
		remark: "Deduct by admin",
		status: "Success",
	},
	// Add more demo rows as needed...
];

const AdminTransactionManagement = () => {
	const token = useSelector((state) => state.user.token);
	const [search, setSearch] = useState("");
	const [copied, setCopied] = useState("");
	const [transaction, setTransaction] = useState([]);
	const [limit, setLimit] = useState(10);
	const [isLoadMoreInActive, setIsLoadMoreInActive] = useState(true);
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const onCopy = (id) => {
		setCopied(id);
		toast.success("Order ID copied to clipboard!");
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
			player_id: "",
			from_date: fromDate,
			to_date: toDate,
			page: 1,
			limit: limit,
		};
		Service.apiPostCallRequest(RouteURL.get_admin_transaction, params, token)
			.then((res) => {
				console.log(res, "transaction get_admin_transaction transaction");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					if (res.data.total == res.data.transactions.length) {
						setIsLoadMoreInActive(true);
					}
					setTransaction(res.data.transactions
);
				} else {
					toast.error(res.message, {
						position: "bottom-right",
						closeOnClick: true,
					});
				}
			})
			.catch((error) => {
				console.log(error, "error")
				toast.error(error.response.data.message, {
					position: "bottom-right",
				});
			});
	};

	useEffect(() => {
		fetchAdminCashTransaction();
	}, [limit]);
	return (
		<CCard className='mt-4'>
			<ToastContainer />
			<div className='card shadow-lg rounded'>
				<div className='card-body'>
					<CCardHeader className='d-flex justify-content-between align-items-center'>
						<h5>Admin Transaction List</h5>
					</CCardHeader>

					{/* Search and Export */}
					<div className='row mb-4'>
						<div className='col-md-3'>
							<label htmlFor='search' className='form-label'>
								Search
							</label>
							<CInputGroup>
								<CInputGroupText>
									<CIcon icon={cilSearch} />
								</CInputGroupText>
								<CFormInput
									type='text'
									placeholder='Search...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</CInputGroup>
						</div>
						<div className="col-md-3"></div>
						<div className="col-md-3"></div>
						<div className='col-md-3 d-flex justify-content-end align-items-end'>
							<AllInOneExportButton
								data={filteredTransactionData}
								filename='admin-transaction-list'
							/>
						</div>
					</div>

					{/* Table */}
					<div className='table-responsive'>
						<CTable hover bordered responsive>
							<CTableHead className='table-primary text-center align-middle'>
								<CTableRow>
									<CTableHeaderCell>Transaction ID</CTableHeaderCell>
									{/* <CTableHeaderCell>Username</CTableHeaderCell> */}
									<CTableHeaderCell>Deposit Amount (Rs)</CTableHeaderCell>
									<CTableHeaderCell>Bonus Amount (Rs)</CTableHeaderCell>
									<CTableHeaderCell>Withdrawable Wallet (Rs)</CTableHeaderCell>
									<CTableHeaderCell>Total Wallet (Rs)</CTableHeaderCell>

										<CTableHeaderCell>Available Deposit Amount (Rs)</CTableHeaderCell>
									<CTableHeaderCell>Available Bonus Amount (Rs)</CTableHeaderCell>
									<CTableHeaderCell>Available Withdrawable Wallet (Rs)</CTableHeaderCell>
									<CTableHeaderCell>Available Total Wallet (Rs)</CTableHeaderCell>
									<CTableHeaderCell>Date</CTableHeaderCell>
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
													<span style={{ color: copied !== item.wallet_trnx_id ? "" : "#1b9e3e" }}>{item.wallet_trnx_id}</span>
													<CopyToClipboard text={item.wallet_trnx_id} onCopy={() => onCopy(item.wallet_trnx_id)}>
														<a
															href='#'
															style={{ marginLeft: "5px", color: copied !== item.wallet_trnx_id ? "" : "#1b9e3e" }}>
															<CTooltip content='Copy Order ID'>
																{copied !== item.wallet_trnx_id ? (
																	<i className='bi bi-copy' />
																) : (
																	<i className='bi bi-check-lg' />
																)}
															</CTooltip>
														</a>
													</CopyToClipboard>
												</CTableDataCell>
												{/* <CTableDataCell>{item.username}</CTableDataCell> */}
												<CTableDataCell>
													₹{item.wallet_trnx_deposit_amount / 100}
													{/* <CButton
														size='sm'
														color={item.txnAmount >= 0 ? "success" : "danger"}
														style={{ pointerEvents: "none" }}>
														{item.wallet_trnx_deposit_amount}
													</CButton> */}
												</CTableDataCell>
												<CTableDataCell>₹{item.wallet_trnx_bonus_amount /100}</CTableDataCell>
												<CTableDataCell>₹{item.wallet_trnx_withdrawable_amount / 100}</CTableDataCell>
													<CTableDataCell>₹{item.total_amount / 100}</CTableDataCell>
												<CTableDataCell>₹{item.wallet_trnx_available_deposit_balance / 100}</CTableDataCell>
												<CTableDataCell>₹{item.wallet_trnx_available_bonus_balance / 100}</CTableDataCell>
												<CTableDataCell>₹{item.wallet_trnx_available_withdrawable_balance / 100}</CTableDataCell>
												<CTableDataCell>₹{item.total_available_balance / 100}</CTableDataCell>
												<CTableDataCell>
													
													{new Date(item.wallet_trnx_date).toLocaleString()}
												</CTableDataCell>
												
												<CTableDataCell>{item.wallet_trnx_description}</CTableDataCell>
												<CTableDataCell>
																	{item.wallet_trnx_status}
													{/* <CButton size='sm' color='success' style={{ pointerEvents: "none" }}>
														{item.wallet_trnx_status}
													</CButton> */}
												</CTableDataCell>
											</CTableRow>
											{index === limit - 1 && filteredTransactionData.length > limit && (
												<CTableRow>
													<CTableDataCell colSpan='100%' className='text-center'>
														<CButton color='secondary' variant='outline' onClick={handleLoadMore}>
															Load More
														</CButton>
													</CTableDataCell>
												</CTableRow>
											)}
										</>
									))
								) : (
									<CTableRow>
										<CTableDataCell colSpan='10' className='text-center'>
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
