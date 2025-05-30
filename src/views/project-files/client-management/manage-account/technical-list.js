
/**
 * @file_purpose  page for showing player list
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
 */
import React, { useState } from "react";
import {
    CButton,
    CCol,
    CFormLabel,
    CInputGroup, CFormInput,
} from '@coreui/react'
import { useDispatch, useSelector } from "react-redux";
import Service from "../../../../apis/Service";
import RouteURL from "../../../../apis/ApiURL";
import { useLocation, useNavigate } from 'react-router-dom';
import { Constants } from "../../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { technicalDetails } from "src/redux/slices/superAdminStateSlice.js";
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function TechnicalList() {
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate = useNavigate();
    const pathName = location.pathname.split("/");
    const getClientAccountDetails = useSelector((state) => state.client_account_details);
    const getTechnicalDetails = useSelector((state) => state.technical_details);
    const [errorSatate, setErrorState] = useState({
        apiSecretKeyError: '',
        serviceEndpointError: '',
        whitelistedIPError: ''
    })
    const [state, setState] = useState({
        api_secret_key: getTechnicalDetails.api_secret_key ? getTechnicalDetails.api_secret_key : "",
        service_endpoint: getTechnicalDetails.service_endpoint ? getTechnicalDetails.service_endpoint : "",
        copied: false
    })

    //For Whitelisted IP
    const [whitelistedIPInputFields, setWhitelistedIPInputFields] = useState(getTechnicalDetails.ip_details?.length > 0 ?
        getTechnicalDetails.ip_details :
        [
            { _id: 0, whitelisted_ip: "", is_deleted: 0 },
        ]);


    //Add more for IP
    const addIPInputField = () => {
        setWhitelistedIPInputFields([
            ...whitelistedIPInputFields,
            {
                _id: 0, whitelisted_ip: "", is_deleted: 0
            },
        ]);
    };

    const removeIPInputFields = (e, index, ip_id) => {
        e.preventDefault();
        const rows = [...whitelistedIPInputFields];

        if (ip_id === 0) {
            rows.splice(index, 1);
        } else {
            // Create a shallow copy of the object before modifying it
            rows[index] = { ...rows[index], is_deleted: 1 };
        }
        setWhitelistedIPInputFields(rows);
    };

    const handleChangeIP = (index, evnt) => {
        const { name, value } = evnt.target;
        const list = [...whitelistedIPInputFields];
        list[index] = { ...list[index], whitelisted_ip: value };
        setWhitelistedIPInputFields(list);
    };

    //Add more for IP


    const handleChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value.trimStart(),
        }))
    }

    /* genarate password*/
    const GenarateSecretKey = (e) => {
        e.preventDefault();
        let generatedCode;
        const segmentLength = 5; // Length of each segment
        const numSegments = 4;  // Number of segments
        const delimiter = "-"; // Separator between segments

        let code = [];
        for (let i = 0; i < numSegments; i++) {
            let segment = "";
            for (let j = 0; j < segmentLength; j++) {
                segment += Math.floor(Math.random() * 10); // Random digit between 0 and 9
            }
            code.push(segment);
        }

        generatedCode = code.join(delimiter);
        setState(prevState => ({
            ...prevState,
            api_secret_key: generatedCode
        }));
    };

    const onCopy = React.useCallback(() => {
        setState(prevState => ({
            ...prevState,
            copied: true,
        }))
    }, [])

    /* Validate all fields */
    const handleValidation = (e) => {
        let formIsValid = true;

        //name
        if (!state.api_secret_key) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                apiSecretKeyError: 'API secret key is required',
            }));
        } else setErrorState((prevState) => ({
            ...prevState,
            apiSecretKeyError: '',
        }));

        //service_endpoint
        if (!state.service_endpoint) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                serviceEndpointError: 'Service endpoint is required',
            }));
        } else setErrorState((prevState) => ({
            ...prevState,
            serviceEndpointError: '',
        }));

        //Skill errors
        whitelistedIPInputFields.map((item, index) => {
            if (item.whitelisted_ip === "") {
                formIsValid = false;
                setErrorState((prevState) => ({
                    ...prevState,
                    whitelistedIPError: 'Whitelisted ip is required',
                }));
            } else setErrorState((prevState) => ({
                ...prevState,
                whitelistedIPError: '',
            }));

        })
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
            "api_secret_key": state.api_secret_key,
            "service_endpoint": state.service_endpoint,
            "ip_details": whitelistedIPInputFields,
            "name": getTechnicalDetails.name,
            "credit_limit_threshold": getTechnicalDetails.credit_limit_threshold,
            "standard_resale_price": getTechnicalDetails.standard_resale_price,
            "maintainance_mode": getTechnicalDetails.maintainance_mode,
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
                        <CFormLabel htmlFor="text-input">API Secret Key <span style={{ color: "red" }}>*</span></CFormLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                        <CInputGroup className="mb-1">
                            <CFormInput type="text" name="api_secret_key" id="api_secret_key" value={state.api_secret_key}></CFormInput>

                            <CButton
                                color="primary"
                                onClick={GenarateSecretKey}
                                style={{ marginRight: 3 }}
                            >
                                Generate
                            </CButton>
                            <div>
                                <CopyToClipboard
                                    text={state.api_secret_key}
                                    onCopy={onCopy}
                                >
                                    <button type="button" className="btn btn-light">
                                        {!state.copied ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-copy"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-check-lg"
                                                viewBox="0 0 16 16"
                                                color="#1b9e3e"
                                            >
                                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                            </svg>
                                        )}
                                    </button>
                                </CopyToClipboard>

                            </div>
                            <span style={{ color: "red" }}>{errorSatate.apiSecretKeyError}</span>
                        </CInputGroup>
                    </CCol>
                </div>
            </div>

            <div className="comp_off_inn" style={{ padding: 10 }}>
                <div className="row">
                    <CCol md="3">
                        <CFormLabel>Service Endpoint <span style={{ color: "red" }}>*</span></CFormLabel>
                    </CCol>
                    <CCol md="9">
                        <CFormInput type="text" name="service_endpoint" id="service_endpoint" onChange={handleChange} placeholder="Enter service endpoint" value={state.service_endpoint}></CFormInput>
                        <span style={{ color: "red" }}>{errorSatate.serviceEndpointError}</span>
                    </CCol>
                </div>
            </div>

            <div className="comp_off_inn" style={{ padding: 10 }}>
                <div className="row">
                    <CCol md="3">
                        <CFormLabel>Whitelisted IP's <span style={{ color: "red" }}>*</span></CFormLabel>
                    </CCol>
                    <CCol md="9">


                        <div className="skill_sec">
                            <div className="row">
                                <div className="col-md-12">
                                    {/* Add  IP's*/}
                                    {whitelistedIPInputFields.map((data, index) => {
                                        const { whitelisted_ip, _id } = data;
                                        let newRowLen = whitelistedIPInputFields.filter(e => (e.is_deleted == 0))
                                        let rowLen = newRowLen.length;
                                        var vIndex = -1;
                                        if (data.is_deleted == 0) {
                                            vIndex = index
                                        } else {
                                            vIndex = vIndex
                                        }
                                        var lastIndex = whitelistedIPInputFields && whitelistedIPInputFields.indexOf(whitelistedIPInputFields.filter(item => item.is_deleted === 0).pop())
                                        return (
                                            <>
                                                {data.is_deleted == 0 ?
                                                    <div className="row mb-3">
                                                        <div className="col-sm-12 col-xxl-9 col-xl-9 col-lg-9 col-md-9">
                                                            <div className="skill_mid">
                                                                <CFormInput
                                                                    type="text"
                                                                    placeholder="Enter ip address"
                                                                    value={whitelisted_ip}
                                                                    onChange={(event) => handleChangeIP(index, event)}
                                                                    name="whitelisted_ip"
                                                                />
                                                                {rowLen === index + 1 ?
                                                                    <span style={{ color: "red" }}>{errorSatate.whitelistedIPError}</span>
                                                                    : ""}
                                                            </div>
                                                        </div>


                                                        <div className="col-sm-12 col-xxl-3 col-xl-3 col-lg-3 col-md-3">
                                                            <div className="skill_mid">
                                                                {rowLen !== 1 ? (
                                                                    <button
                                                                        className="btn skill_cancel"
                                                                        onClick={(event) =>
                                                                            removeIPInputFields(event, index, data._id)
                                                                        }
                                                                    >
                                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                                    </button>
                                                                ) : (
                                                                    ""
                                                                )}

                                                                {lastIndex == index ?

                                                                    <CButton
                                                                        color="primary"
                                                                        onClick={addIPInputField}
                                                                    >
                                                                        Add More
                                                                    </CButton>



                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ""}
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
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