
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Service from "../../../../apis/Service";
import RouteURL from "../../../../apis/ApiURL";
import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../apis/Constant";
import { leftTrim } from "../../../../Utility/helper";
import moment from 'moment';
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CInputGroupText,
    CInputGroup, CFormInput, CTooltip
} from '@coreui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { PlayerDetails } from "../../../../redux/slices/superAdminStateSlice";


export default function PlayersList() {
    const getClientAccountDetails = useSelector((state) => state.client_account_details);
    const token = useSelector((state) => state.user.token);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        list: [],
        filter: "",
        start_date: moment(new Date()).subtract(7, 'days').format('yyyy-MM-DD HH:mm:ss'),
        end_date: moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
        page: 1,
        limit: 10,
        currentPage: "",
        totalPages: "",
        totalPlayers: "",
        search: "",
        copyText: ""
    });

    useEffect(() => {
        let params = JSON.stringify({
            "account_id": getClientAccountDetails.accountId,
            "filter": state.search,
            // "start_date": state.start_date,
            // "end_date": state.end_date,
            "page": state.page,
            "limit": state.limit
        })
        ClientAccountWisePlayerList(params)
    }, [state.page])
    const ClientAccountWisePlayerList = (params) => {
        Service.apiPostCallRequest(RouteURL.allPlayerList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        list: res?.data?.accounts,
                        currentPage: res?.data?.current_page,
                        totalPlayers: res?.data?.total_count,
                        totalPages: res?.data?.total_page,

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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [id]: leftTrim(value)
        }))
    }


    const onCopy = React.useCallback((id) => {
        setState(prevState => ({
            ...prevState,
            copied: true,
            copyText: id
        }))
    }, [])

    const Search = () => {
        let params = JSON.stringify({
            "account_id": getClientAccountDetails.accountId,
            "filter": state.search,
            // "start_date": moment(state.start_date).format('yyyy-MM-DD HH:mm:ss'),
            // "end_date": moment(state.end_date).format('yyyy-MM-DD HH:mm:ss'),
            "page": state.page,
            "limit": state.limit
        })
        ClientAccountWisePlayerList(params)
    }


    const pageNavigate = (e, nav, palyerId, account_id, from_page) => {
        navigate(nav);
        dispatch(PlayerDetails({ palyerId: palyerId, accountId: account_id, fromPage: from_page }))
    }
    return (
        <div>
            <div className='row'>
                <div className='col-sm-4 mt-4'>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon icon={cilSearch} />
                        </CInputGroupText>
                        <CFormInput type="text" autoComplete="off" placeholder="Search by User ID, Username" id="search" value={state.search} onChange={(e) => {
                            e.preventDefault();
                            setState((prevState) => ({
                                ...prevState, search: e.target.value, page: 1, limit: 10
                            }));
                        }} />
                    </CInputGroup>
                </div>
                {/* <div className='col-sm-3'>
                    <label for="start_date">Start</label>
                    <input id="start_date" class="form-control" type="datetime-local" value={state.start_date} onChange={handleChange} />
                </div>
                <div className='col-sm-3'>
                    <label for="end_date">End</label>
                    <input id="end_date" class="form-control" type="datetime-local" value={state.end_date} onChange={handleChange} />
                </div> */}
                <div className='col-sm-2 mt-4 text-align-end' >
                    <button type="button" class="btn btn-primary" onClick={Search}>Search</button>
                </div>
            </div>


            <div className='table-responsive mt-2 tableFixHead'>
                <table className="table table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th style={{ width: "14%" }}>User ID</th>
                            <th style={{ width: "10%" }}>Username</th>
                            <th style={{ width: "17%" }}>Ext. User Code</th>
                            <th style={{ width: "12%" }}>Total Bet</th>
                            <th style={{ width: "11%" }}>Total Win</th>
                            <th style={{ width: "16%" }}>Total Margin</th>
                            <th style={{ width: "20%" }}>Avg. RTP(%)</th>
                        </tr>
                    </thead>
                    <tbody>

                        {state.list.length > 0 ? state.list.map((data, key) => (
                            <tr key={key}>
                                <td >

                                    <span className="d-inline-block" tabIndex="0" data-bs-toggle="tooltip" data-bs-title="Disabled tooltip"></span>
                                    <span style={{ textDecoration: 'none', color: state.copyText != data._id ? '' : '#1b9e3e' }}>{data._id.substr(0, 5) + '...'} </span>&nbsp;
                                    <CopyToClipboard text={data._id}
                                        onCopy={() => onCopy(data._id)}>

                                        <a href="javascript:void(0)" style={{ textDecoration: 'none', color: state.copyText != data._id ? '' : '#1b9e3e' }} key={key} >
                                            <CTooltip content={data._id}>
                                                {state.copyText != data._id ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                                    <path fillFule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                                </svg> :
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16" color='#1b9e3e'>
                                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                    </svg>
                                                }
                                            </CTooltip>
                                        </a>

                                    </CopyToClipboard></td>
                                <td style={{ color: '#5473ff', cursor: 'pointer' }} onClick={(e) => pageNavigate(e, "/player-list/account-player-details", data._id, data.account_id, "/my-account-list/client-manage-account")}>{data.username}</td>
                                <td>

                                    <span className="d-inline-block" tabIndex="0" data-bs-toggle="tooltip" data-bs-title="Disabled tooltip"></span>
                                    <span style={{ textDecoration: 'none', color: state.copyText != data.external_user_id ? '' : '#1b9e3e' }}>{data.external_user_id.substr(0, 5) + '...'} </span>&nbsp;
                                    <CopyToClipboard text={data.external_user_id}
                                        onCopy={() => onCopy(data.external_user_id)}>

                                        <a href="javascript:void(0)" style={{ textDecoration: 'none', color: state.copyText != data.external_user_id ? '' : '#1b9e3e' }} key={key} >
                                            <CTooltip content={data.external_user_id}>
                                                {state.copyText != data.external_user_id ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
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
                                <td>{data.total_bet}</td>
                                <td>{data.total_win}</td>
                                <td>{data.total_margin}</td>
                                <td>{data.average_rtp}</td>
                            </tr >
                        )) : <tr style={{ textAlign: 'center' }}><td colSpan="7">No data found</td></tr>}
                    </tbody>
                </table>
            </div>
            <div className="row" style={{ padding: "20px" }}>
                {state.totalPages > 1 &&
                    <div className="col-12 d-flex justify-content-center">
                        {(() => {
                            const maxPagesToShow = 5;
                            const totalPages = state.totalPages;
                            const currentPage = state.page;
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
    )
}