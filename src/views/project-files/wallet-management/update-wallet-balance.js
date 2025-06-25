import React, { useState, useEffect, useRef } from "react";
import {
    CForm,
    CFormInput,
    CInputGroup, CButton,
} from '@coreui/react'
import Select from "react-select"
import { useNavigate, useLocation } from "react-router-dom";
import { leftTrim } from "../../../Utility/helper";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { currencyWiseAmount } from "../../../redux/slices/superAdminStateSlice";


export default function UpdateWalletBalance() {
    const dispatch = useDispatch()
    const token = useSelector((state) => state.user.token);
    const currency = useSelector((state) => state.currency);
    const select_Currency = useSelector((state) => state.select_currency);
    let currency_details = select_Currency.split(',');
    let currency_name = currency_details[1];
    let currency_id = currency_details[0];
    // console.log(currency, select_Currency, currency_details, currency_name, currency_id);
    // console.log(currency);

    const [isDisabled, setIsDisabled] = useState(false)
    const [state, setState] = useState({
        wallet_records_id: "",
        currency_code_id: currency_id,
        available_amount: "",
        amount: ""
    });
    const [errorMsg, setErrorMsg] = useState({
        wallet_records_id: "",
        currency_code_id: "",
        available_amount: ""
    });
    const [currency_list, setcurrency_list] = useState([])



    useEffect(() => {
        // console.log(currency_id);
        setState(prevState => ({
            ...prevState,
            currency_code_id: currency_id
        }))
        WalletBalance(currency_id);

    }, [currency_id])
    const WalletBalance = (currency_id) => {
        // console.log(currency_id);

        let params = JSON.stringify({
            currency_code_id: currency_id//state.currency_code_id,
        })

        Service.apiPostCallRequest(RouteURL.currencyWiseAdminWalletBalance, params, token)
            .then((res) => {
                setIsDisabled(false)
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    if (res?.data.length > 0) {
                        setState(prevState => ({
                            ...prevState,
                            wallet_records_id: res?.data[0]?._id,
                            available_amount: res?.data[0]?.available_amount,
                            amount: '',
                        }))
                        let totalAmount = res?.data[0]?.available_amount
                        dispatch(currencyWiseAmount(totalAmount));

                    } else {
                        setState(prevState => ({
                            ...prevState,
                            wallet_records_id: '',
                            available_amount: '',
                            amount: '',
                        }))
                    }
                    // if (state.amount) {
                    //     toast.success(res.message, {
                    //         position: 'bottom-right',
                    //     });

                    // }


                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: true,
                    });
                }
            })
            .catch((error) => {
                setIsDisabled(false)
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                    autoClose: true,
                });

            });
    }

    const currencyArray = () => {
        let array = []
        for (let i = 0; i < currency.length; i++) {
            // console.log(currency[i]);
            let payload = {
                value: currency[i]._id, label: currency[i].currency_code?.toUpperCase()
            }
            array.push(payload)
        }
        setcurrency_list(array)
        // console.log(array);
    }


    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: leftTrim(value)
        }))
    }


    /* Validation Checking */
    const ValidateForm = (e) => {
        e.preventDefault();

        if (handleValidation()) {
            // console.log(state);
            AddEditSubmitBalance()
        }
    }

    /* Validate all fields */
    const handleValidation = () => {
        let formIsValid = true;


        if (!state.amount) {
            formIsValid = false;
            setErrorMsg(prevState => ({
                ...prevState,
                amount: `${ERROR_MESSAGE['availableamountRequired']}`

            }))
        } else {
            setErrorMsg(prevState => ({
                ...prevState,
                amount: ""
            }))
        }
        return formIsValid;
    }
    const AddEditSubmitBalance = () => {

        let params = JSON.stringify({
            currency_code_id: state.currency_code_id,
            amount: Number(state.amount),
        })

        Service.apiPostCallRequest(RouteURL.addUpdateAdminWalletBalance, params, token)
            .then((res) => {
                setIsDisabled(false)
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    toast.success(res.message, {
                        position: 'bottom-right',
                        closeOnClick: true,
                    });
                    WalletBalance(state.currency_code_id);

                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: true,
                    });
                }
            })
            .catch((error) => {
                setIsDisabled(false)
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                    autoClose: true,
                });
            });
    }


    return (<div className="mb-3">
        <ToastContainer />
        <div className='card' >
            <div className='card-body'>
                <h3 className="hed_txt pt-2">Add Wallet Balance</h3>
                <CForm className="justify-content-center" style={{ margin: 10 }}>
                    <div className="row">
                        <div className="col-4">
                            <label>AVAILABLE CREDIT ({currency_name?.toUpperCase()})</label>
                            <CInputGroup className="mb-3">
                                <CFormInput type="number" placeholder="Avalable Credit" id="available_amount" autoComplete="off" value={state.available_amount} disabled />
                            </CInputGroup>
                            <span style={{ color: "red" }}>{errorMsg.available_amount}</span></div>
                        <div className="col-4">
                            <label>AMOUNT</label>
                            <CInputGroup className="mb-3">
                                <CFormInput type="number" placeholder="Enter amount" id="amount" autoComplete="off" value={state.amount}
                                    onChange={handleChange} />
                            </CInputGroup>
                            <span style={{ color: "red" }}>{errorMsg.amount}</span></div>

                        <span className="d-flex justify-content-end" >

                            <CButton color="primary" onClick={ValidateForm} disabled={isDisabled ? true : false}>Save</CButton>
                        </span>


                    </div>

                </CForm>
            </div>
        </div>
    </div>)
}