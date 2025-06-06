
/**
 * @file_purpose  page for showing provider wise report
 * @author Sucheta Singha
 * @Date_Created 29.01.2025
 * @Date_Modified 29.01.2025
 */
import React, { useState, useEffect } from "react";
import {
    CInputGroupText,
    CInputGroup, CFormInput,
} from '@coreui/react'
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useSelector } from "react-redux";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import * as XLSX from "xlsx";
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'


export default function ProviderWiseReport() {
    const token = useSelector((state) => state.user.token);
    const [startDate, setStartDate] = useState(moment().subtract(1, "days"));
    const [endDate, setEndDate] = useState(moment());
    const getClientAccountDetails = useSelector((state) => state.user);

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

    const [state, setState] = useState({
        provider_report: [],
        client_id: '',
        client_list: [],
        account_list: [],
        search: '',
        account_id: '',
        provider_sum_report: {},
        limit: 5,
        page: 1,
        totalData: 0,
        totalPages: '',
        currentPage: ''
    })
    const [open, setOpen] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const handleApply = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    useEffect(() => {
        ClientListDetails();
    }, [])


    /**
  * @author Sucheta Singha
  * @Date_Created  29.01.2025
  * @Date_Modified 
  * @function sync
  * @functionName ClientListDetails
  * @functionPurpose this function for client list.
  *
  * @functionParam {payload object:filter_field,limit,page,}
  * 
  * @functionSuccess Success status and message.
  *
  * @functionError {Boolean} error error is there.
  * @functionError {String} message  Description message.
  */
    const ClientListDetails = () => {
        Service.apiPostCallRequest(RouteURL.allClientList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let self_client_details = getClientAccountDetails.client_details;
                    res?.data.unshift(self_client_details);
                    setState((prevState) => ({
                        ...prevState,
                        client_list: res?.data,
                        client_id: res?.data[0]?._id
                    }));

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

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            account_list: [],
        }));
        if (state?.client_id) AccountListDetails()
    }, [state.client_id])

    /**
  * @author Sucheta Singha
  * @Date_Created  29.01.2025
  * @Date_Modified 
  * @function sync
  * @functionName AccountListDetails
  * @functionPurpose this function for client list.
  *
  * @functionParam {payload object:client_id}
  * 
  * @functionSuccess Success status and message.
  *
  * @functionError {Boolean} error error is there.
  * @functionError {String} message  Description message.
  */
    const AccountListDetails = () => {
        let params = JSON.stringify({
            "client_id": state.client_id,
        })

        Service.apiPostCallRequest(RouteURL.clientwiseAccountsList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let response = res?.data;

                    setState((prevState) => ({
                        ...prevState,
                        account_list: response,
                        account_id: response[0]?._id
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
        ProviderWiseReport();
    }, [loadingData, state.search, state.account_id, state.client_id, startDate, endDate])

    const ProviderWiseReport = () => {
        if (state.account_id) {
            let params = JSON.stringify({
                "client_account_id": state.account_id,
                "client_id": state.client_id,
                "start_date": moment(startDate).format('yyyy-MM-DD'),
                "end_date": moment(endDate).format('yyyy-MM-DD'),
                "search": state.search,
                // "limit": state.limit,
                // "page": state.page,
            })

            Service.apiPostCallRequest(RouteURL.providerWiseReport, params, token)
                .then((res) => {
                    if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                        setState((prevState) => ({
                            ...prevState,
                            provider_report: res?.data?.data,
                            provider_sum_report: res?.data?.extraData,
                            currentPage: res?.data?.data.current_page || 1,
                            totalData: res?.data.data?.total_count || 0,
                            totalPages: res?.data?.data.total_pages || 1,

                        }));
                        setOpen(false)
                        setLoadingData(false)

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
    }


    const exportToExcel = () => {
        // Gather all the transactions, including those from all loaded pages
        const ProviderReport = state.provider_report; // This already contains all loaded transactions from all pages

        // Format the data to include only the fields that are displayed in the table
        const formattedData = ProviderReport.map((data, key) => ({
            "SL No": key + 1,
            "Provider": data.provider_name,
            "Total Bet": data.total_bet,
            "Total Win": data.total_win || "-",
            "Total Margin": data.total_margin,
            "Average RTP(%)": data.rtp,
        }));

        // Convert the formatted data to a worksheet
        const ws = XLSX.utils.json_to_sheet(formattedData);

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Append the sheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Provider_Wise_Report");

        // Write the file and trigger download
        XLSX.writeFile(wb, "provider_wise_report.xlsx");
    };

    return (<div >
        <ToastContainer />
        <div className='card shadow-lg rounded' >
            <div className='card-body'>
                <h3 className="hed_txt pt-2">Provider Wise Report</h3>

                <div className="row" style={{ padding: "20px" }}>
                    <div className="col-sm-3 mt-4">
                        <CInputGroup className="mb-3">
                            <CInputGroupText>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                            <CFormInput type="text" autoComplete="off" placeholder="Search By Provider" id="search" value={state.search} onChange={(e) => {
                                e.preventDefault();
                                setState((prevState) => ({
                                    ...prevState, search: e.target.value, page: 1, limit: 10
                                }));
                            }} />
                        </CInputGroup>
                    </div>
                    <div className="col-sm-3">
                        <label>Time Period</label>
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
                    </div>
                    <div className="col-sm-3">
                        <label>Client</label>
                        <select className="form-select mb-1" id="account_id" onChange={(e) => {
                            e.preventDefault();
                            setState((prevState) => ({
                                ...prevState, client_id: e.target.value,
                            }));
                        }}
                            value={state.client_id}
                        >
                            <option value="">Select Client</option>
                            {state.client_list.length > 0 && state.client_list.map((item, key) => (
                                <option value={item._id} key={key} >

                                    {(item?.first_name + ' ' + item?.last_name) + ' ' + '(' + item?.username?.toUpperCase() + ')'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-sm-2">
                        <label>Account</label>
                        <select className="form-select mb-1" id="account_id" onChange={(e) => {
                            e.preventDefault();
                            setState((prevState) => ({
                                ...prevState, account_id: e.target.value,
                            }));
                        }}
                            value={state.account_id}
                        >
                            <option value="">Select Account</option>
                            {state.account_list.length > 0 && state.account_list.map((item, key) => (
                                <option value={item._id} key={key} >{item.account_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-sm-1 d-flex mt-4">
                        <div className="card-header-actions job_export text-end">
                            {state.provider_report?.length > 0 ? (

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={exportToExcel}
                                    style={{ color: "#fff" }}
                                >
                                    Export
                                </button>
                            ) : (
                                ""
                            )}

                        </div>
                    </div>
                </div>



                <div style={{ margin: 10 }} className="tableFixHead">
                    <table className="table table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th style={{ width: "12%" }}>SL No.</th>
                                <th style={{ width: "20%" }}>Provider</th>
                                <th style={{ width: "17%" }}>Total Bet</th>
                                <th style={{ width: "17%" }}>Total Win</th>
                                <th style={{ width: "17%" }}>Total Margin</th>
                                <th style={{ width: "17%" }}>Average RTP(%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.provider_report?.length > 0 ? state.provider_report?.map((data, key) => (
                                <>
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td> {data.provider_name}</td>
                                        <td> {data.total_bet}</td>
                                        <td> {data.total_win}</td>
                                        <td> {data.total_margin}</td>
                                        <td> {data.rtp}%</td>
                                    </tr>
                                </>
                            )) : <tr style={{ textAlign: 'center' }}><td colSpan="6">No data found</td></tr>}
                            {state.provider_report?.length > 0 &&
                                <tr>
                                    <td style={{ fontWeight: 700 }}>Total</td>
                                    <td colSpan={1}></td>
                                    <td style={{ fontWeight: 700 }}> {state.provider_sum_report.sum_total_bet}</td>
                                    <td style={{ fontWeight: 700 }}> {state.provider_sum_report.sum_total_win}</td>
                                    <td style={{ fontWeight: 700 }}> {state.provider_sum_report.sum_total_margin}</td>
                                    <td style={{ fontWeight: 700 }}> {state.provider_sum_report.total_rtp}%</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                <div className="row">
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

        </div>
    </div>)
}