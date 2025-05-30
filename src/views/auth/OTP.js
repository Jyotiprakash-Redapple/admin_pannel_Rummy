
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import OtpInput from 'react-otp-input';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CRow,
} from '@coreui/react'
import Service from "../../apis/Service";
import RouteURL from "../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { signIn } from "../../redux/slices/superAdminStateSlice";


export default function OTP(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    let { pageFor, username, password } = state;
    const [countDown, setCountDown] = useState(0);
    const [otp, setOtp] = useState('');
    const [runTimer, setRunTimer] = useState(false);
    const [errorMsgOTP, setErrorMsgOTP] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const seconds = String(countDown % 60).padStart(2, 0);
    const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);

    useEffect(() => {
        togglerTimer('');
    }, []);

    useEffect(() => {
        let timerId;
        if (runTimer) {
            setCountDown(60 * 2);
            timerId = setInterval(() => {
                setCountDown((countDown) => countDown - 1);
            }, 1000);
        } else {
            clearInterval(timerId);
        }

        return () => clearInterval(timerId);
    }, [runTimer]);

    useEffect(() => {
        if (countDown < 0 && runTimer) {
            setRunTimer(false);
            setCountDown(0);
        }
    }, [countDown, runTimer]);

    useEffect(() => {
        return () => {
            setCountDown(0)
            setRunTimer(false)
        };
    }, []);


    const handleOtpChange = (otp) => {
        setOtp(otp);
    };

    /* otp timmer */
    const togglerTimer = (data) => {
        if (data != '' && pageFor == 'login') { ResendOTPClickForLogin() }
        else if (data != '' && pageFor == 'forgotpass') { ResendOTPClickForFrogot() }
        else if (data != '' && pageFor == 'changePassword') { }
        else setRunTimer((t) => !t);

    }

    /* verify otp */
    const _verifyOTP = (event) => {
        event.preventDefault();
        setIsButtonDisabled(true);
        if (otp.match(REGEX["otp"])) {
            setErrorMsgOTP()

            OTPSubmitClick()
        } else {
            setErrorMsgOTP(`${ERROR_MESSAGE['otpRequired']}`)
            setIsButtonDisabled(false);
        }

    };

    const OTPSubmitClick = () => {
        let params = JSON.stringify({
            username: username,
            otp_code: otp,
        })
        let url;
        if (pageFor == 'login') url = RouteURL.verifyLoginOtp;
        if (pageFor == 'forgotpass') url = RouteURL.verifyForgetPasswordOtp;

        
        // Service.apiPostCallRequestWithoutToken(url, params).then(res => {
        //     setIsButtonDisabled(false);
        //     if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
        //         if (pageFor == 'login') {
        //             const { username, user_id } = res.data.user_details;
        //             const { token } = res.data;
        //             const client_details = res.data.user_details;
        //             dispatch(signIn({ username, user_id, token, client_details }));

        //             navigate('/dashboard')
        //         } else if (pageFor == 'forgotpass') {
        //             const { token } = res.data;
        //             let pass_token = token;
        //             dispatch(signIn({ pass_token }));
        //             navigate('/change-password', { state: { pageFor: 'forgotpass', username: username, } })
        //         }
        //     }
        //     else {

        //         toast.error(res.message, {
        //             position: 'bottom-right',
        //             autoClose: false,
        //         });
        //     }
        // }).catch(error => {
        //     setIsButtonDisabled(false)
        //     toast.error(error.response.data.message, {
        //         position: 'bottom-right',
        //         autoClose: true,
        //     });
        // })
    }

    const ResendOTPClickForLogin = (e) => {
        let params = JSON.stringify({
            username: username,
            password: password,
        })
        Service.apiPostCallRequestWithoutToken(RouteURL.login_api, params)
            .then((res) => {
                setIsDisabled(false)
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    toast.success(res.message, {
                        position: 'bottom-right',
                        closeOnClick: true,
                    });
                    setRunTimer((t) => !t);

                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: false,
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

    const ResendOTPClickForFrogot = (e) => {
        setIsDisabled(true)
        let params = JSON.stringify({
            username: username,
        })
        Service.apiPostCallRequestWithoutToken(RouteURL.forgotPassword, params)
            .then((res) => {
                setIsDisabled(false)
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {

                    toast.success(res.message, {
                        position: 'bottom-right',
                        closeOnClick: true,
                    });
                    setRunTimer((t) => !t);

                } else {
                    toast.error(res.message, {
                        position: 'bottom-right',
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                setIsDisabled(false)
                toast.error(error.response.data.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });
            });

    }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <ToastContainer />
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCardGroup>
                            <CCard className="p-4">
                                <CCardBody>
                                    <CForm onSubmit={_verifyOTP}>
                                        <h1 style={{ textAlign: 'center', }}>OTP</h1>
                                        <p style={{ textAlign: 'center', }}>An OTP has been sent to your email id</p>
                                        <div style={{ margin: 15, alignItem: 'center', justifyContent: 'center' }}>
                                            <OtpInput
                                                value={otp}
                                                onChange={handleOtpChange}
                                                numInputs={6}
                                                renderSeparator={<span style={{ margin: 6, }}>  </span>}
                                                renderInput={(props) => <input {...props} style={{ height: '4em', width: '4em', fontWeight: 200, textAlign: 'center' }} type="number" />}
                                                isInputNum={false}
                                                containerStyle={{ alignItem: 'center', justifyContent: 'center' }}
                                                shouldAutoFocus
                                            />
                                            <div style={{ textAlign: 'center', }}>
                                                <span style={{ color: "red", }}>{errorMsgOTP}</span>
                                            </div>
                                        </div>
                                        <p style={{ paddingTop: 15, textAlign: "center", margin: 0 }}>{minutes}:{seconds}</p>
                                        <p style={{ paddingTop: 15, color: "#C5C4D2", textAlign: "center", margin: 0 }} >Not received the code? &nbsp;
                                            <span style={{ color: seconds == '00' && minutes == '00' ? "#FBAA2A" : '#C5C4D2', cursor: seconds == '00' && minutes == '00' ? 'pointer' : "" }} onClick={() => { if (seconds == '00' && minutes == '00') togglerTimer('trigger') }} disabled={isDisabled ? true : false}>
                                                Resend</span></p>
                                        <CRow>
                                            <div style={{ textAlign: 'center', marginTop: 10 }}>
                                                <CButton color="primary" className="px-4" type="submit" disabled={isButtonDisabled && otp.length < 6 ? true : false}>
                                                    Submit
                                                </CButton>
                                            </div>

                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>

    );
}