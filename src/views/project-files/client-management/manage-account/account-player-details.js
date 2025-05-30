
import React, { useState, useEffect } from 'react';
import { CFormSelect, CTooltip } from '@coreui/react'
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import Service from "../../../../apis/Service";
import RouteURL from "../../../../apis/ApiURL";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Constants } from "../../../../apis/Constant";
import { leftTrim, camelCase } from "../../../../Utility/helper";
import moment from 'moment';
import MasterData from '../../../../Utility/MasterData';

export default function AccountPlayerDetails() {
    const PlayerAccountDetails = useSelector((state) => state.player_details);
    const token = useSelector((state) => state.user.token);
    let navigate = useNavigate();
    const [state, setState] = useState({
        list: [],
        provider_list: [],
        player_details: {},
        transaction_type: null,
        start_date: moment(new Date()).subtract(7, 'days').format('yyyy-MM-DD HH:mm:ss'),
        end_date: moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
        page: 1,
        limit: 10,
        currentPage: "",
        totalPages: "",
        totalPlayerTransactions: "",
        copied: false,
        copyText: '',
        provider_id: ""
    });

    useEffect(() => {
        PlayerDetails()
        ProviderList()
    }, [])

    const PlayerDetails = () => {
        let params = JSON.stringify({
            "player_id": PlayerAccountDetails.palyerId,
        })
        Service.apiPostCallRequest(RouteURL.PlayerDetails, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        player_details: res?.data,
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

    const ProviderList = () => {
        let params = JSON.stringify({
            "client_account_id": PlayerAccountDetails.accountId
        })

        Service.apiPostCallRequest(RouteURL.ProviderList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        provider_list: res?.data,
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


    useEffect(() => {
        let params = JSON.stringify({
            "player_id": PlayerAccountDetails.palyerId,
            "provider_id": state.provider_id,
            "transaction_type": state.transaction_type,
            "start_date": moment(new Date(state.start_date)).format('yyyy-MM-DD'),
            "end_date": moment(new Date(state.end_date)).format('yyyy-MM-DD'),
            "page": state.page,
            "limit": state.limit
        })
        PlayerTransactionHistory(params)
    }, [state.page])


    const PlayerTransactionHistory = (params) => {
        Service.apiPostCallRequest(RouteURL.PlayerTransactionDetails, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    if (state.page == 1) {
                        setState((prevState) => ({
                            ...prevState,
                            list: res.data.transactions,
                            currentPage: res.data.current_page,
                            totalPages: res.data.total_page,
                            totalPlayerTransactions: res.data.total_count

                        }));
                    } if (state.page > 1) {
                        setState((prevState) => ({
                            ...prevState,
                            list: [...state.list, ...res?.data?.transactions],
                            currentPage: res?.data?.current_page,
                            totalPlayerTransactions: res?.data?.total_count,
                            totalPages: res?.data?.total_page,

                        }));
                    }

                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: true,
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
            [id]: leftTrim(value),
            page: 1
        }))
    }


    const loadMoreData = () => {
        setState((prevState) => ({
            ...prevState,
            page: state.page + 1
        }));

    }
    const onCopy = React.useCallback((id) => {
        setState(prevState => ({
            ...prevState,
            copied: true,
            copyText: id
        }))
    }, [])

    const Search = () => {
        setState((prevState) => ({
            ...prevState,
            page: 1
        }));
        let params = JSON.stringify({
            "player_id": PlayerAccountDetails.palyerId,
            "provider_id": state.provider_id,
            "transaction_type": state.transaction_type == "" ? null : state.transaction_type,
            "start_date": moment(state.start_date).format('yyyy-MM-DD'),
            "end_date": moment(state.end_date).format('yyyy-MM-DD'),
            "page": 1,
            "limit": 5
        })
        PlayerTransactionHistory(params)
    }

    return (
        <div className='card shadow-lg rounded' >
            <div className='card-body'>

                <div className="row">
                    <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-5 col-sm-8 col-8">
                        <h3 className="hed_txt pt-2">Player Details</h3>
                    </div>
                </div>

                <div className="project_upper_box2 mt-2">
                    <div className="row">
                        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <div className="deal_inner">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: 150 }}><strong>Username</strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>{state.player_details.username}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: 150 }}><strong>User Id</strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>{state.player_details._id}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: 150 }}><strong>External User Id </strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>{state.player_details.external_user_id}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: 150 }}><strong>Status</strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>
                                                <span style={{ color: state.player_details.status == 'active' ? 'green' : 'red' }}>
                                                    {MasterData.Status.map((item, key) => state.player_details.status == item.value ? <label >{item.label}</label> : "")}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-3 col-lg-6 col-md-6 col-sm-12">
                            <div className="deal_inner">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: 150 }}><strong>Sign Up Date</strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>{moment(state.player_details.created_at).format('YYYY-MM-DD')}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: 150 }}><strong>Last Log In  </strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>{state.player_details.last_login ? moment(state.player_details.last_login).format('YYYY-MM-DD') : ""}</td>
                                        </tr>

                                        <tr>
                                            <td style={{ width: 150 }}><strong>Average RTP (%)</strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>{state.player_details.average_rtp}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-xxl-4 col-xl-3 col-lg-6 col-md-6 col-sm-12">
                            <div className="deal_inner">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: 150 }}><strong>Total Bet Count </strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>{state.player_details.total_bet_count}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: 150 }}><strong>Total Bet</strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>{state.player_details.total_bet}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: 150 }}><strong>Total Win</strong></td>
                                            <td style={{ width: 15 }}>:</td>
                                            <td>{state.player_details.total_win}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-4'>
                    <div className='col-2'>
                        <label htmlFor="start_date">Start</label>
                        <input id="start_date" className="form-control" type="datetime-local" value={state.start_date} onChange={handleChange} />
                    </div>
                    <div className='col-2'>
                        <label htmlFor="end_date">End</label>
                        <input id="end_date" className="form-control" type="datetime-local" value={state.end_date} onChange={handleChange} />
                    </div>
                    <div className='col-3'>
                        <label htmlFor="end_date">Transaction Type</label>
                        <CFormSelect aria-label="Default select example" id="transaction_type" onChange={handleChange} >
                            <option >Select Type</option>
                            {MasterData?.typeOfTransaction?.length > 0 && MasterData?.typeOfTransaction?.map((data, key) => (
                                <option value={data.value} key={key} >{data.label}</option>
                            ))}
                        </CFormSelect>
                    </div>

                    <div className='col-3'>
                        <label htmlFor="end_date">Provider</label>
                        <CFormSelect aria-label="Default select example" id="provider_id" onChange={handleChange} >
                            <option>Select Provider</option>
                            {state?.provider_list?.length > 0 && state?.provider_list?.map((data, key) => (
                                <option value={data.provider_id} key={key} >{data.provider_details.provider_name}</option>
                            ))}
                        </CFormSelect>
                    </div>
                    <div className='col-2 mt-4' >
                        <button type="button" className="btn btn-primary " onClick={Search}>Search</button>
                        <button style={{ marginLeft: 5 }} type="button" className="btn btn-primary " onClick={() => PlayerAccountDetails.fromPage == "/player-list" ? navigate("/player-list") :
                            (PlayerAccountDetails.fromPage == "/client-list/client-manage-account" ?
                                navigate("/client-list/client-manage-account") :
                                navigate("/my-account-list/client-manage-account")
                            )
                        }>Back</button>
                    </div>

                </div>

                <div className='card shadow-lg rounded mt-5' >
                    <div className='card-body'>
                        <div className='table-responsive mt-2 tableFixHead'>
                            <table className="table table-hover">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Sl No</th>
                                        <th>Transactions Id</th>
                                        <th>Transactions Type</th>
                                        <th>Amount</th>
                                        <th>Game Round</th>
                                        <th>Game ID</th>
                                        <th>Round Id</th>
                                        <th>Provider</th>
                                        <th>Date Time</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {state.list?.length > 0 ? state.list.map((data, key) => (
                                        <tr key={key}>
                                            <td>{key + 1}</td>
                                            <td scope="row">
                                                <CopyToClipboard text={data._id}
                                                    onCopy={() => onCopy(data._id)}>
                                                    <a href="javascript:void(0)" style={{ textDecoration: 'none', color: state.copyText != data._id ? '' : '#1b9e3e' }} key={key} >{data._id.length > 8 ? data._id.substr(0, 8) + '...' : data._id} &nbsp;
                                                        <CTooltip content={data._id} >
                                                            {state.copyText != data._id ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
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
                                            <td style={{ color: data.transaction_type == 'debit' ? '#ff0000bf' : '#0080009c', }}>{camelCase(data.transaction_type)}</td>
                                            <td style={{ color: data.transaction_type == 'debit' ? '#ff0000bf' : '#0080009c' }}>{data.transaction_amount}</td>
                                            <td>{data.game_name.en}</td>
                                            <td>{data.game_id}</td>
                                            <td>{data.round_id}</td>
                                            <td>{data.provider_name.en}</td>

                                            <td>{moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                                        </tr >
                                    )) : <tr style={{ textAlign: 'center' }}><td colSpan="9">No data found</td></tr>}


                                </tbody>
                            </table>

                            <div className="row mt-2">
                                <div className="col-6 ">
                                    <span className="d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary" onClick={() => loadMoreData()} disabled={state.list?.length == (state.totalPlayerTransactions) ? true : false}> Load More</button>
                                    </span>
                                </div>
                                <div className="col-6">
                                    <span className="d-flex justify-content-end ">{state.list.length + ' / ' + (state.totalPlayerTransactions)}&nbsp;Transactions Loaded</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}