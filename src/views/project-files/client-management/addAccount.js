import React, { useState, useEffect } from "react";
import {
    CButton,
    CForm,
    CFormInput,
    CInputGroup,
    CFormSelect,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Currency } from "../../../redux/slices/superAdminStateSlice";

export default function AddClientAccount(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const client_id = props?.allData?.client_id;
    const token = useSelector((state) => state.user.token);
    const [isDisabled, setIsDisabled] = useState(false);
    const [state, setState] = useState({
        list: [],
        client_id: client_id,
        account_name: props?.allData.type == "add" ? '' : props?.allData.accountDetails.account_name,
        currency_code_id: props?.allData.type == "add" ? '' : props?.allData.accountDetails.currency_code_id,
        regionlist: [],
        region_id: props?.allData.type == "add" ? '' : props?.allData.accountDetails.region_id,
    });
    const [errorMsg, setErrorMsg] = useState({
        account_name: "",
        currency_code_id: "",
        region_id: "",
    });

    useEffect(() => {
        CurrencyList();
        RegionList();
    }, []);
    const CurrencyList = () => {
        Service.apiPostCallRequest(RouteURL.clientAccountWiseCurrencyList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let currencies = res.data;
                    // Update the `state.list` with fetched currencies
                    setState((prevState) => ({
                        ...prevState,
                        list: currencies, // Set the currency list to `state.list`
                    }));
                    dispatch(Currency({ currencies }));
                } else {
                    toast.error(res.message, {
                        position: "bottom-right",
                        autoClose: true,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };

    const RegionList = () => {
        Service.apiPostCallRequest(RouteURL.regionList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    // Update the `state.regionlist` with fetched regions
                    setState((prevState) => ({
                        ...prevState,
                        regionlist: res.data,
                    }));
                } else {
                    toast.error(res.message, {
                        position: "bottom-right",
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };
    const handleChange = (e) => {
        const { id, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [id]: value.trimStart(),
        }));
    };

    /* Validation Checking */
    const ValidateForm = (e) => {
        e.preventDefault();

        if (handleValidation()) {
            AddSubmitAccount();
        }
    };

    /* Validate all fields */
    const handleValidation = () => {
        let formIsValid = true;

        //Name
        if (!state.account_name) {
            formIsValid = false;
            setErrorMsg((prevState) => ({
                ...prevState,
                account_name: `${ERROR_MESSAGE["accountnameRequired"]}`,
            }));
        } else {
            setErrorMsg((prevState) => ({
                ...prevState,
                account_name: "",
            }));
        }

        if (!state.currency_code_id) {
            formIsValid = false;
            setErrorMsg((prevState) => ({
                ...prevState,
                currency_code_id: `${ERROR_MESSAGE["currencycodeidRequired"]}`,
            }));
        } else {
            setErrorMsg((prevState) => ({
                ...prevState,
                currency_code_id: "",
            }));
        }

        if (!state.region_id) {
            formIsValid = false;
            setErrorMsg((prevState) => ({
                ...prevState,
                region_id: `${ERROR_MESSAGE["regionIdRequired"]}`,
            }));
        } else {
            setErrorMsg((prevState) => ({
                ...prevState,
                region_id: "",
            }));
        }

        return formIsValid;
    };

    const AddSubmitAccount = () => {
        if (props?.allData.type == "add") {
            let params = JSON.stringify({
                client_id: client_id,
                account_name: state.account_name,
                currency_code_id: state.currency_code_id,
                region_id: state.region_id,
                status: "active",
            });
            Service.apiPostCallRequest(RouteURL.addClientAccount, params, token)
                .then((res) => {
                    setIsDisabled(false);
                    if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                        toast.success(res.message, {
                            position: "bottom-right",
                            closeOnClick: true,
                        });
                        props.onclose();
                    } else {
                        toast.error(res.message, {
                            position: "bottom-right",
                            autoClose: false,
                        });
                    }
                })
                .catch((error) => {
                    setIsDisabled(false);
                    toast.error(error.response.data.message, {
                        position: "bottom-right",
                        autoClose: false,
                    });

                });
        } else {
            let params = JSON.stringify({
                client_id: client_id,
                account_name: state.account_name,
                currency_code_id: state.currency_code_id,
                region_id: state.region_id,
                status: "active",
                account_id: props?.allData.accountDetails._id
            });
            Service.apiPutCallRequest(RouteURL.UpdateClientAccount, params, token)
                .then((res) => {
                    setIsDisabled(false);
                    if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                        toast.success(res.message, {
                            position: "bottom-right",
                            closeOnClick: true,
                        });
                        props.onclose();
                    } else {
                        toast.error(res.message, {
                            position: "bottom-right",
                            autoClose: false,
                        });
                    }
                })
                .catch((error) => {
                    setIsDisabled(false);
                    toast.error(error.response.data.message, {
                        position: "bottom-right",
                        autoClose: false,
                    });

                });
        }
    };

    return (
        <div className="mb-3">
            <CForm
                className="justify-content-center"
                style={{ margin: 10 }}
                onSubmit={ValidateForm}
            >
                <div className="row">
                    <div className="col-6">
                        <label>
                            Account Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <CInputGroup>
                            <CFormInput
                                type="text"
                                placeholder="Enter account name"
                                id="account_name"
                                autoComplete="off"
                                value={state.account_name}
                                onChange={handleChange}
                            />
                        </CInputGroup>
                        <span
                            style={{
                                color: "red",
                            }}
                        >
                            {errorMsg.account_name}
                        </span>
                    </div>
                    <div className="col-6">
                        <label>
                            Currency <span style={{ color: "red" }}>*</span>
                        </label>
                        <CFormSelect
                            aria-label="Default select example"
                            id="currency_code_id"
                            onChange={handleChange}
                            value={state.currency_code_id}
                        >
                            <option value="">Select Currency</option>
                            {state?.list?.length > 0 &&
                                state?.list?.map((list, key) => (
                                    <option value={list.currency_code_id} key={key}>
                                        {list.currency_code?.toUpperCase()}
                                    </option>
                                ))}
                        </CFormSelect>
                        <span style={{ color: "red" }}>{errorMsg.currency_code_id}</span>
                    </div>
                    <div className="col-6">
                        <label>
                            Region <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={handleChange}
                            id="region_id"
                            value={state.region_id}
                        >
                            <option value="">Select Region</option>
                            {state.regionlist.map((item, key) => (
                                <option value={item._id} key={key}>
                                    {item.region_name}
                                </option>
                            ))}
                        </select>
                        <span style={{ color: "red" }}>{errorMsg.region_id}</span>
                    </div>
                </div>
                <span style={{}} className="d-flex justify-content-end">
                    <CButton
                        className="btn btn-secondary"
                        style={{ color: "#fff", marginRight: 4 }}
                        onClick={() => {
                            navigate(location.pathname);
                            props.onclose();
                        }}
                    >
                        Cancel
                    </CButton>
                    <CButton
                        color="primary"
                        type="submit"
                        disabled={isDisabled ? true : false}
                        style={{ marginRight: 4 }}
                    >
                        Save
                    </CButton>
                </span>
            </CForm>
        </div>
    );
}
