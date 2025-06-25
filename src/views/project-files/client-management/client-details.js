import React, { useState, useEffect } from "react";
import {
    CButton,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CTooltip,
    CLink,
} from "@coreui/react";
import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate, Link } from "react-router-dom";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from "react-toastify";
import { leftTrim } from "../../../Utility/helper";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import AddClientAccount from "./addAccount";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
    clientAccountTransferBalanceDetails,
    clientAccountDetails,
} from "../../../redux/slices/superAdminStateSlice";
import Swal from "sweetalert2";

export default function ClientDetailsPage(props) {
    const token = useSelector((state) => state.user.token);
    let navigate = useNavigate();
    const dispatch = useDispatch();

    //Define states
    const [_state, setState] = useState({
        client_id: props?.clientData,
        client_name: props?.client_name,
        list: [],
        search: "",
        limit: 10,
        page: 1,
        copied: false,
        currentPage: "",
        totalAccounts: "",
        totalPages: "",
        copyText: "",
        pageAdd: "",
        regionlist: [],
        region_id: "",
    });
    const [status, setStatus] = useState([
        { lable: "Active", value: "active" },
        { lable: "Inactive", value: "inactive" },
        // { lable: "Block", value: "blocked" },
    ]);
    const [clientAccountModal, setClientAccountModal] = useState({
        show: false,
        client_id: "",
        accountDetails: "",
        type: ''
    });

    useEffect(() => {
        RegionList();
    }, []);

    useEffect(() => {
        AccountListDetails();
    }, [_state.search, _state.page, _state.region_id]);
    const AccountListDetails = () => {
        let params = JSON.stringify({
            client_id: _state.client_id,
            filter: _state.search,
            limit: _state.limit,
            page: _state.page,
            region_id: _state.region_id,
        });

        Service.apiPostCallRequest(RouteURL.clientAccountsList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    // if (_state.pageAdd == "") {
                    setState((prevState) => ({
                        ...prevState,
                        list: res?.data?.accounts,
                        currentPage: res?.data?.current_page,
                        totalAccounts: res?.data?.total_count,
                        totalPages: res?.data?.total_page,
                        pageAdd: "",
                    }));
                    // } else {
                    //     setState((prevState) => ({
                    //         ...prevState,
                    //         list: [..._state.list, ...res?.data?.accounts],
                    //         currentPage: res?.data?.current_page,
                    //         totalAccounts: res?.data?.total_count,
                    //         totalPages: res?.data?.total_page,
                    //     }));
                    // }
                } else {
                    toast.error(res.message, {
                        position: "bottom-right",
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };
    const RegionList = () => {
        Service.apiPostCallRequest(RouteURL.regionList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        regionlist: res?.data,
                    }));
                } else {
                    toast.error(res.message, {
                        position: "bottom-right",
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };

    const handleClose = () => {
        setClientAccountModal((prevState) => ({
            ...prevState,
            show: false,
            client_id: "",
        }));
        setState((prevState) => ({
            ...prevState,
            pageAdd: "",
        }));
        AccountListDetails();
    };
    const addEditAccount = (e, data, type) => {
        e.preventDefault();
        setClientAccountModal((prevState) => ({
            ...prevState,
            show: true,
            client_id: props?.clientData,
            accountDetails: data,
            type: type
        }));
        setState((prevState) => ({
            ...prevState,
            pageAdd: "",
            limit: 10,
            page: 1,
        }));
    };

    const onCopy = React.useCallback((id) => {
        setState((prevState) => ({
            ...prevState,
            copied: true,
            copyText: id,
        }));
    }, []);

    const loadMoreData = () => {
        setState((prevState) => ({
            ...prevState,
            page: _state.page + 1,
            pageAdd: true,
        }));
    };
    const IsConfirmed = (id, value, key) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to change status!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                statusChangeForClientAccount(id, value, key);
            }
        });
    };
    const statusChangeForClientAccount = (id, value, key) => {
        let params = JSON.stringify({
            account_id: id,
            status: value,
        });
        Service.apiPostCallRequest(RouteURL.updateAccountStatus, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let newFormValues = [..._state.list];
                    newFormValues[key]["status"] = value;
                    setState((prevState) => ({
                        ...prevState,
                        list: newFormValues,
                    }));
                    // AccountListDetails()
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
                    autoClose: false,
                });
            });
    };

    const pageNavigate = (
        e,
        nav,
        accountId,
        accountCurrency,
        available_balance,
        account_name,
        clientName,
        clientID
    ) => {
        if (nav == "/client-list/client-transfer-balance") {
            navigate(nav);
            dispatch(
                clientAccountTransferBalanceDetails({
                    accountCurrency,
                    accountId,
                    available_balance,
                    account_name,
                    clientName,
                })
            );
        } else if (nav == "/client-list/client-manage-account") {
            navigate(nav);
            dispatch(clientAccountDetails({ clientID, accountId }));
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="card shadow-lg rounded">
                {/* <Breadcrumbs/> */}
                <div className="card-body">
                    <div className="row" style={{ padding: "20px" }}>
                        <div className="col-sm-6">
                            <CInputGroup className="mb-3">
                                <CInputGroupText>
                                    <CIcon icon={cilSearch} />
                                </CInputGroupText>
                                <CFormInput
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Search by Account Name, Account Id"
                                    id="search"
                                    value={_state.search}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setState((prevState) => ({
                                            ...prevState,
                                            search: e.target.value, page: 1, limit: 10
                                        }));
                                    }}
                                />
                            </CInputGroup>
                        </div>
                        <div className="col-sm-4">
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                onChange={(e) => {
                                    e.preventDefault();
                                    setState((prevState) => ({
                                        ...prevState,
                                        region_id: e.target.value, page: 1, limit: 10
                                    }));
                                }}
                                id="region_id"
                                value={_state.region_id}
                            >
                                <option value="">Select Region</option>
                                {_state.regionlist.map((item, key) => (
                                    <option value={item._id} key={key}>
                                        {item.region_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-sm-2 d-flex justify-content-center">
                            <CButton onClick={(e) => { addEditAccount(e, {}, 'add') }}
                                style={{
                                    width: "150px",  // Set the fixed width
                                    height: "40px",  // Set the fixed height
                                    padding: "px",   // Optional: remove extra padding to align text properly
                                }}
                                color="primary">Add Account</CButton>
                        </div>
                    </div>

                    <div style={{ margin: 10 }}>
                        <table className="table table-hover">
                            <thead className="table-primary">
                                <tr>
                                    <th>Action</th>
                                    <th scope="col">Account Name</th>
                                    <th scope="col">Account Id</th>
                                    <th scope="col">Currency</th>
                                    <th scope="col">Region</th>

                                    <th scope="col">Status</th>
                                    <th scope="col">Credit Limit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {_state.list.length > 0 ? (
                                    _state.list.map((data, key) => (
                                        <tr key={key}>
                                            <td >
                                                <CDropdown>
                                                    <CDropdownToggle color="secondary">
                                                        Action
                                                    </CDropdownToggle>
                                                    <CDropdownMenu>
                                                        <CDropdownItem
                                                            onClick={(e) => { addEditAccount(e, data, 'edit') }}
                                                        >
                                                            Edit Account
                                                        </CDropdownItem>

                                                        <CDropdownItem
                                                            onClick={(e) =>
                                                                pageNavigate(
                                                                    e,
                                                                    "/client-list/client-manage-account",
                                                                    data._id,
                                                                    "",
                                                                    "",
                                                                    "",
                                                                    "",
                                                                    _state.client_id
                                                                )
                                                            }
                                                        >
                                                            Manage Account
                                                        </CDropdownItem>
                                                        <CDropdownItem
                                                            onClick={(e) =>
                                                                pageNavigate(
                                                                    e,
                                                                    "/client-list/client-transfer-balance",
                                                                    data._id,
                                                                    data.currency_code,
                                                                    data.available_balance,
                                                                    data.account_name,
                                                                    _state.client_name
                                                                )
                                                            }
                                                        >
                                                            Transfer Balance
                                                        </CDropdownItem>
                                                    </CDropdownMenu>
                                                </CDropdown>
                                            </td>
                                            <td style={{ textAlign: "left" }}>
                                                <span
                                                >
                                                    {data.account_name}
                                                </span>
                                            </td>

                                            <td scope="row" style={{ textAlign: "left" }}>
                                                <span
                                                    style={{
                                                        textDecoration: "none",
                                                        color:
                                                            _state.copyText != data._id
                                                                ? ""
                                                                : "#1b9e3e",
                                                    }}
                                                >
                                                    {data._id.length > 8
                                                        ? data._id.substr(0, 8) + "..."
                                                        : data._id}
                                                    &nbsp;
                                                </span>
                                                <CopyToClipboard
                                                    text={data._id}
                                                    onCopy={() => onCopy(data._id)}
                                                >
                                                    <a
                                                        href="javascript:void(0)"
                                                        style={{
                                                            textDecoration: "none",
                                                            color:
                                                                _state.copyText != data._id
                                                                    ? ""
                                                                    : "#1b9e3e",
                                                        }}
                                                        key={key}
                                                    >
                                                        <CTooltip content={data._id}>
                                                            {_state.copyText != data._id ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="currentColor"
                                                                    className="bi bi-copy"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        fillFule="evenodd"
                                                                        d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="currentColor"
                                                                    className="bi bi-check-lg"
                                                                    viewBox="0 0 16 16"
                                                                    color="#1b9e3e"
                                                                >
                                                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                                </svg>
                                                            )}
                                                        </CTooltip>
                                                    </a>
                                                </CopyToClipboard>
                                            </td>
                                            <td style={{ textAlign: "left" }}>
                                                <span
                                                    className="badge badge-secondary"
                                                    style={{ background: "#6b77856b" }}
                                                >
                                                    {data.currency_code.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "left" }}>
                                                {data.region_name}
                                            </td>

                                            <td style={{ textAlign: "left", verticalAlign: "middle" }}>
                                                {" "}
                                                <select
                                                    className="form-select form-select-sm"
                                                    aria-label="Default select example"
                                                    value={data.status}
                                                    style={{
                                                        color: data.status === "active" ? "green" : "red",
                                                        fontSize: "15px",
                                                        padding: "2px 5px",
                                                        height: "25px",
                                                        lineHeight: "1.2",
                                                        width: "90px",
                                                        maxWidth: "100px",
                                                        display: "inline-block"
                                                    }}
                                                    onChange={(e) =>
                                                        IsConfirmed(data._id, e.target.value, key)
                                                    }
                                                >
                                                    <option disabled>Select Status</option>
                                                    {status.map((item, key) => (
                                                        <option
                                                            value={item.value}
                                                            key={key}
                                                            style={{
                                                                color: item.value == "active" ? "green" : "red",
                                                            }}
                                                        >
                                                            {item.lable}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={{ textAlign: "left" }}>
                                                {Number(data.available_balance) == 0
                                                    ? 0.0
                                                    : data.available_balance}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr style={{ textAlign: "center" }}>
                                        <td colSpan="7">No data found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* <div className="row">
                        <div className="col-6 ">
                            <span className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => loadMoreData()}
                                    disabled={
                                        _state.list.length == _state.totalAccounts ? true : false
                                    }
                                >
                                    {" "}
                                    Load More
                                </button>
                            </span>
                        </div>
                        <div className="col-6">
                            <span className="d-flex justify-content-end ">
                                {_state.list.length + " / " + _state.totalAccounts} Account
                                Loaded
                            </span>
                        </div>
                    </div> */}

                    <div className="row">
                        {_state.totalPages > 1 &&
                            <div className="col-12 d-flex justify-content-center">
                                {(() => {
                                    const maxPagesToShow = 5;
                                    const totalPages = _state.totalPages;
                                    const currentPage = _state.page;
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
                                                        setState((prevState) => ({ ...prevState, page }));
                                                    }
                                                }}
                                            >
                                                {page}
                                            </button>
                                        )
                                    );
                                })()}
                            </div>
                        }
                    </div>


                </div>
                <Modal
                    size="md"
                    backdrop="static"
                    centered
                    show={clientAccountModal.show}
                    onHide={handleClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{clientAccountModal.type == "add" ? "Add " : "Edit "} Account</Modal.Title>
                    </Modal.Header>
                    <AddClientAccount
                        allData={clientAccountModal}
                        onclose={handleClose}
                    />
                </Modal>
            </div>
        </>
    );
}
