
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
import { useSelector } from "react-redux";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';

export default function AddEditPlayerForm(props) {
    const token = useSelector((state) => state.user.token);
    const [isDisabled, setIsDisabled] = useState(false);
    const [accountList, setAccountList] = useState([]);
    const Type = props._allData.type;
    const [errorSatate, setErrorState] = useState({
        accountError: '',
        usernameError: '',
    })

    const [addEditData, setaddEditData] = useState({
        modal: false,
        account_id: "",
        username: "",
        player_id: '',
        type: ""
    });

    useEffect(() => {
        const Object = props?._allData;
        if (Type == 1) {
            setaddEditData((prevState) => ({
                ...prevState,
                type: Object.type,
                username: Object.username,
                account_id: Object.account_id,
                player_id: Object.player_id,
            }))

        } else if (Type == 0) {
            setaddEditData((prevState) => ({
                ...prevState,
                username: '',
                account_id: '',
                player_id: '',
            }))
        }
    }, [Type])

    useEffect(() => {
        AccontList()
    }, [])

    /**
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
   * @function sync
   * @functionName AccountWiseCurrencyList
   * @functionPurpose this function for account wise currency list.
   *
   * @functionParam {payload object: }
   * 
   * @functionSuccess Success status and message.
   *
   * @functionError {Boolean} error error is there.
   * @functionError {String} message  Description message.
   */
    const AccontList = () => {
        Service.apiPostCallRequest(RouteURL.clientAccountWiseCurrencyList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setAccountList(res?.data)

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
        const { id, value } = e.target
        setaddEditData(prevState => ({
            ...prevState,
            [id]: value.trimStart(),
        }))
    }

    /* Validate all fields */
    const handleValidation = (e) => {
        let formIsValid = true;

        //account_id
        if (!addEditData.account_id) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                accountError: 'Account Name is required',
            }));
        } else setErrorState((prevState) => ({
            ...prevState,
            accountError: '',
        }));

        //username
        if (!addEditData.username) {
            formIsValid = false;
            setErrorState((prevState) => ({
                ...prevState,
                usernameError: 'Username is required',
            }));
        } else setErrorState((prevState) => ({
            ...prevState,
            usernameError: '',
        }));
        return formIsValid;
    }

    /* Validation Checking */
    const ValidateForm = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            AddEditPlayer();
        }
    }
    const AddEditPlayer = () => {
        if (Type == 0) {
            let params = JSON.stringify({
                "username": addEditData.username,
                "account_id": addEditData.account_id,
            })
            Service.apiPostCallRequest(RouteURL.addPlayer, params, token)
                .then((res) => {
                    if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                        toast.success(res.message, {
                            position: 'bottom-right',
                            closeOnClick: true,
                        });
                        props.CloseAddEditPlayerModal();
                        props.onChangeSomeState("add");

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
        } else {
            let params = JSON.stringify({
                "player_id": addEditData.player_id,
                "account_id": addEditData.account_id,
            })
            Service.apiPutCallRequest(RouteURL.updatePlayer, params, token)
                .then((res) => {
                    if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                        toast.success(res.message, {
                            position: 'bottom-right',
                            closeOnClick: true,
                        });
                        props.CloseAddEditPlayerModal();
                        props.onChangeSomeState("edit");
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
    }

    return (<div >
        <ToastContainer />
        <div className="row" style={{ margin: 10 }}>
            <div className='modal_form'>
                <label>Account Name</label>
                <select className="form-select form-select-sm mb-1" id="account_id" onChange={handleChange}
                    value={addEditData.account_id}
                    disabled={Type == 1 ? true : false}
                >
                    <option value=''>Select Account</option>
                    {accountList.length > 0 && accountList.map((list, key) => (
                        <option value={list._id} key={key} >{list.account_name}</option>
                    ))}
                </select>
                <span style={{ color: "red" }}>{errorSatate.accountError}</span>
            </div>
            <div className='modal_form'>
                <label>Username</label>
                <CFormInput type="text" placeholder="Enter username" id="username" autoComplete="off"
                    value={addEditData?.username}
                    disabled={Type == 1 ? true : false}
                    onChange={handleChange}
                />

                <span style={{ color: "red" }}>{errorSatate.usernameError}</span>
            </div>

            <div className="modal_form">
                <div className="row">
                    <div className="button_align col-12">
                        <CButton
                            className="cancel"
                            style={{ marginRight: 10 }}
                            onClick={props.CloseAddEditPlayerModal}

                        >
                            Cancel
                        </CButton>
                        <CButton
                            className="save"
                            onClick={ValidateForm}
                            disabled={isDisabled ? true : false}
                        >
                            Save
                        </CButton>
                    </div>
                </div>
            </div>
        </div>

    </div>)
}