
/**
 * @file_purpose  page for showing provider wise report
 * @author Sucheta Singha
 * @Date_Created 29.01.2025
 * @Date_Modified 29.01.2025
 */
import React, { useState, useEffect, useRef } from "react";
import {
    CButton,
    CCard,
    CCol,
    CRow, CInputGroupText,
    CInputGroup, CFormInput, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CTooltip,
    CFormTextarea, CFormSwitch
} from '@coreui/react'
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import Export from "src/assets/images/export.png";
import moment from 'moment';
import * as XLSX from "xlsx";
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl, Form } from 'react-bootstrap'
import { Drawer, Button, Box } from "@mui/material";

export default function CategoryWiseReport() {
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
        category_report: [],
        client_id: '',
        client_list: [],
        account_list: [],
        search: '',
        account_id: '',
        userType: "Client",
        is_recursive: 0,
        lower_client_list: [],
        lower_client_id: '',
        search_button: false,
        category_sum_report: {},
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
        if (state?.client_id) {
            AccountListDetails();
            LowerClientListDetails();
        }
    }, [state.client_id, state.lower_client_id])


    const LowerClientListDetails = () => {
        let params = JSON.stringify({
            "client_id": state.client_id,
        })
        Service.apiPostCallRequest(RouteURL.allClientList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        lower_client_list: res?.data,
                        // lower_client_id: res?.data[0]?._id
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
            "client_id": state.userType == 'Client' ? state.client_id : (state.lower_client_id ? state.lower_client_id : state.client_id)
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
        CategoryWiseReport();
    }, [loadingData, state.search, state.search_button])

    const CategoryWiseReport = () => {
        if (state.account_id) {
            let params = JSON.stringify({
                "client_account_id": state.account_id,
                "client_id": state.client_id,
                "start_date": moment(startDate).format('yyyy-MM-DD'),
                "end_date": moment(endDate).format('yyyy-MM-DD'),
                "search": state.search,
            })

            Service.apiPostCallRequest(RouteURL.categoryWiseReport, params, token)
                .then((res) => {
                    if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                        setState((prevState) => ({
                            ...prevState,
                            category_report: res?.data?.data,
                            category_sum_report: res?.data?.extraData,

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
        const CategoryReport = state.category_report; // This already contains all loaded transactions from all pages

        // Format the data to include only the fields that are displayed in the table
        const formattedData = CategoryReport.map((data, key) => ({
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
        XLSX.utils.book_append_sheet(wb, ws, "Category_Wise_Report");

        // Write the file and trigger download
        XLSX.writeFile(wb, "caegory_wise_report.xlsx");
    };


    const handleChangeFilter = (e) => {
        var newValue
        if (e.target.type === "checkbox") {
            const { id, checked } = e.target
            newValue = checked ? 1 : 0
            setState(prevState => ({
                ...prevState,
                [id]: newValue
            }))

        } else {
            const { id, value } = e.target;
            setState(prevState => ({
                ...prevState,
                [id]: value,
            }))
        }
    }

    const SearchClick = (e) => {
        e.preventDefault();
        setState((prevState) => ({
            ...prevState, search_button: true,
        }));
    }


    return (<div >
        <ToastContainer />
        <div className='card shadow-lg rounded' >
            <div className='card-body'>
                <h3 className="hed_txt pt-2">Category Wise Report</h3>


                <div className='row p-3'>
                    <div className="col-sm-3 mt-4">
                        <CInputGroup className="mb-3">
                            <CInputGroupText>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                            <CFormInput type="text" autoComplete="off" placeholder="Search Category Report" id="search" value={state.search} onChange={(e) => {
                                e.preventDefault();
                                setState((prevState) => ({
                                    ...prevState, search: e.target.value, page: 1, limit: 10
                                }));
                            }} />
                        </CInputGroup>
                    </div>
                    <div className="col-sm-3 mt-4">
                    
                    </div>
                    <div className="col-sm-3  mt-4">
                        <div className="card-header-actions job_export text-end">
                            {state.category_report?.length > 0 ? (

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={exportToExcel}
                                    style={{ color: "#fff", }}
                                >
                                    Export
                                </button>
                            ) : (
                                ""
                            )}

                        </div>
                    </div>

                    <div className="col-sm-3 mt-4">
                        <div className="card-header-actions job_export text-end">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => setOpen(true)}
                                style={{ color: "#fff" }}
                            >
                                Filter
                            </button>

                        </div>

                    </div>

                </div>

                <div>
                    <Drawer
                        anchor="right" // Can be "left", "top", or "bottom"
                        open={open}
                        onClose={() => setOpen(false)}
                        sx={{ "& .MuiDrawer-paper": { width: "800px" } }} // ✅ Sets drawer width
                    >
                        {/* Header with Close Button */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "16px",
                                borderBottom: "1px solid #ddd",
                                backgroundColor: "#f5f5f5",
                            }}
                        >
                            <span variant="h6">Category Wise Report Filter</span>
                            <Button onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </Box>

                        {/* Drawer Content */}
                        <Box sx={{ padding: "16px", width: "800px" }}>
                            <div className="row mt-2">
                                <div className='col-md-6'>
                                    <label>Select an Option</label>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="userType" onChange={handleChangeFilter} checked={state.userType == 'Client'} value='Client' />
                                                <label className="form-check-label" htmlFor="flexRadioDefault">
                                                    Client
                                                </label>
                                            </div>
                                        </div>

                                        <div className='col-md-6'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="userType" onChange={handleChangeFilter} checked={state.userType == 'SubClient'} value='SubClient' />
                                                <label className="form-check-label" htmlFor="flexRadioDefault">
                                                    Sub-Client
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <label>Recursive</label>
                                    <CFormSwitch
                                        className="mr-1"
                                        color="primary"
                                        name="is_recursive"
                                        id="is_recursive"
                                        checked={parseInt(state.is_recursive)}
                                        onChange={handleChangeFilter}
                                    />
                                </div>
                            </div>


                            <div className="col-md-12 mt-3">
                                <label>Upper Level Client</label>
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

                            {state.userType == 'SubClient' &&
                                <div className="col-md-12 mt-3">
                                    <label>Lower Level Client</label>
                                    <select className="form-select mb-1" id="lower_client_id" onChange={(e) => {
                                        e.preventDefault();
                                        setState((prevState) => ({
                                            ...prevState, lower_client_id: e.target.value,
                                        }));
                                    }}
                                        value={state.lower_client_id}
                                    >
                                        <option value="">Select Client</option>
                                        {state.lower_client_list.length > 0 && state.lower_client_list.map((item, key) => (
                                            <option value={item._id} key={key} >

                                                {(item?.first_name + ' ' + item?.last_name) + ' ' + '(' + item?.username?.toUpperCase() + ')'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            }

                            <div className="col-md-12 mt-3">
                                <label>{state.userType == 'Client' ? 'Upper Level Client Account' : 'Lower Level Client Account'}</label>
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
                            <div className="col-md-12 mt-3">
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
                            <div className="col-md-12 d-flex justify-content-center mt-4">
                                <CButton className="cancel"
                                    color="primary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setState((prevState) => ({
                                            ...prevState, search_button: !state.search_button,
                                        }));
                                    }}

                                    style={{
                                        width: "150px",  // Set the fixed width
                                        height: "40px",  // Set the fixed height
                                        padding: "px",   // Optional: remove extra padding to align text properly
                                    }}
                                >
                                    Search
                                </CButton>
                            </div>




                        </Box>
                    </Drawer>
                </div>



                <div style={{ margin: 10 }} className="tableFixHead">
                    <table className="table table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>SL No.</th>
                                <th>Provider</th>
                                <th>Category</th>
                                <th>Total Bet</th>
                                <th>Total Win</th>
                                <th>Total Margin</th>
                                <th>Average RTP (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.category_report?.length > 0 ? state.category_report?.map((data, key) => (
                                <>
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td> {data.provider_name}</td>
                                        <td>{data.category_name}</td>
                                        <td> {data.total_bet}</td>
                                        <td> {data.total_win}</td>
                                        <td> {data.total_margin}</td>
                                        <td> {data.rtp}%</td>
                                    </tr>
                                </>
                            )) : <tr style={{ textAlign: 'center' }}><td colSpan="7">No data found</td></tr>}
                            {state.category_report?.length > 0 &&
                                <tr>
                                    <td style={{ fontWeight: 700 }}>Total</td>
                                    <td colSpan={2}></td>
                                    <td style={{ fontWeight: 700 }}> {state.category_sum_report.sum_total_bet}</td>
                                    <td style={{ fontWeight: 700 }}> {state.category_sum_report.sum_total_win}</td>
                                    <td style={{ fontWeight: 700 }}> {state.category_sum_report.sum_total_margin}</td>
                                    <td style={{ fontWeight: 700 }}> {state.category_sum_report.total_rtp}%</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>)
}