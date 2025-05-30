import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CForm,
    CInputGroup,
    CFormInput, CButton,
} from '@coreui/react';
import { useDispatch, useSelector } from "react-redux";
import { leftTrim } from "../../../Utility/helper";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { currencyWiseAmount, clientAccountTransferBalanceDetails } from "../../../redux/slices/superAdminStateSlice";
import Swal from 'sweetalert2';

export default function ClientTransferBalance() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);
    const client_account_transfer_balance = useSelector((state) => state.clientAccountTransferBalance);
    const { accountCurrency, accountId, available_balance, clientName, account_name } = client_account_transfer_balance;
    const client_currency_account_details = useSelector((state) => state.currency_account_details);
    const [isDisabled, setIsDisabled] = useState(false);
    const [state, setState] = useState({
        credit_balance: "",
        debit_balance: "",
    });
    const [errorMsg, setErrorMsg] = useState({ credit_balance: "", debit_balance: "" });

    const handleChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [id]: leftTrim(value)
        }));
    };

    const WalletBalance = (accountId) => {
        let params = JSON.stringify({
            account_id: client_currency_account_details._id,
        });

        Service.apiPostCallRequest(
            RouteURL.accountWiseWalletBalance,
            params,
            token
        )
            .then((res) => {
                setIsDisabled(false);
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    if (res?.data) {
                        let totalAmount = res.data?.available_balance || 0;
                        dispatch(currencyWiseAmount(totalAmount));
                    } else {
                    }
                } else {
                    toast.error(res.message || "An error occurred.", {
                        position: "bottom-right",
                        autoClose: true,
                    });
                }
            })
            .catch((error) => {
                setIsDisabled(false);
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });
            });
    };

    const ValidateForm = (e, type) => {
        e.preventDefault();
        if (handleValidation(type)) {
            if (type === 'credit') _accountBalanceCreditDebit(type);
            else handleShow(e);
        }
    };

    const handleValidation = (type) => {
        let formIsValid = true;

        if (!state.credit_balance && type === 'credit') {
            formIsValid = false;
            setErrorMsg(prevState => ({
                ...prevState,
                credit_balance: ERROR_MESSAGE['creditBalanceRequired']
            }));
        } else {
            setErrorMsg(prevState => ({
                ...prevState,
                credit_balance: ""
            }));
        }

        if (!state.debit_balance && type === 'debit') {
            formIsValid = false;
            setErrorMsg(prevState => ({
                ...prevState,
                debit_balance: ERROR_MESSAGE['debitBalanceRequired']
            }));
        } else {
            setErrorMsg(prevState => ({
                ...prevState,
                debit_balance: ""
            }));
        }

        return formIsValid;
    };

    const _accountBalanceCreditDebit = (type, value = "", note = "") => {
        const params = JSON.stringify({
            account_id: accountId,
            transaction_type: type,
            amount: type === 'credit' ? Number(state.credit_balance) : Number(state.debit_balance),
            password: type === 'debit' ? value : "",
            note: note || "Default Note"
        });

        setIsDisabled(true);

        Service.apiPostCallRequest(RouteURL.transferBalancetoClientAccount, params, token)
            .then((res) => {
                setIsDisabled(false);
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    const new_balance = type === 'credit'
                        ? available_balance + Number(state.credit_balance)
                        : available_balance - Number(state.debit_balance);

                    dispatch(clientAccountTransferBalanceDetails({
                        accountCurrency,
                        accountId,
                        available_balance: new_balance,
                        account_name,
                        clientName
                    }));
                    WalletBalance(accountId)
                    setState({ credit_balance: '', debit_balance: '' });

                    Swal.fire({
                        text: res.message,
                        icon: "success"
                    });
                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                setIsDisabled(false);
                const errorMsg = error.response?.data?.message || "An error occurred";
                toast.error(errorMsg, {
                    position: 'bottom-right',
                    autoClose: false,
                });
            });
    };

    const handleShow = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: "question",
            title: "Are you sure you want to deduct balance?",
            input: "password",
            inputLabel: "Please enter the password for confirmation",
            inputPlaceholder: "Enter your password",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return ERROR_MESSAGE['passwordRequired'];
                } else {
                    confirmSubmit(value);
                }
            }
        });
    };

    const confirmSubmit = (value) => {
        const userNote = prompt("Enter a note for the transaction:", "Default Note");
        _accountBalanceCreditDebit('debit', value, userNote);
    };

    return (
        <div className="row">
            <ToastContainer />
            <h4 className="hed_txt pt-2">
                Transfer Balance of {clientName} for {account_name} account
            </h4>
            <div className="col-6">
                <div className="card">
                    <div className="card-body">
                        <CForm className="justify-content-center" style={{ margin: 10 }}>
                            <div className="row">
                                <div className="col-12">
                                    <label>
                                        Current Available Credit Limit (
                                        {(accountCurrency || "N/A").toUpperCase()})
                                    </label>
                                    <CInputGroup className="mb-3">
                                        <CFormInput
                                            type="number"
                                            placeholder="Current balance"
                                            value={available_balance}
                                            disabled
                                        />
                                    </CInputGroup>
                                </div>
                                <div className="col-12">
                                    <label>
                                        Credit Amount <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <CInputGroup className="mb-3">
                                        <CFormInput
                                            type="number"
                                            placeholder="0.00"
                                            id="credit_balance"
                                            autoComplete="off"
                                            value={state.credit_balance}
                                            onChange={handleChange}
                                        />
                                    </CInputGroup>
                                    <span style={{ color: "red" }}>{errorMsg.credit_balance}</span>
                                </div>
                            </div>
                            <span className="d-flex justify-content-center">
                                <CButton
                                    className="btn btn-secondary"
                                    style={{ color: "#fff", marginRight: 4 }}
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </CButton>
                                <CButton
                                    onClick={(e) => ValidateForm(e, "credit")}
                                    disabled={isDisabled}
                                    color="success"
                                    style={{
                                        marginRight: 6,
                                        color: "#fff",
                                    }}
                                >
                                    Credit
                                </CButton>
                            </span>
                        </CForm>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="card">
                    <div className="card-body">
                        <CForm className="justify-content-center" style={{ margin: 10 }}>
                            <div className="row">
                                <div className="col-12">
                                    <label>
                                        Current Available Credit Limit (
                                        {accountCurrency?.toUpperCase() || "N/A"})
                                    </label>
                                    <CInputGroup className="mb-3">
                                        <CFormInput
                                            type="number"
                                            placeholder="Current balance"
                                            value={available_balance}
                                            disabled
                                        />
                                    </CInputGroup>
                                </div>
                                <div className="col-12">
                                    <label>
                                        Debit Amount <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <CInputGroup className="mb-3">
                                        <CFormInput
                                            type="number"
                                            placeholder="0.00"
                                            id="debit_balance"
                                            autoComplete="off"
                                            value={state.debit_balance}
                                            onChange={handleChange}
                                        />
                                    </CInputGroup>
                                    <span style={{ color: "red" }}>{errorMsg.debit_balance}</span>
                                </div>
                            </div>
                            <span className="d-flex justify-content-center">
                                <CButton
                                    className="btn btn-secondary"
                                    style={{ color: "#fff", marginRight: 4 }}
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </CButton>
                                <CButton
                                    onClick={(e) => ValidateForm(e, "debit")}
                                    disabled={available_balance === 0 || isDisabled}
                                    color="danger"
                                    style={{
                                        marginRight: 6,
                                        color: "#fff",
                                    }}
                                >
                                    Debit
                                </CButton>
                            </span>
                        </CForm>
                    </div>
                </div>
            </div>
        </div>
    );
}    