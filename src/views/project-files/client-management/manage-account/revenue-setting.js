
/**
 * @file_purpose  page for showing player list
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
 */
import React, { useState, useEffect, useRef } from "react";
import {
    CButton,
    CFormInput,
} from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Service from "../../../../apis/Service";
import RouteURL from "../../../../apis/ApiURL";
import { Constants } from "../../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';

export default function RevenueSetting() {
    const location = useLocation();
    let navigate = useNavigate();
    const pathName = location.pathname.split("/");
    const token = useSelector((state) => state.user.token);
    const getClientAccountDetails = useSelector((state) => state.client_account_details);
    const [state, setState] = useState({
        provider_list: [],
        provider_resale_price: ''
    })

    useEffect(() => {
        ProviderList()
    }, [])

    const ProviderList = () => {
        let params = JSON.stringify({
            "client_account_id": getClientAccountDetails.accountId
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

    const handleChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value.trimStart(),
        }))
    }

    /* Validation Checking */
    const ValidateForm = (e) => {
        e.preventDefault();
        SubmitGeneralData();
    }
    const SubmitGeneralData = () => {
        let params = JSON.stringify({
            "client_account_id": getClientAccountDetails.accountId,
            "name": state.name,
        })
        Service.apiPostCallRequest(RouteURL.saveAccountTechnicals, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    TechnicalAccountDetails()
                    toast.success(res.message, {
                        position: 'bottom-right',
                        closeOnClick: true,
                    });
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

    const pageNavigate = (e, nav) => {
        if (nav == 'my-account-list') {
            navigate("/my-account-list")
        } else if (nav == 'client-list') {
            navigate("/client-list");
        }


    }
    return (<div >
        <ToastContainer />
        <div style={{ margin: 10 }}>
            <table className="table table-hover">
                <thead className="table-primary">
                    <tr>
                        <th style={{ width: "20%" }}>Sl No</th>
                        <th style={{ width: "40%" }}>Provider Name</th>
                        <th style={{ width: "40%" }}>Provider Wise Resale Price(%)</th>
                    </tr>
                </thead>
                <tbody>
                    {state.provider_list.length > 0 ? state.provider_list.map((data, key) => (
                        <tr key={key}>
                            <td>{key + 1}</td>
                            <td>{data.provider_details?.provider_name}</td>
                            <td>
                                <CFormInput type="text" name="provider_resale_price" id="provider_resale_price"
                                    onChange={handleChange}
                                    placeholder="Enter price" value={state.provider_resale_price}></CFormInput>
                            </td>
                        </tr >
                    )) : <tr style={{ textAlign: 'center' }}><td colSpan="3">No data found</td></tr>}


                </tbody>
            </table>

            <span className="d-flex justify-content-end">
                <CButton className="btn btn-secondary"
                    style={{ color: "#fff", marginRight: 4 }}
                    onClick={(e) => pageNavigate(e, pathName[1])}
                >Cancel</CButton>
                <CButton color="primary"
                    type="submit"
                    onClick={ValidateForm}
                >
                    Submit</CButton>
            </span>
        </div>
    </div>)
}