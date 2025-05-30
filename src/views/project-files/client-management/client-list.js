
import React, { useState, useEffect, useRef } from "react";
import {
    CButton,
    CInputGroupText,
    CTooltip,
    CInputGroup, CFormInput, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
} from '@coreui/react'
import { Tree, Select, Dropdown, notification } from 'antd';
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'react-bootstrap';
import Service from "src/apis/Service.js";
import RouteURL from "src/apis/ApiURL.js";
import { Constants } from "src/apis/Constant.js";
import { ToastContainer, toast } from 'react-toastify';
import ChangePasswordForClientModal from "src/views/project-files/modal/changePasswordForClientModal.js";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { client, client_data_clear, account } from "src/redux/slices/superAdminStateSlice.js";
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import MasterData from 'src/Utility/MasterData';
import moment from 'moment';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Swal from "sweetalert2";


export default function ClientList() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const token = useSelector((state) => state.user.token);
    const [copyText, setCopyText] = useState(null);
    const [clientData, setClientData] = useState({
        list: [],
        search: '',
        limit: 10,
        page: 1,
        copied: false,
        currentPage: '',
        totalClients: '',
        totalPages: '',
        copyText: '',
        currentList: [],
        _status: '',
        labellist: [],
        level_id: '',
        regionlist: [],
        region_id: ''
    })

    const [clientModal, setClientModal] = useState({
        show: false,
        client_id: '',
        client_name: ''
    })

    const handleClose = () => setClientModal(prevState => ({
        ...prevState,
        show: false,
        client_id: ''
    }))

    useEffect(() => {
        LabelList();
        RegionList();
    }, [])

    useEffect(() => {
        ClientListDetails();
        dispatch(client_data_clear());
    }, [clientData.search, clientData.page, clientData.level_id, clientData.region_id])
    const ClientListDetails = () => {
        let params = JSON.stringify({
            "search": clientData.search,
            "limit": clientData.limit,
            "page": clientData.page,
            "level_id": clientData.level_id,
            "region_id": clientData.region_id
        })

        Service.apiPostCallRequest(RouteURL.clientList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    // if ((clientData.search || clientData.search == '')) {
                    setClientData((prevState) => ({
                        ...prevState,
                        list: res?.data?.clientUsers,
                        currentPage: res?.data?.current_page,
                        totalClients: res?.data?.total_count,
                        totalPages: res?.data?.total_page,

                    }));
                    // } if (clientData.page > 1) {
                    //     setClientData((prevState) => ({
                    //         ...prevState,
                    //         list: [...clientData.list, ...res?.data?.clientUsers],
                    //         currentPage: res?.data?.current_page,
                    //         totalClients: res?.data?.total_count,
                    //         totalPages: res?.data?.total_page,

                    //     }));
                    // }


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
    const LabelList = () => {
        Service.apiPostCallRequest(RouteURL.levelList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setClientData((prevState) => ({
                        ...prevState,
                        labellist: res?.data,
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
    const RegionList = () => {
        Service.apiPostCallRequest(RouteURL.regionList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setClientData((prevState) => ({
                        ...prevState,
                        regionlist: res?.data,
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

    const onCopy = React.useCallback((id) => {
        setClientData(prevState => ({
            ...prevState,
            copied: true,
            copyText: id
        }))
    }, [])

    const loadMoreData = () => {
        setClientData((prevState) => ({
            ...prevState,
            page: clientData.page + 1,
            pageAdd: true
        }));

    }
    useEffect(() => { }, [clientData.list]);

    // page redirect
    const pageNavigate = (e, data, nav) => {
        let { Type, alldata } = data;
        if (nav == '/client-list/client-update') {
            navigate(nav)
            dispatch(client({ Type, alldata }));
        } else if (nav == '/client-list/client-add') {
            navigate(nav)
            dispatch(client({ Type }));
        } else if (nav == '/client-account') {
            navigate(nav)
            dispatch(account({ alldata }));
        } else if (nav == '/client-list/client-account-list') {
            navigate(nav)
            dispatch(account({ alldata }));
        }
    }

    const handleCopy = (id) => {
        setCopyText(id);
        notification.success({
            message: 'ID Copied',
            description: 'Client ID has been copied to clipboard.',
        });
    };


    const formatedStatus = (node) => {
        return (
            <div style={{ color: node.data.status == 'active' ? 'green' : 'red' }}>
                {MasterData.Status.map((item, key) => node.data.status == item.value ? <label >{item.label}</label> : "")}
            </div>
        )
    }

    const formatedDate = (node) => {
        return (
            <div>
                {moment(node.data.created_at).format('YYYY-MM-DD')}
            </div>
        )
    }

    const IsConfirmed = (id, value) => {
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
                statusChange(id, value);
            }
        });
    };

    const statusChange = (id, value) => {
        let params = JSON.stringify({
            client_id: id,
            status: value,
        });

        Service.apiPostCallRequest(RouteURL.updateClientStatus, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setClientData((prevState) => ({
                        ...prevState,
                        toggle: !clientData.toggle,
                    }));
                    ClientListDetails()
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


    const actionTemplate = (node) => {
        return (
            <div>

                <CDropdown>
                    <CDropdownToggle color="secondary">Action</CDropdownToggle>
                    <CDropdownMenu >
                        {node.data.client_type == "own" &&
                            <CDropdownItem onClick={(e) =>
                                pageNavigate(
                                    e,
                                    { alldata: node.data, Type: 1 },
                                    "/client-list/client-update"
                                )
                            }>Update Client</CDropdownItem>
                        }

                        <CDropdownItem onClick={(e) =>
                            pageNavigate(
                                e,
                                { alldata: node.data, Type: 1 },
                                "/client-list/client-account-list"
                            )
                        }>Account List</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>


            </div>
        );
    };
    const statusDropdownTemplate = (node) => {
        return (
            <select
                className="form-select"
                value={node.data.status}
                onChange={(e) => IsConfirmed(node.data._id, e.target.value)}
                style={{
                    width: 120,
                    color: node.data.status == "active" ? "green" : "red",
                }}
            >
                <option value="active" style={{ color: "green", textAlign: "center" }}>Active</option>
                <option value="inactive" style={{ color: "red", textAlign: "center" }}>Inactive</option>

            </select>
        );
    };

    const copyClientCode = (node) => {
        return (
            <>
                <span
                    style={{
                        textDecoration: "none",
                        color:
                            clientData.copyText != node.data._id
                                ? ""
                                : "#1b9e3e",
                    }}
                >
                    {node.data._id.length > 8
                        ? node.data._id.substr(0, 8) + "..."
                        : node.data._id}
                    &nbsp;
                </span>
                <CopyToClipboard
                    text={node.data._id}
                    onCopy={() => onCopy(node.data._id)}
                >
                    <a
                        href="javascript:void(0)"
                        style={{
                            textDecoration: "none",
                            color:
                                clientData.copyText != node.data._id
                                    ? ""
                                    : "#1b9e3e",
                        }}
                    >
                        <CTooltip content={node.data._id}>
                            {clientData.copyText != node.data._id ? (
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
            </>
        );
    };



    return (
        <div >
            <ToastContainer />
            <div className="card shadow-lg rounded">
                <div className="card-body">
                    <h3 className="hed_txt pt-2">Client List</h3>

                    <div className="row" style={{ padding: "20px" }}>
                        <div className="col-sm-3">
                            <select
                                className="form-select"
                                onChange={(e) =>
                                    setClientData((prevState) => ({
                                        ...prevState,
                                        list: [],
                                        page: 1,
                                        region_id: e.target.value,
                                    }))
                                }
                                value={clientData.region_id}
                                style={{ width: "100%" }}
                            >
                                <option value="">Select Region</option>
                                {clientData.regionlist.map((item, key) => (
                                    <option value={item._id} key={key}>
                                        {item.region_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-3">
                            <select
                                className="form-select"
                                onChange={(e) =>
                                    setClientData((prevState) => ({
                                        ...prevState,
                                        list: [],
                                        page: 1, limit: 10,
                                        level_id: e.target.value,
                                    }))
                                }
                                value={clientData.level_id}
                            >
                                <option value="">Select Label</option>
                                {clientData.labellist.map((item, key) => (
                                    <option value={item._id} key={key}>
                                        {item.level_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <CInputGroup className="mb-3">
                                <CInputGroupText>
                                    <CIcon icon={cilSearch} />
                                </CInputGroupText>
                                <CFormInput
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Search Client by Client Code, Email, Username"

                                    id="search"
                                    value={clientData.search}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setClientData((prevState) => ({
                                            ...prevState,
                                            list: [],
                                            page: 1, limit: 10,
                                            search: e.target.value,
                                        }));
                                    }}
                                />
                            </CInputGroup>
                        </div>
                        <div className="col-sm-2 d-flex justify-content-center">
                            <CButton
                                color="primary"
                                onClick={(e) =>
                                    pageNavigate(e, { alldata: "", Type: 0 }, "/client-list/client-add")
                                }
                                style={{
                                    width: "150px",  // Set the fixed width
                                    height: "40px",  // Set the fixed height
                                    padding: "px",   // Optional: remove extra padding to align text properly
                                }}
                            >
                                Add Client
                            </CButton>
                        </div>
                    </div>

                    <div style={{ margin: 10 }}>
                        {/* Table Header */}
                        <div className="card">

                            <TreeTable value={clientData.list}
                                scrollable
                                // frozenWidth="300px"
                                // expandedKeys={expandedKeys}
                                // onToggle={(e) => setExpandedKeys(e.value)}
                                // className="mt-4"
                                // tableStyle={{ minWidth: '50rem' }}
                                scrollHeight="450px" >

                                <Column field="client_name" header="Client Name" expander
                                    style={{ width: '150px', textAlign: 'left' }}
                                ></Column>
                                <Column field="_id" header="Client Code" body={copyClientCode} style={{ width: '150px', textAlign: 'left' }}></Column>
                                <Column field="contact" header="Contact" style={{ width: '150px', textAlign: 'left' }}></Column>
                                <Column field="email" header="Email" style={{ width: '230px', textAlign: 'left' }}></Column>
                                <Column field="username" header="Username" style={{ width: '170px', textAlign: 'left' }}></Column>
                                {/* <Column field="status" header="Status" style={{ width: '150px' }} body={formatedStatus}></Column> */}
                                <Column
                                    field="status"
                                    body={statusDropdownTemplate}
                                    header="Status"
                                    style={{ width: "130px", textAlign: 'left' }}
                                />

                                <Column field="created_at" header="Registered Date" style={{ width: '150px', textAlign: 'left' }} body={formatedDate}></Column>
                                <Column body={actionTemplate} header="Action" headerClassName="w-10rem" style={{ width: '150px', textAlign: 'left' }} />

                            </TreeTable>
                        </div>
                    </div>

                    {/* <div className="row">
                        <div className="col-6">
                            <span className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => loadMoreData()}
                                    disabled={
                                        clientData.currentPage === clientData.totalPages
                                            ? true
                                            : false
                                    }
                                >
                                    Load More
                                </button>
                            </span>
                        </div>
                        <div className="col-6">
                            <span className="d-flex justify-content-end">
                                {clientData.currentPage + " / " + clientData.totalPages} Page Loaded
                            </span>
                        </div>
                    </div> */}

                    <div className="row" style={{ padding: "20px" }}>
                        {clientData.totalPages > 1 &&
                            <div className="col-12 d-flex justify-content-center">
                                {(() => {
                                    const maxPagesToShow = 5;
                                    const totalPages = clientData.totalPages;
                                    const currentPage = clientData.page;
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
                                                        setClientData((prevState) => ({ ...prevState, page }));
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
            </div>

            <Modal
                size="md"
                backdrop="static"
                centered
                show={clientModal.show}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{clientModal.client_name} Update Password</Modal.Title>
                </Modal.Header>
                <ChangePasswordForClientModal
                    allData={clientModal.client_id}
                    onclose={handleClose}
                />
            </Modal>
        </div>
    );
}