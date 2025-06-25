import React, { useState, useEffect } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, } from '@coreui/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Service from "../../apis/Service";
import RouteURL from "../../apis/ApiURL";
import { ToastContainer, toast } from 'react-toastify';
import { Constants, REGEX, ERROR_MESSAGE } from "../../apis/Constant";
import { leftTrim } from "../../Utility/helper";
import { useDispatch, useSelector } from "react-redux";


export default function ChangePassword(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);
    const pass_token = useSelector((state) => state.user.pass_token);
    const { state } = useLocation();
    let pageFor, username
    if (state == null) {
        pageFor = props.pageFor;
        username = props.username;
    } else {

        pageFor = state.pageFor;
        username = state.username;
    }

    //Define states
    const [_state, setState] = useState({
        old_password: '', new_password: '',
        confirm_password: '',
        showOldPass: false,
        showNewPass: false,
        showConfPass: false
    })
    const [errorMsg, setErrorMsg] = useState({
        new_password: "",
        confirm_password: "",
        old_password: ""
    })
    const [isDisabled, setIsDisabled] = useState(false)

    /* Validate all fields */
    const handleValidation = (e) => {
        let formIsValid = true;

        //Old Password
        if (pageFor != 'forgotpass') {
            if (!_state.old_password) {
                formIsValid = false;
                setErrorMsg(prevState => ({
                    ...prevState,
                    old_password: `${ERROR_MESSAGE['oldPasswordRequired']}`
                }))
            } else {
                setErrorMsg(prevState => ({
                    ...prevState,
                    old_password: ""
                }))
            }
        }

        //New Password
        if (!_state.new_password) {
            formIsValid = false;
            setErrorMsg(prevState => ({
                ...prevState,
                new_password: `${ERROR_MESSAGE['newPasswordRequired']}`
            }))
        } else if (_state.new_password && !_state.new_password.match(REGEX.password)) {
            formIsValid = false;
            setErrorMsg(prevState => ({
                ...prevState,
                new_password: `${ERROR_MESSAGE['passwordInvalid']}`
            }))
        } else {
            setErrorMsg(prevState => ({
                ...prevState,
                new_password: ""
            }))
        }

        // else if (_state.new_password !== _state.confirm_password) {
        //     formIsValid = false;
        //     setErrorMsg(prevState => ({
        //         ...prevState,
        //         new_password: `${ERROR_MESSAGE['newPasswordInvalid']}` 
        //     }))
        // } 

        //Confirm Password
        if (!_state.confirm_password) {
            formIsValid = false;
            setErrorMsg(prevState => ({
                ...prevState,
                confirm_password: `${ERROR_MESSAGE['confirmPasswordRequired']}`
            }))
        } else if (_state.new_password !== _state.confirm_password) {
            formIsValid = false;
            setErrorMsg(prevState => ({
                ...prevState,
                confirm_password: `${ERROR_MESSAGE['newPasswordInvalid']}`
            }))
        } else {
            setErrorMsg(prevState => ({
                ...prevState,
                confirm_password: ""
            }))
        }

        return formIsValid;
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: leftTrim(value)
        }))
    }
    const passwordValidation = (_password) => {
        return {
            length: _password.length >= 8,
            uppercase: /[A-Z]/.test(_password),
            number: /\d/.test(_password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(_password),
        };
    };

    /* Validation Checking */
    const ValidateForm = (e) => {
        e.preventDefault();
        setIsDisabled(true)
        if (handleValidation()) {
            if (pageFor == 'forgotpass') _resetPasswordClick()
            else if (pageFor == 'changePassword') ChangePasswordClick();

        }
        else {
            toast.error("Please fill all the fields properly !", {
                position: 'bottom-right',
                onClose: () => setIsDisabled(false),
            });
        }
    }

    const _resetPasswordClick = (e) => {
        let params = JSON.stringify({
            username: username,
            new_password: _state.new_password,
            token: pass_token
        })
        Service.apiPostCallRequestWithoutToken(RouteURL.resetPassword, params).then(res => {
            setIsDisabled(false)
            if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                localStorage.clear();
                navigate('/login');
                toast.success(res.message, {
                    position: 'bottom-right',
                    closeOnClick: true,
                });

            }
            else {
                toast.error(res.message, {
                    position: 'bottom-right',
                    closeOnClick: true,
                });
            }
        }).catch(error => {
            setIsDisabled(false)
            toast.error(error.response.data.message, {
                position: 'bottom-right',
                autoClose: false,
            });
        })

    }

    const ChangePasswordClick = (e) => {
        let params = JSON.stringify({
            old_password: _state.old_password,
            new_password: _state.new_password,
        })
        Service.apiPostCallRequestWithAuthBaseUrl(RouteURL.changePassword, params, token).then(res => {
            setIsDisabled(false)
            if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                toast.success(res.message, {
                    position: 'bottom-right',
                    closeOnClick: true,
                });
                props.onclose();
            }
            else {
                toast.error(res.message, {
                    position: 'bottom-right',
                    closeOnClick: true,
                });
            }
        }).catch(error => {
            setIsDisabled(false)
            toast.error(error.response.data.message, {
                position: 'bottom-right',
                autoClose: false,
            });
        })

    }

    return (
        <div className={`${pageFor == 'forgotpass' ? 'bg-body-tertiary min-vh-100 d-flex flex-row align-items-center' : 'bg-body-tertiary min-vh-50 d-flex flex-row align-items-center'}`}>
            {/* <ToastContainer /> */}
            <CContainer>
                <CRow className="justify-content-center">
                    <div className={`${pageFor == 'forgotpass' ? 'col-xl-6 col-lg-7 col-md-9' : ''}`} style={{ margin: 10 }}>
                        <div className={`${pageFor == 'forgotpass' ? 'card' : ''}`}>
                            <div className={`${pageFor == 'forgotpass' ? 'card-body' : ''}`}>
                                <CForm onSubmit={ValidateForm}>
                                    <h1>{(pageFor == 'forgotpass') ? 'Set New Password' : ''}</h1>

                                    {(pageFor != 'forgotpass') &&
                                        <>
                                            <label>Old Password</label>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilLockLocked} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type={_state.showOldPass == true ? 'text' : 'password'}
                                                    id="old_password" name="old_password" placeholder="Enter your old password here" value={_state.old_password} onChange={handleChange}
                                                />
                                                <CInputGroupText onClick={() => setState(prevState => ({
                                                    ...prevState,
                                                    showOldPass: !_state.showOldPass,
                                                }))}><i className={`fa-regular ${_state.showOldPass == true ? 'fa-eye' : 'fa-eye-slash'}`}></i></CInputGroupText>
                                            </CInputGroup>
                                            {errorMsg.old_password &&
                                                <span style={{ color: "red" }}>{errorMsg.old_password} <br></br></span>
                                            }
                                        </>
                                    }
                                    <label>New Password</label>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilLockLocked} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type={_state.showNewPass == true ? 'text' : 'password'} autoComplete="off"
                                            id="new_password" name="new_password" placeholder="Enter your new password here" value={_state.new_password} onChange={handleChange}
                                        />
                                        <CInputGroupText onClick={() => setState(prevState => ({
                                            ...prevState,
                                            showNewPass: !_state.showNewPass,
                                        }))}><i className={`fa-regular ${_state.showNewPass == true ? 'fa-eye' : 'fa-eye-slash'}`}></i></CInputGroupText>
                                    </CInputGroup>
                                    <span style={{ color: "red" }}>{errorMsg.new_password}</span>
                                    <div className="password-rules">
                                        <ul>
                                            <li style={{ color: passwordValidation(_state.new_password).length ? 'green' : 'red' }}>
                                                Minimum 8 characters
                                            </li>
                                            <li style={{ color: passwordValidation(_state.new_password).uppercase ? 'green' : 'red' }}>
                                                At least one uppercase letter
                                            </li>
                                            <li style={{ color: passwordValidation(_state.new_password).number ? 'green' : 'red' }}>
                                                At least one number
                                            </li>
                                            <li style={{ color: passwordValidation(_state.new_password).specialChar ? 'green' : 'red' }}>
                                                At least one special character (!@#$%^&*(),.?":{ }|)
                                            </li>
                                        </ul>
                                    </div>
                                    <label>Confirm Password</label>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupText>
                                            <CIcon icon={cilLockLocked} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type={_state.showConfPass == true ? 'text' : 'password'} autoComplete="off"
                                            id="confirm_password" name='confirm_password' placeholder="Enter your confirm password here" value={_state.confirm_password} onChange={handleChange}
                                        />
                                        <CInputGroupText onClick={() => setState(prevState => ({
                                            ...prevState,
                                            showConfPass: !_state.showConfPass,
                                        }))}><i className={`fa-regular ${_state.showConfPass == true ? 'fa-eye' : 'fa-eye-slash'}`}></i></CInputGroupText>
                                    </CInputGroup>
                                    <span style={{ color: "red" }}>{errorMsg.confirm_password}</span>
                                    <div className="password-rules">
                                        <ul>
                                            <li style={{ color: passwordValidation(_state.confirm_password).length ? 'green' : 'red' }}>
                                                Minimum 8 characters
                                            </li>
                                            <li style={{ color: passwordValidation(_state.confirm_password).uppercase ? 'green' : 'red' }}>
                                                At least one uppercase letter
                                            </li>
                                            <li style={{ color: passwordValidation(_state.confirm_password).number ? 'green' : 'red' }}>
                                                At least one number
                                            </li>
                                            <li style={{ color: passwordValidation(_state.confirm_password).specialChar ? 'green' : 'red' }}>
                                                At least one special character (!@#$%^&*(),.?":{ }|)
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="d-grid">
                                        <CButton color="success" type="submit" onClick={ValidateForm} disabled={isDisabled ? true : false}>Save</CButton>
                                    </div>
                                </CForm>
                            </div>
                        </div>
                    </div>
                </CRow>
            </CContainer>
        </div>
    )
}

