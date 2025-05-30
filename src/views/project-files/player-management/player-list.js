
/**
 * @file_purpose  page for showing player list
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
 */
import React, { useState, useEffect, useRef } from "react";
import {
    CButton,
    CInputGroupText,
    CInputGroup, CFormInput, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, 
    CFormTextarea
} from '@coreui/react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTooltip
} from '@coreui/react'
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'react-bootstrap';
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SelectCurrency, currencyWiseAmount, PlayerDetails } from "../../../redux/slices/superAdminStateSlice";
import MasterData from "../../../Utility/MasterData";
import Swal from 'sweetalert2';
import moment from 'moment';
import AddEditPlayerForm from "./addEditPlayerForm";
import * as XLSX from "xlsx";
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'
import Pagination from '../../../components/Pagination'
export default function PlayerList() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const token = useSelector((state) => state.user.token);
    const [accountList, setAccountList] = useState([]);
    const [startDate, setStartDate] = useState(moment().subtract(1, "days"));
    const [endDate, setEndDate] = useState(moment());
    const [state, setState] = useState({
        list: [],
        search: '',
        limit: 10,
        page: 1,
        copied: false,
        currentPage: '',
        totalPlayers: '',
        totalPages: '',
        copyText: '',
        currentList: [],
        _status: false,
        account_id: '',
        status_id: 'active'
    })

    function balanceRefactor(b) {
        return b / 100
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
        player_id: '',
        type: ""
    });

    const [transferBalanceData, setTransferBalanceData] = useState({
        modal: false,
        transfer_amount: "",
        player_id: '',
        type: "",
        note: "",
        currency_id: ''
    });

    const [errorSatate, setErrorState] = useState({
        amountError: '',
    })

    const handleClosePlayer = () => setaddEditData((prevState) => ({ ...prevState, modal: false, Type: "", client_id: "", allData: "" }));
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
            type: '',
            player_id: "",
            username: "",
            account_id: "",
        }));

    };
    const onChangeSomeState = (State) => {
        if (!!State) {
            setState((prevState) => ({
                ...prevState,
                page: 1

            }));
            PlayerListDetails()
        }
    };

    // useEffect(() => {
    //     AccontList()
    // }, [])

    
    const AccontList = () => {
        Service.apiPostCallRequest(RouteURL.clientAccountWiseCurrencyList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setAccountList(res?.data)
                    setState((prevState) => ({
                        ...prevState,
                        account_id: res?.data[0]?._id

                    }));
                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });

            });
    }

    
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
        setState(prevState => ({
            ...prevState,
            copied: true,
            copyText: id
        }))
    }, [])


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
                statusChange(id, value, key)
            }
        });

    }
    const statusChange = (id, value, key) => {
        let params = JSON.stringify({
            "player_id": id,
            "status": value
        })
        Service.apiPostCallRequest(RouteURL.updatePlayerStatus, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let newFormValues = [...state.list];
                    newFormValues[key]['status'] = value;
                    setState(prevState => ({
                        ...prevState,
                        list: newFormValues,
                    }))
                    Swal.fire({
                        text: res.message,
                        icon: "success"
                    });


                } else {
                    Swal.fire({
                        text: res.message,
                        icon: "error"
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });

            });
    }



    // page redirect
    const pageNavigate = (e, data, nav) => {
        let { alldata } = data;
        if (nav == '/player-list/transaction-summary') {
            navigate(nav)
            dispatch(PlayerDetails({ alldata }));
        }
    }


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
                DeletePlayer(e, player_id)
            }
        });

    }

    const DeletePlayer = (e, player_id) => {
        setState((prevState) => ({
            ...prevState,
            page: 1

        }));
        let params = JSON.stringify({
            "player_id": player_id,
        })
        Service.apiPostCallRequest(RouteURL.deletePlayer, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    Swal.fire({
                        text: res.message,
                        icon: "success"
                    });
                    PlayerListDetails()

                } else {
                    Swal.fire({
                        text: res.message,
                        icon: "error"
                    });

                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });
            });

    }

    const OpenTransferBalanceModal = (e, player_id, currency_id) => {
        setTransferBalanceData((prevState) => ({
            ...prevState,
            modal: true,
            player_id: player_id,
            transfer_amount: "",
            note: "",
            currency_id: currency_id
        }));

    };

    const handleCloseTransferBlance = () => setTransferBalanceData((prevState) => ({ ...prevState, modal: false, type: "", player_id: "", transfer_amount: "", note: "" }));


    const handleChangeTransferBalance = (e) => {
        const { id, value } = e.target
        setTransferBalanceData(prevState => ({
            ...prevState,
            [id]: value.trimStart()
        }))
    }

    /* Validate all fields */
    const handleTransferValidation = (e) => {
        let formIsValid = true;

        //account_id
        if (!transferBalanceData.transfer_amount) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                amountError: 'Amount can not be empty',
            }));
        } else setErrorState((prevState) => ({
            ...prevState,
            amountError: '',
        }));

        if (!transferBalanceData.transfer_amount || isNaN(transferBalanceData.transfer_amount) || transferBalanceData.transfer_amount <= 0) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                amountError: 'Amount must be a positive number greater than 0.',
            }));

        } else if (transferBalanceData.transfer_amount < 500) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                amountError: 'Minimum amount is 500.',
            }));

        } else if (transferBalanceData.transfer_amount > 100000) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                amountError: 'Maximum amount is 100,000.',
            }));

        } else {
            setErrorState((prevState) => ({
                ...prevState,
                amountError: '',
            }));
        }


        return formIsValid;
    }

    /* Validation Checking */
    const ValidateTransferBalanceForm = (e) => {
        e.preventDefault();
        if (handleTransferValidation()) {
            TransferBalance();
        }
    }

  
    const AccountWiseCurrencyList = () => {

        Service.apiPostCallRequest(RouteURL.clientAccountWiseCurrencyList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let selectCurrency = res?.data[0].currency_code_id + ',' + res?.data[0].currency_code + ',' + res?.data[0].available_balance;
                    dispatch(currencyWiseAmount(res?.data[0].available_balance));
                    dispatch(SelectCurrency(selectCurrency));
                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });
            });
    }

    const TransferBalance = () => {
        let params = JSON.stringify({
            "amount": transferBalanceData.transfer_amount,
            "player_id": transferBalanceData.player_id,
            "note": transferBalanceData.note
        })
        Service.apiPostCallRequest(RouteURL.tranferPlayerBalance, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    toast.success(res.message, {
                        position: 'bottom-right',
                        closeOnClick: true,
                    });
                    AccountWiseCurrencyList()
                    setTransferBalanceData((prevState) => ({ ...prevState, modal: false, amount: '', note: '', player_id: '' }

                    ))
                    PlayerListDetails()

                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        closeOnClick: true,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });

            });

    }
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
            "UserName": data.username,
            "Client Account ID": data.account_id || "-",
            "Currency": data.currency_details.currency_code.toUpperCase(),
            "Balance": data.available_balance,
            "Status": data.status,
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
        status: 'active',
        search: '',
        kyc_status: false,
        page: 1,
        limit: 10,
        total: 10
    })

    const [filterPLayerList, setFilterPlayerList] = useState([])
   
