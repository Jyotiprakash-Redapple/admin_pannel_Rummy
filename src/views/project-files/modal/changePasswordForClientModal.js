
import React, { useState, useEffect } from 'react'
import {
    CButton,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import { cilLockLocked } from '@coreui/icons';
import CIcon from '@coreui/icons-react'
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { leftTrim } from "../../../Utility/helper";
import { useSelector } from "react-redux";

export default function ChangePasswordForClientModal(props) {
    const token = useSelector((state) => state.user.token);

    //Define states
    const [_state, setState] = useState({
        client_id: props?.allData, new_password: '',
        confirm_password: '',

    })
    const [errorMsg, setErrorMsg] = useState({
        confirm_password: "",
        old_password: ""
    })
    const [isDisabled, setIsDisabled] = useState(false)

    /* Validate all fields */
    const handleValidation = (e) => {
        let formIsValid = true;
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


    /* Validation Checking */
    const ValidateForm = (e) => {
        e.preventDefault();
        setIsDisabled(true)
        if (handleValidation()) {
            updateClientPasswordClick()

        } else setIsDisabled(false)

    }
    const updateClientPasswordClick = (e) => {
        let params = JSON.stringify({
            client_id: _state.client_id,
            new_password: _state.new_password,
        })
        Service.apiPostCallRequest(RouteURL.updateClientPassword, params, token).then(res => {
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
                    autoClose: false,
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
        <>
            <ToastContainer />
            <CContainer>
                <CRow className="justify-content-center">
                    <div style={{ margin: 10 }}>
                        <CForm>
                            <CInputGroup className="mb-3">
                                <CInputGroupText>
                                    <CIcon icon={cilLockLocked} />
                                </CInputGroupText>
                                <CFormInput
                                    type="password"
                                    id="new_password" name="new_password" placeholder="Enter new password here" value={_state.new_password} onChange={handleChange} autoComplete="off"
                                />
                            </CInputGroup>
                            <span style={{ color: "red" }}>{errorMsg.new_password}</span>
                            <CInputGroup className="mb-4">
                                <CInputGroupText>
                                    <CIcon icon={cilLockLocked} />
                                </CInputGroupText>
                                <CFormInput
                                    type="password"
                                    id="confirm_password" name='confirm_password' placeholder="Enter confirm password here" value={_state.confirm_password} onChange={handleChange} autoComplete="off"
                                />
                            </CInputGroup>
                            <span style={{ color: "red" }}>{errorMsg.confirm_password}</span>
                            <div className="d-grid">
                                <CButton color="success" onClick={ValidateForm} disabled={isDisabled ? true : false}>Save</CButton>
                            </div>
                        </CForm>
                    </div>
                </CRow>
            </CContainer>
        </>
    )
}