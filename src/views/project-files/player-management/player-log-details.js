
import React, { useState, useEffect } from 'react'
import {
    CButton,
    CInputGroupText,
    CInputGroup, CFormInput
} from '@coreui/react'
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import moment from "moment";

export default function PlayerLogDetails() {
    const [state, setState] = useState({
        list: [],
        search: '',
        limit: 10,
        page: 1,
        copied: false,
        currentPage: '',
        totalClients: '',
        totalPages: '',
        copyText: '',
        start_date: '',
        end_date: '',
        selectedOption: ''
    })
  
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
                        <div className="row">
                            <span className='play_del border-bottom'><b>User Log Details</b>  </span>
                        </div>
                        <div className="row mt-3">
                            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-5 col-sm-8 col-8 mt-4">
                                <CInputGroup className="mb-3">
                                    <CInputGroupText>
                                        <CIcon icon={cilSearch} />
                                    </CInputGroupText>
                                    <CFormInput type="text" autoComplete="off" placeholder="Search Transaction" id="search"
                                    // value={clientData.search} onChange={(e) => {
                                    //     e.preventDefault();
                                    //     setClientData((prevState) => ({
                                    //         ...prevState, search: e.target.value
                                    //     }));
                                    // }} 
                                    />
                                </CInputGroup>
                            </div>
                            <div className="col-xxl-6 col-xl-3 col-lg-3 col-md-4 d-none d-md-block">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <label htmlFor="start_date">Start Date <span style={{ color: 'red' }}>*</span></label>
                                        <input id="start_date" className="form-control" type="date" value={state.start_date} onChange={handleChange} />
                                    </div>
                                    <div className="col-sm-4">
                                        <label htmlFor="end_date">End Date <span style={{ color: 'red' }}>*</span></label>
                                        <input id="end_date" className="form-control" type="date" value={state.end_date} onChange={handleChange} />
                                    </div>
                                    <div className="col-sm-4 mt-4">
                                        <label ></label>
                                        <CButton color="primary" >Search</CButton>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-3 col-sm-4 col-4 pl-0 text-end mt-4">
                                <div className="card-header-actions atten_sec flex-row-reverse">
                                    <CButton color="primary" >Export</CButton>

                                </div>
                            </div>
                        </div>

                        <div style={{ margin: 10, overflowX: 'auto' }} className='table-responsive tableFixHead'>
                            <table className="table table-hover">
                                <thead className="table-primary">
                                    <tr>
                                        <th style={{ width: "10%" }}>Trans. ID</th>
                                        <th style={{ width: "10%" }}>Action</th>
                                        <th style={{ width: "10%" }}>Trans. Type</th>
                                        <th style={{ width: "10%" }}>Amount</th>
                                        <th style={{ width: "10%" }}>Ava. Amount</th>
                                        <th style={{ width: "10%" }}>Game Details</th>
                                        <th style={{ width: "10%" }}>Game ID</th>
                                        <th style={{ width: "10%" }}>Game Name</th>
                                        <th style={{ width: "10%" }}>Game Category Name</th>
                                        <th style={{ width: "10%" }}>Round ID</th>
                                        <th style={{ width: "10%" }}>Provider</th>
                                        <th style={{ width: "10%" }}>Date time</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {state.list.length > 0 ? state.list.map((data, key) => (
                                        <tr key={key}>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr >
                                    )) : <tr style={{ textAlign: 'center' }}><td colSpan="12">No data found</td></tr>}


                                </tbody>
                            </table>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
