/**
 * @file_purpose  page for showing player list
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
 */
import React, { useState, useEffect, useRef } from "react";
import {
	CInputGroupText,
	CInputGroup,
	CFormInput,
	CDropdown,
	CDropdownToggle,
	CDropdownMenu,
	CDropdownItem,
	CFormTextarea,
	CCardHeader,
	CBadge 
} from "@coreui/react";
import {
	CTable,
	CTableHead,
	CTableRow,
	CTableHeaderCell,
	CTableBody,
	CTableDataCell,
	CTooltip,
} from "@coreui/react";
import { CButton } from "@coreui/react";
import { cilSpreadsheet } from "@coreui/icons";
import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants } from "../../../apis/Constant";
import { ToastContainer, toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
	SelectCurrency,
	currencyWiseAmount,
	PlayerDetails,
} from "../../../redux/slices/superAdminStateSlice";
import MasterData from "../../../Utility/MasterData";
import Swal from "sweetalert2";
import moment from "moment";
import AddEditPlayerForm from "./addEditPlayerForm";
import * as XLSX from "xlsx";
import DateTimeRangeContainer from "react-advanced-datetimerange-picker";
import { FormControl } from "react-bootstrap";
import Pagination from "../../../components/Pagination";
import AllInOneExportButton from "../../../components/AllInOneExportButton";
export default function PlayerList() {
	const dispatch = useDispatch();
	let navigate = useNavigate();
	const token = useSelector((state) => state.user.token);
	const [accountList, setAccountList] = useState([]);
	const [startDate, setStartDate] = useState(moment().subtract(1, "days"));
	const [endDate, setEndDate] = useState(moment());
	const [state, setState] = useState({
		list: [],
		search: "",
		limit: 10,
		page: 1,
		copied: false,
		currentPage: "",
		totalPlayers: "",
		totalPages: "",
		copyText: "",
		currentList: [],
		_status: false,
		account_id: "",
		status_id: "active",
	});

	function balanceRefactor(b) {
		return b / 100;
	}

	// Define custom predefined ranges
	const predefinedRanges = {
		"Last 24 Hours": [moment().subtract(24, "hours"), moment()],
		"Last 7 Days": [moment().subtract(6, "days"), moment()],
		"Last 30 Days": [moment().subtract(29, "days"), moment()],
		"Today Only": [moment().startOf("day"), moment().endOf("day")],
		"Yesterday Only": [
			moment().subtract(1, "days").startOf("day"),
			moment().subtract(1, "days").endOf("day"),
		],
		"This Month": [moment().startOf("month"), moment().endOf("month")],
		"Previous Month": [
			moment().subtract(1, "month").startOf("month"),
			moment().subtract(1, "month").endOf("month"),
		],
		"Last 2 Months": [
			moment().subtract(2, "month").startOf("month"),
			moment().endOf("month"),
		],
		"Last 3 Months": [
			moment().subtract(3, "month").startOf("month"),
			moment().endOf("month"),
		],
		"Custom Range": [moment(), moment()],
	};

	const handleApply = (newStartDate, newEndDate) => {
		setStartDate(newStartDate);
		setEndDate(newEndDate);
	};

	const [addEditData, setaddEditData] = useState({
		modal: false,
		account_id: "",
		username: "",
		player_id: "",
		type: "",
	});

	const [transferBalanceData, setTransferBalanceData] = useState({
		modal: false,
		transfer_amount: "",
		player_id: "",
		type: "",
		note: "",
		currency_id: "",
	});

	const [errorSatate, setErrorState] = useState({
		amountError: "",
	});

	const handleClosePlayer = () =>
		setaddEditData((prevState) => ({
			...prevState,
			modal: false,
			Type: "",
			client_id: "",
			allData: "",
		}));
	const OpenAddEditPlayerModal = (Type, player_id, allData) => {
		setaddEditData((prevState) => ({
			...prevState,
			modal: true,
			type: Type,
			player_id: Type > 0 ? player_id : "",
			username: Type > 0 ? allData.username : "",
			account_id: Type > 0 ? allData.account_id : "",
		}));
	};

	const CloseAddEditPlayerModal = () => {
		setaddEditData((prevState) => ({
			...prevState,
			modal: false,
			type: "",
			player_id: "",
			username: "",
			account_id: "",
		}));
	};
	const onChangeSomeState = (State) => {
		if (!!State) {
			setState((prevState) => ({
				...prevState,
				page: 1,
			}));
			PlayerListDetails();
		}
	};

	// useEffect(() => {
	//     AccontList()
	// }, [])

	const AccontList = () => {
		Service.apiPostCallRequest(RouteURL.clientAccountWiseCurrencyList, {}, token)
			.then((res) => {
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					setAccountList(res?.data);
					setState((prevState) => ({
						...prevState,
						account_id: res?.data[0]?._id,
					}));
				} else {
					toast.error(res.message, {
						position: "bottom-right",

					});
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message, {
					position: "bottom-right",
					
				});
			});
	};

	// const PlayerListDetails = () => {
	//     let params = JSON.stringify({
	//         "account_id": state.account_id,
	//         "filter": state.search,
	//         "start_date": moment(startDate).format('yyyy-MM-DD'),
	//         "end_date": moment(endDate).format('yyyy-MM-DD'),
	//         "status": state.status_id,
	//         "page": state.page,
	//         "limit": state.limit,
	//     })

	//     Service.apiPostCallRequest(RouteURL.allPlayerList, params, token)
	//         .then((res) => {
	//             if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
	//                 setState((prevState) => ({
	//                     ...prevState,
	//                     list: res?.data?.accounts,
	//                     currentPage: res?.data?.current_page,
	//                     totalPlayers: res?.data?.total_count,
	//                     totalPages: res?.data?.total_page,

	//                 }));
	//             } else {
	//                 toast.error(res.message, {
	//                     position: 'bottom-right',
	//                     closeOnClick: true,
	//                 });
	//             }
	//         })
	//         .catch((error) => {
	//             toast.error(error.response.data.message, {
	//                 position: 'bottom-right',
	//             });

	//         });
	// }

	const onCopy = React.useCallback((id) => {
		setState((prevState) => ({
			...prevState,
			copied: true,
			copyText: id,
		}));
	}, []);

	const IsConfirmed = (id, value, key) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You want to change status!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			cancelButtonText: "No",
			confirmButtonText: "Yes",
		}).then((result) => {
			if (result.isConfirmed) {
				statusChange(id, value, key);
			}
		});
	};
	const statusChange = (id, value, key) => {
		let params = JSON.stringify({
			player_id: id,
			status: value,
		});
		Service.apiPostCallRequest(RouteURL.updatePlayerStatus, params, token)
			.then((res) => {
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					let newFormValues = [...state.list];
					newFormValues[key]["status"] = value;
					setState((prevState) => ({
						...prevState,
						list: newFormValues,
					}));
					Swal.fire({
						text: res.message,
						icon: "success",
					});
				} else {
					Swal.fire({
						text: res.message,
						icon: "error",
					});
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message, {
					position: "bottom-right",
				
				});
			});
	};

	// page redirect
	const pageNavigate = (e, data, nav) => {
		let { alldata } = data;
		if (nav == "/player-list/transaction-summary") {
			navigate(nav);
			dispatch(PlayerDetails({ alldata }));
		}
	};

	const IsDeleteConfirmed = (e, player_id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You want to delete player!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			cancelButtonText: "No",
			confirmButtonText: "Yes",
		}).then((result) => {
			if (result.isConfirmed) {
				DeletePlayer(e, player_id);
			}
		});
	};

	const DeletePlayer = (e, player_id) => {
		setState((prevState) => ({
			...prevState,
			page: 1,
		}));
		let params = JSON.stringify({
			player_id: player_id,
		});
		Service.apiPostCallRequest(RouteURL.deletePlayer, params, token)
			.then((res) => {
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					Swal.fire({
						text: res.message,
						icon: "success",
					});
					PlayerListDetails();
				} else {
					Swal.fire({
						text: res.message,
						icon: "error",
					});
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message, {
					position: "bottom-right",
	
				});
			});
	};

	const OpenTransferBalanceModal = (e, player_id, currency_id) => {
		setTransferBalanceData((prevState) => ({
			...prevState,
			modal: true,
			player_id: player_id,
			transfer_amount: "",
			note: "",
			currency_id: currency_id,
		}));
	};

	const handleCloseTransferBlance = () =>
		setTransferBalanceData((prevState) => ({
			...prevState,
			modal: false,
			type: "",
			player_id: "",
			transfer_amount: "",
			note: "",
		}));

	const handleChangeTransferBalance = (e) => {
		const { id, value } = e.target;
		setTransferBalanceData((prevState) => ({
			...prevState,
			[id]: value.trimStart(),
		}));
	};

	/* Validate all fields */
	const handleTransferValidation = (e) => {
		let formIsValid = true;

		//account_id
		if (!transferBalanceData.transfer_amount) {
			formIsValid = false;
			setErrorState((prevState) => ({
				...prevState,
				amountError: "Amount can not be empty",
			}));
		} else
			setErrorState((prevState) => ({
				...prevState,
				amountError: "",
			}));

		if (
			!transferBalanceData.transfer_amount ||
			isNaN(transferBalanceData.transfer_amount) ||
			transferBalanceData.transfer_amount <= 0
		) {
			formIsValid = false;
			setErrorState((prevState) => ({
				...prevState,
				amountError: "Amount must be a positive number greater than 0.",
			}));
		} else if (transferBalanceData.transfer_amount < 500) {
			formIsValid = false;
			setErrorState((prevState) => ({
				...prevState,
				amountError: "Minimum amount is 500.",
			}));
		} else if (transferBalanceData.transfer_amount > 100000) {
			formIsValid = false;
			setErrorState((prevState) => ({
				...prevState,
				amountError: "Maximum amount is 100,000.",
			}));
		} else {
			setErrorState((prevState) => ({
				...prevState,
				amountError: "",
			}));
		}

		return formIsValid;
	};

	/* Validation Checking */
	const ValidateTransferBalanceForm = (e) => {
		e.preventDefault();
		if (handleTransferValidation()) {
			TransferBalance();
		}
	};

	const AccountWiseCurrencyList = () => {
		Service.apiPostCallRequest(RouteURL.clientAccountWiseCurrencyList, {}, token)
			.then((res) => {
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					let selectCurrency =
						res?.data[0].currency_code_id +
						"," +
						res?.data[0].currency_code +
						"," +
						res?.data[0].available_balance;
					dispatch(currencyWiseAmount(res?.data[0].available_balance));
					dispatch(SelectCurrency(selectCurrency));
				} else {
					toast.error(res.message, {
						position: "bottom-right",
						
					});
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message, {
					position: "bottom-right",
	
				});
			});
	};

	const TransferBalance = () => {
		let params = JSON.stringify({
			amount: transferBalanceData.transfer_amount,
			player_id: transferBalanceData.player_id,
			note: transferBalanceData.note,
		});
		Service.apiPostCallRequest(RouteURL.tranferPlayerBalance, params, token)
			.then((res) => {
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					toast.success(res.message, {
						position: "bottom-right",
						
					});
					AccountWiseCurrencyList();
					setTransferBalanceData((prevState) => ({
						...prevState,
						modal: false,
						amount: "",
						note: "",
						player_id: "",
					}));
					PlayerListDetails();
				} else {
					toast.error(res.message, {
						position: "bottom-right",
						
					});
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message, {
					position: "bottom-right",
				
				});
			});
	};
	// const pageDetailsNavigate = (e, nav, palyerId, account_id, from_page) => {
	//     navigate(nav);
	//     dispatch(PlayerDetails({ palyerId: palyerId, accountId: account_id, fromPage: from_page }))
	// }

	const exportToExcel = () => {
		// Gather all the transactions, including those from all loaded pages
		const allTransactions = state.list; // This already contains all loaded transactions from all pages

		// Format the data to include only the fields that are displayed in the table
		const formattedData = allTransactions.map((data) => ({
			"Player ID": data._id,
			"Ext. User ID": data.external_user_id,
			UserName: data.username,
			"Client Account ID": data.account_id || "-",
			Currency: data.currency_details.currency_code.toUpperCase(),
			Balance: data.available_balance,
			Status: data.status,
			"Last Log In": "-",
			"Reg. Date": moment(data.created_at).format("DD-MM-yyyy"),
		}));

		// Convert the formatted data to a worksheet
		const ws = XLSX.utils.json_to_sheet(formattedData);

		// Create a new workbook
		const wb = XLSX.utils.book_new();

		// Append the sheet to the workbook
		XLSX.utils.book_append_sheet(wb, ws, "Player_List");

		// Write the file and trigger download
		XLSX.writeFile(wb, "player_list.xlsx");
	};

	//!JYOTI
	const [playerFilter, setPlayerFilter] = useState({
		status: "active",
		search: "",
		kyc_status: false,
		page: 1,
		limit: 10,
		total: 10,
	});

	const [filterPLayerList, setFilterPlayerList] = useState([]);

	console.log(playerFilter, "FILTER PLAYER");
	const PlayerListDetails = () => {
		let params = JSON.stringify({
		
			search: playerFilter.search,

			status: playerFilter.status,
			page: playerFilter.page,
			limit: playerFilter.limit,
		});

		console.log(params, "params player list");

		Service.apiPostCallRequest(RouteURL.get_filter_player_list, params, token)
			.then((res) => {
				console.log(res, "filter Player List");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					setFilterPlayerList(res.data.players);
					setPlayerFilter((prev) => {
						return {
							...prev,

							total: res.data.totalPages,
						};
					});
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
		PlayerListDetails();
	}, [
		playerFilter.search,
	
		playerFilter.page,
		playerFilter.limit,
		playerFilter.status,
	]);

	function timeFormatter(iso) {
		const isoDate = iso;
		const date = new Date(isoDate);
		const humanReadable = date.toLocaleString("en-IN", {
			timeZone: "Asia/Kolkata",
			dateStyle: "medium",
			timeStyle: "short",
		});
		return humanReadable;
	}

	return (
		<div>
			<ToastContainer />
			<div className='card shadow-lg rounded'>
				<div className='card-body'>
					<CCardHeader className='d-flex justify-content-between align-items-center'>
						<h5>Player List</h5>
					</CCardHeader>
					{/* Header Row */}
					{/* <div className="d-flex justify-content-between align-items-center mb-3"> */}
					{/* <h3 className="hed_txt"></h3>
    <div className="d-flex gap-2">
     
      {filterPLayerList.length > 0 && (
        <button type="button" className="btn btn-success">
          Export to Excel
        </button>
      )}
     
    </div>
  </div> */}

					{/* Filter Inputs */}
					<div className='row mb-4'>
						<div className='col-md-3'>
							<label htmlFor='status_id' className='form-label'>
								Status
							</label>
							<select
								className='form-select'
								id='status_id'
								value={playerFilter.status}
								onChange={(e) => {
									setPlayerFilter((prev) => ({
										...prev,
										status: e.target.value,
									}));
								}}>
								<option value=''>Select Status</option>
								{MasterData.Status.map((item, key) => (
									<option
										key={key}
										value={item.value}
										// style={{ color: item.value === "active" ? "green" : "red" }}
									>
										{item.label}
									</option>
								))}
							</select>
						</div>

						<div className='col-md-4'>
							<label htmlFor='search' className='form-label'>
								Search
							</label>
							<CInputGroup>
								<CInputGroupText>
									<CIcon icon={cilSearch} />
								</CInputGroupText>
								<CFormInput
									type='text'
									placeholder='Search by Player'
									id='search'
									autoComplete='off'
									value={playerFilter.search}
									onChange={(e) => {
										setPlayerFilter((prev) => ({
											...prev,
											search: e.target.value,
										}));
									}}
								/>
							</CInputGroup>
						</div>
						<div className='col-md-5'>
							<label
								htmlFor='status_id'
								className='form-label'
								style={{
									visibility: "hidden",
								}}>
								.
							</label>
							<div
								className='input-group'
								style={{
									justifyContent: "flex-end",
								}}>
								{" "}
								{filterPLayerList.length > 0 && (
									<>
										{/* <CButton color="primary" size="sm">
  <CIcon icon={cilSpreadsheet} className="me-2" />
  Export
										</CButton> */}

										<AllInOneExportButton data={filterPLayerList} filename={"player-list"} />
									</>
								)}
							</div>
						</div>
					</div>

					{/* Player Table */}
					<div className='table-responsive'>
						<CTable hover bordered responsive>
							<CTableHead className='table-primary text-center align-middle'>
								<CTableRow>
									<CTableHeaderCell scope='col'>Player ID</CTableHeaderCell>
									<CTableHeaderCell scope='col'>Display Name</CTableHeaderCell>
									<CTableHeaderCell scope='col'>Name</CTableHeaderCell>
									<CTableHeaderCell scope='col'>Profile Picture</CTableHeaderCell>
									<CTableHeaderCell scope='col'>Mobile No</CTableHeaderCell>
									<CTableHeaderCell scope='col'>Status</CTableHeaderCell>
									<CTableHeaderCell scope='col'>Last Login</CTableHeaderCell>
								</CTableRow>
							</CTableHead>

							<CTableBody>
								{filterPLayerList.length > 0 ? (
									filterPLayerList.map((data, key) => (
										<CTableRow key={key}>
											<CTableDataCell className='text-center'>
												<span
													className='me-2'
													style={{ color: state.copyText !== data.player_id ? "" : "#1b9e3e" }}>
													{data.player_id}
												</span>
												<CopyToClipboard text={data.player_id} onCopy={() => onCopy(data.player_id)}>
													<a
														href='#'
														style={{ color: state.copyText !== data.player_id ? "" : "#1b9e3e" }}>
														<CTooltip content='Copy ID'>
															{state.copyText !== data.player_id ? (
																<i className='bi bi-copy' />
															) : (
																<i className='bi bi-check-lg' style={{ color: "#1b9e3e" }} />
															)}
														</CTooltip>
													</a>
												</CopyToClipboard>
											</CTableDataCell>

											<CTableDataCell
												style={{ color: "#5473ff", cursor: "pointer" }}
												onClick={() =>
													navigate("/player-list/player-details", {
														state: { playerId: data.player_id },
													})
												}>
												{data.player_display_name
}
											</CTableDataCell>

											<CTableDataCell>{data.player_name
}</CTableDataCell>
											<CTableDataCell style={{ textAlign: "center" }}>
												{" "}
												<img
													src={data?.player_profile_picture_url || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"}
													alt='Profile'
													style={{
														width: "25px",
														height: "25px",
													}}
													// className={styles.profilePicture}
												/>{" "}
											</CTableDataCell>
											<CTableDataCell>{data.player_mobile
}</CTableDataCell>
											<CTableDataCell>

												<CBadge color={data.player_status === 'active' ? 'success' : 'danger'}>
																	{data.player_status
 ? data.player_status
.charAt(0).toUpperCase() + data.player_status
.slice(1) : ""}
												</CBadge>
												
												
											</CTableDataCell>
											<CTableDataCell>{data.lastlogin_ist
}</CTableDataCell>
										</CTableRow>
									))
								) : (
									<CTableRow>
										<CTableDataCell colSpan={7} className='text-center'>
											No data found
										</CTableDataCell>
									</CTableRow>
								)}
							</CTableBody>
						</CTable>
					</div>

					{/* Pagination */}
					{filterPLayerList.length > 0 && (
						<div className='d-flex justify-content-center mt-4'>
							<Pagination
								page={playerFilter.page}
								totalPages={playerFilter.total}
								onPageChange={(newPage) =>
									setPlayerFilter((prev) => ({ ...prev, page: newPage }))
								}
							/>
						</div>
					)}
				</div>
			</div>

			<Modal
				backdrop='static'
				centered
				show={addEditData.modal}
				onHide={handleClosePlayer}>
				<div className='modal_form_main'>
					<Modal.Header closeButton>
						<h6 className='hed_txt'>{addEditData.type == 0 ? "Add " : "Edit "} Player</h6>
					</Modal.Header>
					<AddEditPlayerForm
						_allData={addEditData}
						onChangeSomeState={onChangeSomeState}
						CloseAddEditPlayerModal={CloseAddEditPlayerModal}
					/>
				</div>
			</Modal>

			<Modal
				backdrop='static'
				centered
				show={transferBalanceData.modal}
				onHide={handleCloseTransferBlance}>
				<div className='modal_form_main'>
					<Modal.Header closeButton>
						<h6 className='hed_txt'>Transfer Balance</h6>
					</Modal.Header>
					<div className='row' style={{ margin: 10 }}>
						<div className='modal_form'>
							<label>Amount</label>
							<CFormInput
								type='number'
								placeholder='Enter amount'
								id='transfer_amount'
								autoComplete='off'
								value={transferBalanceData?.transfer_amount}
								onChange={handleChangeTransferBalance}
							/>
							<span style={{ color: "red" }}>{errorSatate.amountError}</span>
							<div className='col-12'>
								<p style={{ color: "#7d6c6d", fontSize: "0.9rem" }}>
									* Min Amount is <strong>500</strong> and Max Amount is <strong>100,000</strong>
								</p>
							</div>
						</div>

						<div className='modal_form'>
							<label>Note</label>
							<CFormTextarea
								placeholder='Enter note'
								id='note'
								autoComplete='off'
								value={transferBalanceData?.note}
								rows={4}
								onChange={handleChangeTransferBalance}
							/>
						</div>

						<div className='modal_form'>
							<div className='row'>
								<div className='button_align col-12'>
									<CButton
										className='cancel'
										style={{ marginRight: 10 }}
										onClick={handleCloseTransferBlance}>
										Cancel
									</CButton>
									<CButton
										className='save'
										onClick={ValidateTransferBalanceForm}
										// disabled={isDisabled ? true : false}
									>
										Save
									</CButton>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
}