console.log(playerFilter, "FILTER PLAYER")
    const PlayerListDetails = () => {
          
        let params = JSON.stringify({
           "kyc_status": playerFilter.kyc_status,
            "search": playerFilter.search,

            "status": playerFilter.status,
            "page": playerFilter.page,
            "limit": playerFilter.limit,
            
        })

        console.log(params, "params")

        Service.apiPostCallRequest(RouteURL.get_filter_player_list, params, token)
            .then((res) => {

                console.log(res, "filter Player List")
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setFilterPlayerList(res.data.players)
                    setPlayerFilter((prev) => {
                        return {
                            ...prev,
                             
        total: res.data.totalPages
                        }
                    })
                    
                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        closeOnClick: true,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                });

            });
    }

    useEffect(() => {
        PlayerListDetails();
        console.log("FUNCTIONA LLLL")
    }, [playerFilter.search, playerFilter.kyc_status, playerFilter.page, playerFilter.limit, playerFilter.status])

    function timeFormatter(iso) {
        const isoDate = iso;
const date = new Date(isoDate);
const humanReadable = date.toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short"
});
        return humanReadable;

    }

    return (<div >
        <ToastContainer />
        <div className='card shadow-lg rounded' >
            <div className='card-body'>
                <div className="row pt-2">
                    <div className="col-sm-4">
                        <h3 className="hed_txt ">Player List</h3>
                    </div>
                    <div className="col-sm-4">
                    </div>
                    <div className="col-sm-4">
                        <div className="row" >
                            <div className="col-sm-6">
                                <div className="card-header-actions job_export text-end">
                                    {/* {state.list.length > 0 ? (

                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={exportToExcel}
                                            style={{ color: "#fff" }}
                                        >
                                            Export to Excel
                                        </button>
                                    ) : (
                                        ""
                                    )} */}
                                </div>

                            </div>
                            <div className="col-sm-6">
                                <div className="card-header-actions atten_sec">
                                    {/* <CButton color="primary"
                                        style={{
                                            width: "150px",  // Set the fixed width
                                            height: "40px",  // Set the fixed height
                                            padding: "px",   // Optional: remove extra padding to align text properly
                                        }}
                                        onClick={(e) => OpenAddEditPlayerModal(0, "", "")} >Add Player</CButton> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row" style={{ padding: "20px" }}>
                    {/* <div className="col-sm-3">
                        <label>Account</label>
                        <select className="form-select mb-1" id="account_id" onChange={(e) => {
                            e.preventDefault();
                            setState((prevState) => ({
                                ...prevState, account_id: e.target.value, page: 1, limit: 10
                            }));
                        }}
                            value={state.account_id}
                        >
                            <option value="">Select Account</option>
                            {accountList.length > 0 && accountList.map((list, key) => (
                                <option value={list._id} key={key} >{list.account_name}</option>
                            ))}
                        </select>
                    </div> */}

                    {/* <div className="col-sm-3">
                        <label>Date</label>
                        <DateTimeRangeContainer
                            ranges={predefinedRanges}
                            start={startDate}
                            end={endDate}
                            local={{
                                format: "DD-MM-YYYY",
                                sundayFirst: false,
                            }}
                            applyCallback={handleApply}
                        >
                            <FormControl
                                type="text"
                                // value={`${startDate.format("DD-MM-YYYY HH:mm")} - ${endDate.format("DD-MM-YYYY HH:mm")}`}
                                value={`${startDate.format("DD-MM-YYYY")} - ${endDate.format("DD-MM-YYYY")}`}
                                readOnly
                                className="date-time-input"
                            />
                        </DateTimeRangeContainer>
                    </div> */}
                    <div className="col-sm-3">
                        <label>Status</label>
                        <select className="form-select mb-1" id="status_id" onChange={(e) => {
                            e.preventDefault();
                            // setState((prevState) => ({
                            //     ...prevState, status_id: e.target.value,
                            // }));
                            setPlayerFilter((prevState) => {
                                return {
                                    ...prevState,
                                    status: e.target.value
                                }
                            })
                        }}
                            value={playerFilter.status}
                        >
                            <option value="">Select Status</option>
                            {MasterData.Status.map((item, key) => (
                                <option
                                    value={item.value}
                                    key={key}
                                    style={{
                                        color: item.value == "active" ? "green" : "red",
                                    }}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-sm-3 mt-4">
                        <CInputGroup className="mb-3">
                            <CInputGroupText>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                            <CFormInput type="text" autoComplete="off" placeholder="Search by Player" id="search" value={playerFilter.search} onChange={(e) => {
                                e.preventDefault();
                                setPlayerFilter((prevState) => ({
                                    ...prevState, search: e.target.value,
                                   
                                }));
                            }} />
                        </CInputGroup>
                    </div>

                </div>

                <div style={{ margin: 10 }}>

    <div className="table-responsive">
      <CTable hover bordered responsive>
        <CTableHead className="table-primary text-center align-middle">
          <CTableRow>
            <CTableHeaderCell scope="col">Player ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Display Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Profile Picture</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobile No</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Last Login</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {filterPLayerList.length > 0 ? filterPLayerList.map((data, key) => (
            <CTableRow key={key}>
              {/* Player ID with copy */}
              <CTableDataCell className="text-center">
                <span className="me-2" style={{ color: state.copyText !== data.player_id ? '' : '#1b9e3e' }}>
                  {data.player_id}
                </span>
                <CopyToClipboard text={data.player_id} onCopy={() => onCopy(data.player_id)}>
                  <a href="#" style={{ color: state.copyText !== data.player_id ? '' : '#1b9e3e' }}>
                    <CTooltip content="Copy ID">
                      {state.copyText !== data.player_id ? (
                        <i className="bi bi-copy" />
                      ) : (
                        <i className="bi bi-check-lg" style={{ color: '#1b9e3e' }} />
                      )}
                    </CTooltip>
                  </a>
                </CopyToClipboard>
              </CTableDataCell>

              {/* Display Name with navigation */}
              <CTableDataCell
                style={{ color: '#5473ff', cursor: 'pointer' }}
                onClick={() =>
                  navigate('/player-list/player-details', {
                    state: { playerId: data.player_id }
                  })
                }
              >
                {data.display_name}
              </CTableDataCell>

              <CTableDataCell>{data.name}</CTableDataCell>
              <CTableDataCell>{'profile'}</CTableDataCell>
              <CTableDataCell>{data.mobile_no}</CTableDataCell>
              <CTableDataCell>{data.status}</CTableDataCell>
              <CTableDataCell>{timeFormatter(data.last_login_timestamp)}</CTableDataCell>
            </CTableRow>
          )) : (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center">No data found</CTableDataCell>
            </CTableRow>
          )}
                            </CTableBody>
                            
                        </CTable>
                        
    </div>
  

                </div>
                <div className="row" style={{ padding: "20px" }}>
                    {/* {playerFilter.total > 1 &&
                        <div className="col-12 d-flex justify-content-center">
                            {(() => {
                                const maxPagesToShow = 5;
                                const totalPages = playerFilter.total;
                                const currentPage = playerFilter.page;
                                let pages = [];

                                let startPage = Math.max(
                                    1,
                                    currentPage - Math.floor(maxPagesToShow / 2)
                                );
                                let endPage = Math.min(
                                    totalPages,
                                    startPage + maxPagesToShow - 1
                                );

                                if (endPage - startPage < maxPagesToShow - 1) {
                                    startPage = Math.max(1, endPage - maxPagesToShow + 1);
                                }

                                if (startPage > 1) {
                                    pages.push(1); // Always show the first page
                                }
                                if (startPage > 2) {
                                    pages.push("prev-ellipsis"); // Ellipsis before skipped pages
                                }

                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(i);
                                }

                                if (endPage < totalPages - 1) {
                                    pages.push("next-ellipsis"); // Ellipsis after skipped pages
                                }
                                if (endPage < totalPages) {
                                    pages.push(totalPages); // Always show the last page
                                }

                                return pages.map((page, index) =>
                                    typeof page === "string" ? (
                                        <span key={page} className="mx-2">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={`page-${page}`} // Unique key to prevent duplicate rendering
                                            className={`btn mx-1 ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                                            onClick={() => {
                                                if (currentPage !== page) {
                                                    setPlayerFilter((prev) => {
                                                        return {
                                                            ...prev,
                                                            page
                                                       }
                                                   })
                                                }
                                            }}
                                        >
                                            {page}
                                        </button>
                                    )
                                );
                            })()}
                        </div>
                    } */}
                    {
                        filterPLayerList.length > 0 ?    <Pagination
                     page={playerFilter.page}
  totalPages={playerFilter.total}
                        onPageChange={(newPage) => {
                            setPlayerFilter((prev) => {
                                return {
                                    ...prev,
                                    page: newPage
          }
      })
  }
  }/> : <></>
                    }
                 
                </div>
            </div>
        </div>

        <Modal backdrop="static" centered show={addEditData.modal} onHide={handleClosePlayer}>
            <div className="modal_form_main">
                <Modal.Header closeButton>
                    <h6 className="hed_txt">{addEditData.type == 0 ? "Add " : "Edit "} Player</h6>
                </Modal.Header>
                <AddEditPlayerForm
                    _allData={addEditData}
                    onChangeSomeState={onChangeSomeState}
                    CloseAddEditPlayerModal={CloseAddEditPlayerModal}
                />
            </div>

        </Modal>

        <Modal backdrop="static" centered show={transferBalanceData.modal} onHide={handleCloseTransferBlance}>
            <div className="modal_form_main">
                <Modal.Header closeButton>
                    <h6 className="hed_txt">Transfer Balance</h6>
                </Modal.Header>
                <div className="row" style={{ margin: 10 }}>

                    <div className='modal_form'>
                        <label>Amount</label>
                        <CFormInput type="number" placeholder="Enter amount" id="transfer_amount" autoComplete="off"
                            value={transferBalanceData?.transfer_amount}
                            onChange={handleChangeTransferBalance}
                        />
                        <span style={{ color: "red" }}>{errorSatate.amountError}</span>
                        <div className="col-12">
                            <p style={{ color: "#7d6c6d", fontSize: "0.9rem" }}>
                                * Min Amount is <strong>500</strong> and Max Amount is <strong>100,000</strong>
                            </p>
                        </div>
                    </div>

                    <div className='modal_form'>
                        <label>Note</label>
                        <CFormTextarea placeholder="Enter note" id="note" autoComplete="off"
                            value={transferBalanceData?.note}
                            rows={4}
                            onChange={handleChangeTransferBalance}
                        />

                    </div>

                    <div className="modal_form">
                        <div className="row">
                            <div className="button_align col-12">
                                <CButton
                                    className="cancel"
                                    style={{ marginRight: 10 }}
                                    onClick={handleCloseTransferBlance}

                                >
                                    Cancel
                                </CButton>
                                <CButton
                                    className="save"
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
    </div>)
}