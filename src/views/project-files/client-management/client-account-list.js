import React, { useState, useEffect, useRef } from "react";
import {
    CButton,
    CLink,
    CCol,
    CRow, CInputGroupText,
    CInputGroup, CFormInput, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CTooltip
} from '@coreui/react'
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'react-bootstrap';
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import { clientAccountTransferBalanceDetails, clientAccountDetails } from "../../../redux/slices/superAdminStateSlice";

export default function ClientAccountList(props) {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const token = useSelector((state) => state.user.token);

    const [status, setStatus] = useState([{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }])
    const [clientData, setClientData] = useState({
        client_id: props?.clientData,
        list: [],
        search: '',
        limit: 10,
        page: 1,
        copied: false,
        currentPage: '',
        totalAccounts: '',
        totalPages: '',
        copyText: '',
        currentList: [],
        _status: '',
    })


    useEffect(() => {
        AccountListDetails();
    }, [clientData.search, clientData.page])



    /**
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
  * @function sync
  * @functionName AccountListDetails
  * @functionPurpose this function for client list.
  *
  * @functionParam {payload object:client_id,filter_field,limit,page,}
  * 
  * @functionSuccess Success status and message.
  *
  * @functionError {Boolean} error error is there.
  * @functionError {String} message  Description message.
  */
    const AccountListDetails = () => {
        let params = JSON.stringify({
            "filter": clientData.search,
            "limit": clientData.limit,
            "page": clientData.page
        })

        Service.apiPostCallRequest(RouteURL.clientAccountsList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    if ((clientData.search || clientData.search == '')) {
                        setClientData((prevState) => ({
                            ...prevState,
                            list: res?.data?.accounts,
                            currentPage: res?.data?.current_page,
                            totalAccounts: res?.data?.total_count,
                            totalPages: res?.data?.total_page,

                        }));
                    } if (clientData.page > 1) {
                        setClientData((prevState) => ({
                            ...prevState,
                            list: [...clientData.list, ...res?.data?.accounts],
                            currentPage: res?.data?.current_page,
                            totalAccounts: res?.data?.total_count,
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
            page: clientData.page + 1
        }));

    }

    useEffect(() => { }, [clientData.list])
    // page redirect
    const pageNavigate = (e, nav, accountId, clientID, accountCurrency, available_balance, account_name,) => {
        if (nav == '/client-list/client-transfer-balance') {
            navigate(nav)
            dispatch(clientAccountTransferBalanceDetails({ accountCurrency, accountId, available_balance, account_name }));
        } else if (nav == '/client-list/client-manage-account') {
            navigate(nav);
            dispatch(clientAccountDetails({ clientID, accountId }))
        }


    }

    return (<div >
        {/* <ToastContainer /> */}
        <CRow >
            <CCol>
                <div className='card' >
                    <div className='card-body'>
                        <div className="row">
                            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-5 col-sm-8 col-8">
                                <h3 className="hed_txt pt-2">Account List</h3>
                            </div>
                            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-5 col-sm-8 col-8">

                            </div>
                            <div className="col-xxl-4 col-xl-7 col-lg-7 col-md-7 d-none d-md-block">
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <CIcon icon={cilSearch} />
                                    </CInputGroupText>
                                    <CFormInput type="text" autoComplete="off" placeholder="Search by A/C Name, A/C Id" id="search" value={clientData.search} onChange={(e) => {
                                        e.preventDefault();
                                        setClientData((prevState) => ({
                                            ...prevState, search: e.target.value, page: 1, limit: 10
                                        }));
                                    }} />
                                </CInputGroup>

                            </div>

                        </div>

                        <div style={{ margin: 10 }} class="tableFixHead">
                            <table className="table table-hover">
                                <thead className="table-primary">
                                    <tr>
                                        <th>A/C Name</th>
                                        <th>A/C Code</th>
                                        <th>Currency</th>
                                        <th>Region</th>
                                        <th>Status</th>
                                        <th>Credit Limit</th>
                                        <th>Reg Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {clientData.list.length > 0 ? clientData.list.map((data, key) => (
                                        <tr key={key}>

                                            <td scope="row">
                                                <CopyToClipboard text={data.account_name}
                                                    onCopy={() => onCopy(data.account_name)}>
                                                    <a href="javascript:void(0)" style={{ textDecoration: 'none', color: clientData.copyText != data.account_name ? '' : '#1b9e3e' }} key={key} >{data.account_name.length > 8 ? data.account_name.substr(0, 8) + '...' : data.account_name} &nbsp;
                                                        <CTooltip content={data.account_name} >
                                                            {clientData.copyText != data.account_name ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                                                <path fillFule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                                            </svg> :
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16" color='#1b9e3e'>
                                                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                                </svg>
                                                            }
                                                        </CTooltip>
                                                    </a>

                                                </CopyToClipboard>
                                            </td>

                                            <td>
                                                <CopyToClipboard text={data._id}
                                                    onCopy={() => onCopy(data._id)}>
                                                    <a href="javascript:void(0)" style={{ textDecoration: 'none', color: clientData.copyText != data._id ? '' : '#1b9e3e' }} key={key} >{data._id.length > 4 ? data._id.substr(0, 4) + '...' : data._id} &nbsp;
                                                        <CTooltip content={data._id} >
                                                            {clientData.copyText != data._id ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                                                <path fillFule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                                            </svg> :
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16" color='#1b9e3e'>
                                                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                                </svg>
                                                            }
                                                        </CTooltip>
                                                    </a>

                                                </CopyToClipboard>
                                            </td>
                                            <td><span className="badge badge-secondary" style={{ background: '#6b77856b' }}>{data.currency_code.toUpperCase()}</span></td>

                                            <td>{data.region_name.toUpperCase()}</td>
                                            <td>
                                                <span style={{ color: data.status == 'active' ? 'green' : 'red' }}>
                                                    {status.map((item, key) => data.status == item.value ? <label >{item.label}</label> : "")}
                                                </span>
                                            </td>
                                            <td>{Number(data.available_balance) == 0 ? 0.00 : data.available_balance}</td>
                                            <td>{moment(data.created_at).format("yyyy-MM-DD")} </td>
                                            <td>
                                                <CDropdown >
                                                    <CDropdownToggle color="secondary">Action</CDropdownToggle>
                                                    <CDropdownMenu >
                                                        <CDropdownItem onClick={(e) => pageNavigate(e, "/client-list/client-manage-account", data._id, data.client_id)}>Manage Account</CDropdownItem>
                                                        {/* <CDropdownItem onClick={(e) => pageNavigate(e, "/client-transfer-balance", data._id, '', data.currency_details[0], data.available_balance, data.account_name)}>Transfer Balance</CDropdownItem> */}
                                                    </CDropdownMenu>
                                                </CDropdown>
                                            </td>
                                        </tr >
                                    )) : <tr style={{ textAlign: 'center' }}><td colSpan="8">No data found</td></tr>}


                                </tbody>
                            </table>


                        </div>
                        {clientData.list.length > 0 ?
                            <div className="row">
                                <div className="col-6 ">
                                    <span className="d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary" onClick={() => loadMoreData()} disabled={clientData.list.length == clientData.totalAccounts ? true : false}> Load More</button>
                                    </span>

                                </div>
                                <div className="col-6">
                                    <span className="d-flex justify-content-end ">{clientData.list.length + ' / ' + clientData.totalAccounts} Account Loaded</span>
                                </div>
                            </div> : ""}

                    </div>

                </div>
            </CCol>
        </CRow>
    </div>)
}