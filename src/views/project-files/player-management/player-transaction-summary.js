
import React, { useState, useEffect } from 'react'
import {
    CFormSelect,
    CTooltip
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import moment from "moment";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Service from "../../../apis/Service";
import { Constants } from "../../../apis/Constant";
import { camelCase } from "../../../Utility/helper";
import RouteURL from "../../../apis/ApiURL";
import MasterData from '../../../Utility/MasterData';


export default function PlayerLogDetails() {
    const token = useSelector((state) => state.user.token);
    const [state, setState] = useState({
        transaction_list: [],
        game_list: [],
        transaction_type: null,
        start_date: moment(new Date()).subtract(7, 'days').format('yyyy-MM-DD HH:mm:ss'),
        end_date: moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
        page: 1,
        limit: 10,
        currentPage: "",
        totalPages: "",
        totalPlayerTransactions: "",
        accountType: "Account",
        copied: false,
        copyText: '',
    })

    const getPlayerDetails = useSelector((state) => state.player_details);

    useEffect(() => {
        let params = JSON.stringify({
            "player_id": getPlayerDetails.alldata._id,
            "transaction_type": state.transaction_type,
            "start_date": moment(new Date(state.start_date)).format('yyyy-MM-DD'),
            "end_date": moment(new Date(state.end_date)).format('yyyy-MM-DD'),
            "page": state.page,
            "limit": state.limit
        })
        ClientAccountWiseTransactionHistory(params);
    }, [state.accountType, state.page])

    const ClientAccountWiseTransactionHistory = (params) => {

        Service.apiPostCallRequest(RouteURL.playerTransactionSummary, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    if (state.page == 1) {
                        setState((prevState) => ({
                            ...prevState,
                            transaction_list: res.data.transactions,
                            currentPage: res.data.current_page,
                            totalPages: res.data.total_page,
                            totalPlayerTransactions: res.data.total_count

                        }));
                    } if (state.page > 1) {
                        setState((prevState) => ({
                            ...prevState,
                            transaction_list: [...state.transaction_list, ...res?.data?.transactions],
                            currentPage: res?.data?.current_page,
                            totalPlayerTransactions: res?.data?.total_count,
                            totalPages: res?.data?.total_page,

                        }));
                    }


                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                // toast.error(error.response.data.message, {
                //     position: 'bottom-right',
                //     autoClose: false,
                // });
            });
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
            "player_id": getPlayerDetails.alldata._id,
            "transaction_type": state.transaction_type == "" ? null : state.transaction_type,
            "start_date": moment(state.start_date).format('yyyy-MM-DD'),
            "end_date": moment(state.end_date).format('yyyy-MM-DD'),
            "page": 1,
            "limit": 5
        })

        ClientAccountWiseTransactionHistory(params);
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    useEffect(() => { }, [state.start_date, state.end_date])

    const dueDateOnChange = (due_date) => {
        let _Date = new Date();
        let _today = moment(_Date).format("YYYY-MM-DD");
        if (due_date == "Today") {
            setState(prevState => ({
                ...prevState,
                start_date: _today,
                end_date: _today,
                selectedOption: due_date
            }))

        } else if (due_date == "Yesterday") {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() - 1);
            let _yesterday = moment(tomorrow).format("YYYY-MM-DD");
            setState(prevState => ({
                ...prevState,
                start_date: _yesterday,
                end_date: _today,
                selectedOption: due_date
            }))

        } else if (due_date == "24h") {
            let _Date = new Date();
            const hr24beforedate = new Date(moment(_Date).subtract(24, 'hours').format("YYYY-MM-DD"));
            let _24hrbeforedate = moment(hr24beforedate).format("YYYY-MM-DD");
            setState(prevState => ({
                ...prevState,
                start_date: _24hrbeforedate,
                end_date: _today,
                selectedOption: due_date
            }))

        }
        else if (due_date == "7days") {
            let _Date = new Date();
            const business7day = new Date(_Date);
            business7day.setDate(business7day.getDate() - 7);
            let _7days = moment(business7day).format("YYYY-MM-DD");
            setState(prevState => ({
                ...prevState,
                start_date: _7days,
                end_date: _today,
                selectedOption: due_date
            }))


        } else if (due_date == "30days") {
            let _Date = new Date();
            const in30days = new Date(_Date.getTime() - 30 * 24 * 60 * 60 * 1000);
            let _30days = moment(in30days).format("YYYY-MM-DD");
            setState(prevState => ({
                ...prevState,
                start_date: _30days,
                end_date: _today,
                selectedOption: due_date
            }))
        } else if (due_date == "this_month") {
            let _Date = new Date();
            const inThisMonth1stDate = new Date(_Date.getFullYear(), _Date.getMonth(), 1);
            let _inThisMonth1stDate = moment(inThisMonth1stDate).format("YYYY-MM-DD");

            setState(prevState => ({
                ...prevState,
                start_date: _inThisMonth1stDate,
                end_date: _today,
                selectedOption: due_date
            }))

        } else if (due_date == "previous_month") {
            let _Date = new Date();
            const prevMonth1stDay = new Date(_Date.getFullYear(), _Date.getMonth() - 1);
            const prevMonthlastDay = new Date(_Date.getFullYear(), _Date.getMonth(), 0);
            let _prevMonth1stDay = moment(prevMonth1stDay).format("YYYY-MM-DD");
            let _prevMonthlastDay = moment(prevMonthlastDay).format("YYYY-MM-DD");
            setState(prevState => ({
                ...prevState,
                start_date: _prevMonth1stDay,
                end_date: _prevMonthlastDay,
                selectedOption: due_date
            }))

        } else if (due_date == "last_2_month") {
            let _Date = new Date();
            const last2Month1stDay = new Date(_Date.getFullYear(), _Date.getMonth() - 2);
            const last2MonthlastDay = new Date(_Date.getFullYear(), _Date.getMonth(), 0);
            let _last2Month1stDay = moment(last2Month1stDay).format("YYYY-MM-DD");
            let _last2MonthlastDay = moment(last2MonthlastDay).format("YYYY-MM-DD");
            setState(prevState => ({
                ...prevState,
                start_date: _last2Month1stDay,
                end_date: _last2MonthlastDay,
                selectedOption: due_date
            }))
        } else if (due_date == "last_3_month") {
            let _Date = new Date();
            const last3Month1stDay = new Date(_Date.getFullYear(), _Date.getMonth() - 3);
            const last3MonthlastDay = new Date(_Date.getFullYear(), _Date.getMonth(), 0);
            let _last3Month1stDay = moment(last3Month1stDay).format("YYYY-MM-DD");
            let _last3MonthlastDay = moment(last3MonthlastDay).format("YYYY-MM-DD");
            setState(prevState => ({
                ...prevState,
                start_date: _last3Month1stDay,
                end_date: _last3MonthlastDay,
                selectedOption: due_date
            }))
        }
    }

    return (
        <div>
            <div className='mt-2'>
                <div className='d-flex time-cal-main'>
                    <div className='time-cal' onClick={() => dueDateOnChange('24h')} style={{ background: state.selectedOption == '24h' ? '#1b9e3e' : '' }}>24h</div>
                    <div className='time-cal' onClick={() => dueDateOnChange('7days')} style={{ background: state.selectedOption == '7days' ? '#1b9e3e' : '' }}>7 days</div>
                    <div className='time-cal' onClick={() => dueDateOnChange('30days')} style={{ background: state.selectedOption == '30days' ? '#1b9e3e' : '' }}>30 days</div>
                    <div className='time-cal' onClick={() => dueDateOnChange('Today')} style={{ background: state.selectedOption == 'Today' ? '#1b9e3e' : '' }}>Today</div>
                    <div className='time-cal' onClick={() => dueDateOnChange('Yesterday')} style={{ background: state.selectedOption == 'Yesterday' ? '#1b9e3e' : '' }}>Yesterday</div>
                    <div className='time-cal' onClick={() => dueDateOnChange('this_month')} style={{ background: state.selectedOption == 'this_month' ? '#1b9e3e' : '' }}>This Month</div>
                    <div className='time-cal' onClick={() => dueDateOnChange('previous_month')} style={{ background: state.selectedOption == 'previous_month' ? '#1b9e3e' : '' }}>Previous Month</div>
                    <div className='time-cal' onClick={() => dueDateOnChange('last_2_month')} style={{ background: state.selectedOption == 'last_2_month' ? '#1b9e3e' : '' }}>Last 2 Month</div>
                    <div className='time-cal' onClick={() => dueDateOnChange('last_3_month')} style={{ background: state.selectedOption == 'last_3_month' ? '#1b9e3e' : '' }}>Last 3 Month</div>
                </div>
            </div>
            <div className='mt-2'>
                <div className='card shadow-lg rounded' >
                    <div className='card-body'>
                        <h3 className="hed_txt pt-2">Player Transaction Summary</h3>

                        <div className="row" style={{ padding: "20px" }}>
                            <div className="col-sm-3">
                                <label htmlFor="start_date">Start Date <span style={{ color: 'red' }}>*</span></label>
                                <input id="start_date" className="form-control" type="date" value={state.start_date} onChange={handleChange} />
                            </div>
                            <div className="col-sm-3">
                                <label htmlFor="end_date">End Date <span style={{ color: 'red' }}>*</span></label>
                                <input id="end_date" className="form-control" type="date" value={state.end_date} onChange={handleChange} />
                            </div>
                            <div className="col-sm-3">
                                <label htmlFor="end_date">Transaction Type</label>
                                <CFormSelect aria-label="Default select example" id="transaction_type" onChange={handleChange} >
                                    <option disabled>Select type of transaction</option>
                                    {MasterData?.typeOfTransaction?.length > 0 && MasterData?.typeOfTransaction?.map((data, key) => (
                                        <option value={data.value} key={key} >{data.label}</option>
                                    ))}
                                </CFormSelect>
                            </div>


                            <div className="col-sm-3 mt-4">
                                <button type="button" className="btn btn-primary "
                                    onClick={Search}
                                >Search</button>
                            </div>
                        </div>

                        <div className='table-responsive mt-2 tableFixHead'>
                            <table className="table table-hover ">
                                <thead className="table-primary">
                                    <tr>
                                        <th style={{ width: "14%" }}>Transactions Id</th>
                                        <th style={{ width: "10%" }}>Amount</th>
                                        <th style={{ width: "12%" }}>Ava. credit</th>
                                        <th style={{ width: "5%" }}>Type</th>
                                        <th style={{ width: "12%" }}>Date</th>
                                        <th style={{ width: "10%" }}>Trans. From User</th>
                                        <th style={{ width: "10%" }}>Trans. To User</th>

                                        <th style={{ width: "5%" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {state.transaction_list?.length > 0 ? state.transaction_list.map((data, key) => (
                                        <tr key={key}>
                                            <td scope="row">
                                                <CopyToClipboard text={data.transaction_id}
                                                    onCopy={() => onCopy(data.transaction_id)}>
                                                    <a href="javascript:void(0)" style={{ textDecoration: 'none', color: state.copyText != data.transaction_id ? '' : '#1b9e3e' }} key={key} >{data.transaction_id.length > 8 ? data.transaction_id.substr(0, 8) + '...' : data.transaction_id}  &nbsp;
                                                        <CTooltip content={data.transaction_id} >
                                                            {state.copyText != data.transaction_id ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
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

                                            <td style={{ color: data.transaction_type == 'debit' ? '#ff0000bf' : '#0080009c', }}>{data.amount}</td>
                                            <td >{data.available_balance}</td>
                                            <td style={{ color: data.transaction_type == 'debit' ? '#ff0000bf' : '#0080009c', }}>{camelCase(data.transaction_type)}</td>
                                            <td>{moment(data.created_at).format('YYYY-MM-DD')}</td>
                                            <td>{data.from_user_username ? data.from_user_username : "-"}</td>

                                            <td>{data.to_user_username ? data.to_user_username : "-"}</td>

                                            <td>{camelCase(data.status)}</td>
                                        </tr >
                                    )) : <tr style={{ textAlign: 'center' }}><td colSpan="10">No data found</td></tr>}


                                </tbody>
                            </table>
                            <div className="row mt-2">
                                <div className="col-6 ">
                                    <span className="d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary" onClick={() => loadMoreData()} disabled={state.transaction_list?.length == state.totalPlayerTransactions ? true : false}> Load More</button>
                                    </span>

                                </div>
                                <div className="col-6">
                                    <span className="d-flex justify-content-end ">{state.transaction_list.length + ' / ' + (state.totalPlayerTransactions)}&nbsp;Transactions Loaded</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
