import React, { useState, useEffect, useRef } from "react";
import {
    CButton,
    CInputGroupText,
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


export default function ClientList() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const token = useSelector((state) => state.user.token);
    const { Option } = Select;
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

    // console.log(clientData);
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
    const handleShow = (e, data) => {
        e.preventDefault();
        // console.log(data);

        setClientModal(prevState => ({
            ...prevState,
            show: true,
            client_id: data._id,
            client_name: data.client_firstname + ' ' + data.client_lastname
        }))
        setClientData((prevState) => ({
            ...prevState,
            limit: 10,
            page: 1,

        }));
    }

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
                    if ((clientData.search || clientData.search == '')) {
                        setClientData((prevState) => ({
                            ...prevState,
                            list: res?.data?.clientUsers,
                            currentPage: res?.data?.current_page,
                            totalClients: res?.data?.total_count,
                            totalPages: res?.data?.total_page,

                        }));
                    } if (clientData.page > 1) {
                        setClientData((prevState) => ({
                            ...prevState,
                            list: [...clientData.list, ...res?.data?.clientUsers],
                            currentPage: res?.data?.current_page,
                            totalClients: res?.data?.total_count,
                            totalPages: res?.data?.total_page,

                        }));
                    }


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

    // console.log(clientData.copyText);

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
        if (nav == '/client-update') {
            navigate(nav)
            dispatch(client({ Type, alldata }));
        } else if (nav == '/client-add') {
            navigate(nav)
            dispatch(client({ Type }));
        } else if (nav == '/client-account') {
            navigate(nav)
            dispatch(account({ alldata }));
        } else if (nav == '/account-list') {
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
                                    "/client-update"
                                )
                            }>Update Client</CDropdownItem>
                        }

                        <CDropdownItem onClick={(e) =>
                            pageNavigate(
                                e,
                                { alldata: node.data, Type: 1 },
                                "/account-list"
                            )
                        }>Account List</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>


            </div>
        );
    };
    const [expandedKeys, setExpandedKeys] = useState(null);

    // const getSerialNumber = (node, rowIndex) => {
    //     console.log(rowIndex);

    //     // Customize this logic for dynamic serial number generation if needed.
    //     return rowIndex + 1;
    // };

    return (
        <div >
            <ToastContainer />
            <div className="card shadow-lg rounded">
                <div className="card-body">
                    <div className="row">
                        <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-5 col-sm-8 col-8">
                            <h3 className="hed_txt pt-2">Client List</h3>
                        </div>
                        <div className="col-xxl-7 col-xl-3 col-lg-3 col-md-4 d-none d-md-block">
                            <div className="row">
                                <div className="col-sm-3">
                                    <select
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setClientData((prevState) => ({
                                                ...prevState, list: [],
                                                region_id: e.target.value,
                                                page: 1, limit: 10
                                            }));
                                        }}
                                        id="region_id"
                                        value={clientData.region_id}
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
                                        aria-label="Default select example"
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setClientData((prevState) => ({
                                                ...prevState,
                                                list: [],
                                                level_id: e.target.value,
                                                page: 1, limit: 10
                                            }));
                                        }}
                                        id="level_id"
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
                                <div className="col-sm-6">
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilSearch} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Search Client by Client id, Email or Username"
                                            id="search"
                                            value={clientData.search}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                setClientData((prevState) => ({
                                                    ...prevState, search: e.target.value, page: 1, limit: 10
                                                }));
                                            }}
                                        />
                                    </CInputGroup>
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-3 col-sm-4 col-4 pl-0 text-end">
                            <div className="card-header-actions atten_sec flex-row-reverse">
                                <CButton
                                    color="primary"
                                    onClick={(e) =>
                                        pageNavigate(e, { alldata: "", Type: 0 }, "/client-add")
                                    }
                                >
                                    Add Client
                                </CButton>
                            </div>
                        </div>
                    </div>
                    <div style={{ margin: 10 }}>
                        {/* Table Header */}
                        <div className="card">

                            <TreeTable value={clientData.list}
                                scrollable
                                frozenWidth="300px"
                                expandedKeys={expandedKeys}
                                onToggle={(e) => setExpandedKeys(e.value)}
                                className="mt-4"
                                tableStyle={{ minWidth: '50rem' }}
                                scrollHeight="450px" >
                                {/* <Column
                                    header="S.No"
                                    body={(node, options) => getSerialNumber(node, options.rowIndex)}
                                    style={{ width: '5rem',height: '57px',width: '100px', }}
                                    // frozen 
                                /> */}
                                <Column field="client_name" header="Client Name" expander
                                    frozen
                                    style={{ width: '200px', height: '57px' }}
                                // filter filterPlaceholder="Filter by name"
                                ></Column>
                                <Column field="_id" header="Client Code" style={{ width: '300px', height: '57px' }}
                                    // filter filterPlaceholder="Filter by code"
                                    columnKey="size_0"></Column>
                                <Column field="contact" header="Contact" style={{ width: '300px', height: '57px' }}
                                    // filter filterPlaceholder="Filter by contact"
                                    columnKey="type_0"></Column>
                                <Column field="email" header="Email" style={{ width: '300px', height: '57px' }}
                                    // filter filterPlaceholder="Filter by email" 
                                    columnKey="size_1"></Column>
                                <Column field="username" header="Username" style={{ width: '300px', height: '57px' }}
                                    // filter filterPlaceholder="Filter by username"
                                    columnKey="type_1"></Column>
                                <Column field="status" header="Status" style={{ width: '300px', height: '57px' }}
                                    // filter filterPlaceholder="Filter by status"
                                    columnKey="size_2" body={formatedStatus}></Column>


                                <Column field="created_at" header="Registered Date" style={{ width: '300px', height: '57px' }} body={formatedDate}></Column>
                                <Column body={actionTemplate} header="Action" headerClassName="w-10rem" style={{ width: '300px', height: '57px' }} columnKey="size_2" />

                            </TreeTable>
                        </div>
                    </div>

                    <div className="row">
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