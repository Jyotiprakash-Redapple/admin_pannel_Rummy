
/**
 * @file_purpose  page for showing player list
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
 */
import React, { useState, useEffect } from "react";
import {
    CButton,
    CCol,
    CFormLabel,
CFormInput, CFormSelect,
} from '@coreui/react'
import { useDispatch, useSelector } from "react-redux";
import Service from "../../../../apis/Service";
import RouteURL from "../../../../apis/ApiURL";
import { useLocation ,useNavigate} from 'react-router-dom';
import { technicalDetails } from "src/redux/slices/superAdminStateSlice.js";
import { Constants } from "../../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import MasterData from "../../../../Utility/MasterData";

export default function GeneralList() {
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();
    const location = useLocation();
     let navigate = useNavigate();
    const pathName = location.pathname.split("/");
    const getTechnicalDetails = useSelector((state) => state.technical_details);
    const getClientAccountDetails = useSelector((state) => state.client_account_details);
    const [state, setState] = useState({
        accountData: {},
        name: getTechnicalDetails.name ? getTechnicalDetails.name : "",
        standard_resale_price: getTechnicalDetails.standard_resale_price ? getTechnicalDetails.standard_resale_price : "",
        credit_limit_threshold: getTechnicalDetails.credit_limit_threshold ? getTechnicalDetails.credit_limit_threshold : "",
        maintainance_mode: getTechnicalDetails.maintainance_mode ? getTechnicalDetails.maintainance_mode : "on"
    })
    const [errorSatate, setErrorState] = useState({
        nameError: '',
        thresholdError: '',
        standardResaleError: '',
    })


    const handleChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value.trimStart(),
        }))
    }

    useEffect(() => {
        ClientAccountDetails()
    }, [])

    /**
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
  * @function sync
  * @functionName ClientAccountDetails
  * @functionPurpose this function for client list.
  *
  * @functionParam {payload object:filter_field,limit,page,}
  * 
  * @functionSuccess Success status and message.
  *
  * @functionError {Boolean} error error is there.
  * @functionError {String} message  Description message.
  */
    const ClientAccountDetails = () => {
        let params = JSON.stringify({
            "account_id": getClientAccountDetails.accountId
        })

        Service.apiPostCallRequest(RouteURL.clientAccountDetails, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {

                    setState(prevState => ({
                        ...prevState,
                        accountData: res.data.account_details,
                    }))

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

    /* Validate all fields */
    const handleValidation = (e) => {
        let formIsValid = true;

        //name
        if (!state.name) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                nameError: 'Name is required',
            }));
        } else setErrorState((prevState) => ({
            ...prevState,
            nameError: '',
        }));

        //credit_limit_threshold
        if (!state.credit_limit_threshold) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                thresholdError: 'Credit limit threshold is required',
            }));
        } else setErrorState((prevState) => ({
            ...prevState,
            thresholdError: '',
        }));

        //standard_resale_price
        if (!state.standard_resale_price) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                standardResaleError: 'Standard resale proice is required',
            }));
        } else setErrorState((prevState) => ({
            ...prevState,
            standardResaleError: '',
        }));
        return formIsValid;
    }

    /* Validation Checking */
    const ValidateForm = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            SubmitGeneralData();
        }
    }
    const SubmitGeneralData = () => {
        let params = JSON.stringify({
            "client_account_id": getClientAccountDetails.accountId,
            "name": state.name,
            "credit_limit_threshold": state.credit_limit_threshold,
            "standard_resale_price": state.standard_resale_price,
            "maintainance_mode": state.maintainance_mode,
            "api_secret_key": getTechnicalDetails.api_secret_key,
            "service_endpoint": getTechnicalDetails.service_endpoint,
            "ip_details": getTechnicalDetails.ip_details,
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

    const TechnicalAccountDetails = () => {
        let params = JSON.stringify({
            "client_account_id": getClientAccountDetails.accountId
        })

        Service.apiPostCallRequest(RouteURL.getTechnicalAccountDetails, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    dispatch(technicalDetails(res.data));

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

    const pageNavigate = (e, nav) => {
        if (nav == 'my-account-list') {
            navigate("/my-account-list")
        } else if (nav == 'client-list') {
            navigate("/client-list");
        }
    }

    return (<div >
        <ToastContainer />
        <div className="comp_inner_sec">
            <div className="comp_off_inn" style={{ padding: 10 }}>
                <div className="row">
                    <CCol md="3">
                        <CFormLabel htmlFor="text-input">Name <span style={{ color: "red" }}>*</span></CFormLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                        <CFormInput type="text" name="name" id="name" onChange={handleChange} placeholder="Enter name" value={state.name}></CFormInput>
                        <span style={{ color: "red" }}>{errorSatate.nameError}</span>
                    </CCol>
                </div>
            </div>

            <div className="comp_off_inn" style={{ padding: 10 }}>
                <div className="row">
                    <CCol md="3">
                        <CFormLabel>Currency <span style={{ color: "red" }}>*</span></CFormLabel>
                    </CCol>
                    <CCol md="9">
                        <CFormInput type="text" value={state.accountData?.currency_details != undefined && state.accountData?.currency_details?.currency_code.toUpperCase()}></CFormInput>
                    </CCol>
                </div>
            </div>

            <div className="comp_off_inn" style={{ padding: 10 }}>
                <div className="row">
                    <CCol md="3">
                        <CFormLabel>Available Credit Limit <span style={{ color: "red" }}>*</span></CFormLabel>
                    </CCol>
                    <CCol md="9">
                        <CFormInput type="text" value={state.accountData?.available_balance}></CFormInput>
                    </CCol>
                </div>
            </div>

            <div className="comp_off_inn" style={{ padding: 10 }}>
                <div className="row">
                    <CCol md="3">
                        <CFormLabel>Credit Limit Threshold <span style={{ color: "red" }}>*</span></CFormLabel>
                    </CCol>
                    <CCol md="9">
                        <CFormInput type="text" name="credit_limit_threshold" id="credit_limit_threshold" onChange={handleChange} placeholder="Enter credit limit" value={state.credit_limit_threshold}></CFormInput>
                        <span style={{ color: "red" }}>{errorSatate.thresholdError}</span>
                    </CCol>
                </div>
            </div>

            <div className="comp_off_inn" style={{ padding: 10 }}>
                <div className="row">
                    <CCol md="3">
                        <CFormLabel>Standard Resale Price (%) <span style={{ color: "red" }}>*</span></CFormLabel>
                    </CCol>
                    <CCol md="9">
                        <CFormInput type="text" name="standard_resale_price" id="standard_resale_price" onChange={handleChange} placeholder="Enter resale price" value={state.standard_resale_price}></CFormInput>
                        <span style={{ color: "red" }}>{errorSatate.standardResaleError}</span>
                    </CCol>
                </div>
            </div>

            <div className="comp_off_inn" style={{ padding: 10 }}>
                <div className="row">
                    <CCol md="3">
                        <CFormLabel>Maintanance Mode <span style={{ color: "red" }}>*</span></CFormLabel>
                    </CCol>
                    <CCol md="9">
                        <CFormSelect custom name="maintainance_mode" id="maintainance_mode" value={state.maintainance_mode}
                            onChange={handleChange}
                            required

                        >
                            {MasterData.maintainance_mode.map((item, index) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </CFormSelect>
                    </CCol>
                </div>
            </div>

            <span className="d-flex justify-content-end">
                <CButton className="btn btn-secondary"
                    style={{ color: "#fff", marginRight: 4 }}
                    onClick={(e) => pageNavigate(e, pathName[1])}
                >Cancel</CButton>
                <CButton color="primary"
                    type="submit" onClick={ValidateForm}> Submit</CButton>
            </span>

        </div>
    </div >)
}