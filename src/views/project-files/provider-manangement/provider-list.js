
import React, { useState, useEffect, useRef } from "react";
import {
    CButton,
    CTooltip,
    CCol,
    CRow, CDropdown, CDropdownMenu, CDropdownItem, CDropdownToggle
} from '@coreui/react'
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'react-bootstrap';
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { client, providerStore, account } from "../../../redux/slices/superAdminStateSlice";
import Swal from 'sweetalert2';
import MasterData from "../../../Utility/MasterData";

export default function ProviderList() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const token = useSelector((state) => state.user.token);

    const [swalProps, setSwalProps] = useState({});
    const [providerData, setProviderData] = useState({
        list: [],
        search: '',
        limit: 20,
        page: 1,
        copied: false,
        currentPage: '',
        totalClients: '',
        totalPages: '',
        copyText: '',
        currentList: [],
        _status: '',
    })





    useEffect(() => {
        ProviderListDetails();
        // dispatch(client_data_clear());
    }, [providerData.search, providerData.page])
    const ProviderListDetails = () => {
        let params = JSON.stringify({
            // "filter_field": providerData.search,
            // "limit": providerData.limit,
            // "page": providerData.page
        })

        Service.apiPostCallRequest(RouteURL.providerList, params, token)
            .then((res) => {


                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {

                    setProviderData((prevState) => ({
                        ...prevState,
                        // list: res?.data?.clients,
                        list: [...providerData.list, ...res?.data?.provider],
                        currentPage: res?.data?.currentPage,
                        totalClients: res?.data?.totalClients,
                        totalPages: res?.data?.totalPages,

                    }));
                    if (providerData._status == true) {
                        setProviderData((prevState) => ({
                            ...prevState,
                            // list: res?.data?.clients,
                            // list: [...providerData.list, ...res?.data?.clients],
                            currentPage: res?.data?.currentPage,
                            totalClients: res?.data?.totalClients,
                            totalPages: res?.data?.totalPages,

                        }));
                    } else {
                        setProviderData((prevState) => ({
                            ...prevState,
                            // list: res?.data?.clients,
                            list: [...providerData.list, ...res?.data?.provider],
                            currentPage: res?.data?.currentPage,
                            totalClients: res?.data?.totalClients,
                            totalPages: res?.data?.totalPages,

                        }));
                    }

                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: false,
                    });
                    // setSwalProps({
                    //     show: true,
                    //     title: 'Alert',
                    //     text: res.message,
                    // });
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
        setProviderData(prevState => ({
            ...prevState,
            copied: true,
            copyText: id
        }))
    }, [])
    const loadMoreData = () => {
        setProviderData((prevState) => ({
            ...prevState,
            page: providerData.page + 1
        }));

    }

    // useEffect(() => { }, [providerData.list])

    const IsConfirmed = (id, value, key) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to change status!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                statusChange(id, value, key)
            }
        });

    }
    const statusChange = (id, value, key) => {
        let params = JSON.stringify({
            "provider_id": id,
            "status": value
        })

        Service.apiPostCallRequest(RouteURL.updateProviderStatus, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let newFormValues = [...providerData.list];
                    newFormValues[key]['status'] = value;
                    setProviderData(prevState => ({
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
        let { Type, alldata } = data;
        if (nav == '/provider-update') {
            navigate(nav)
            dispatch(providerStore({ Type, alldata }));
        } else if (nav == '/provider-add') {
            navigate(nav)
            dispatch(providerStore({ Type }));
        } else if (nav == '/client-account') {
            navigate(nav)
            dispatch(account({ alldata }));
        }


    }

    return (
        < >

            <ToastContainer />
            <CRow >
                <CCol>
                    <div className='card' >
                        <div className='card-body'>
                            <div className="row">
                                <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-5 col-sm-8 col-8">
                                    <h3 className="hed_txt pt-2">Provider List</h3>
                                </div>
                                <div className="col-xxl-6 col-xl-3 col-lg-3 col-md-4 d-none d-md-block">
                                    {/* <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <CIcon icon={cilSearch} />
                                    </CInputGroupText>
                                    <CFormInput type="text" autoComplete="off" placeholder="Search Client by Client id, Email or Username" id="search" value={providerData.search} onChange={(e) => {
                                        e.preventDefault();
                                        setProviderData((prevState) => ({
                                            ...prevState, search: e.target.value
                                        }));
                                    }} />
                                </CInputGroup> */}

                                </div>
                                <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-3 col-sm-4 col-4 pl-0 ">

                                    <div className="card-header-actions job_export">

                                    </div>
                                    <div className="card-header-actions atten_sec flex-row-reverse">

                                        <CButton color="primary" onClick={(e) => pageNavigate(e, { alldata: '', Type: 0, }, "/provider-add")}>+  Add Provider</CButton>

                                    </div>
                                </div>
                            </div>

                            <div style={{ margin: 10 }}>
                                <table className="table table-hover">
                                    <thead className="table-primary">
                                        <tr>
                                            <th scope="col">Provider Name</th>
                                            <th scope="col">Provider Id</th>
                                            <th scope="col">Provider Description</th>
                                            <th scope="col">Currency</th>
                                            {/* <th scope="col">Logo</th> */}
                                            <th style={{ width: "11%" }}>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {providerData.list.length > 0 ? providerData.list.map((data, key) => (
                                            <tr key={key}>

                                                <td scope="row">{data.provider_name}</td>
                                                <td>
                                                    <CopyToClipboard text={data._id}
                                                        onCopy={() => onCopy(data._id)}>
                                                        <a href="javascript:void(0)" style={{ textDecoration: 'none', color: providerData.copyText != data._id ? '' : '#1b9e3e' }} key={key} >{data._id.length > 8 ? data._id.substr(0, 8) + '...' : data._id}&nbsp;
                                                            <CTooltip content={data._id} >
                                                                {providerData.copyText != data._id ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                                                    <path fillFule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                                                </svg> :
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16" color='#1b9e3e'>
                                                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                                    </svg>
                                                                }
                                                            </CTooltip>
                                                        </a>

                                                    </CopyToClipboard></td>
                                                <td >{data.provider_description}</td>
                                                <td>{data?.currencies.length > 0 ? data?.currencies.map((value, key) => { return (<><span className="badge badge-secondary" style={{ background: '#6b77856b' }}>{value.currency_code.toUpperCase()} </span> &nbsp;&nbsp;</>) }) : '-'}</td>
                                                <td >
                                                    <select className="form-select" aria-label="Default select example" value={data.status} style={{ color: data.status == 'active' ? 'green' : 'red' }}
                                                        onChange={(e) => IsConfirmed(data._id, e.target.value, key)}

                                                    >
                                                        <option disabled>Status</option>
                                                        {MasterData.Status.map((item, key) => (<option value={item.value} key={key} style={{ color: item.value == 'active' ? 'green' : 'red' }}>{item.label}</option>))}
                                                    </select>
                                                </td>
                                                <td>

                                                    <CDropdown >
                                                        <CDropdownToggle color="secondary" >Action</CDropdownToggle>
                                                        <CDropdownMenu>
                                                            <CDropdownItem onClick={(e) => pageNavigate(e, { alldata: data, Type: 1, }, "/provider-update")}>Edit Provider
                                                            </CDropdownItem>

                                                        </CDropdownMenu>
                                                    </CDropdown>
                                                </td>
                                            </tr >
                                        )) : <tr style={{ textAlign: 'center' }}><td colSpan="7">No data found</td></tr>}


                                    </tbody>
                                </table>


                            </div>
                            {/* <div className="row">
                            <div className="col-6 ">
                                <span className="d-flex justify-content-end">
                                    <button type="button" className="btn btn-primary" onClick={() => loadMoreData()} disabled={providerData.list.length == providerData.totalClients ? true : false}> Load More</button>
                                </span>

                            </div>
                            <div className="col-6">
                                <span className="d-flex justify-content-end ">{providerData.list.length + ' / ' + providerData.totalClients} Client Loaded</span>
                            </div>
                        </div> */}

                        </div>

                    </div>
                </CCol>
            </CRow>



        </>
    )

}