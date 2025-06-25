
import React, { useState, useEffect, useRef } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CFormSelect,
    CRow, CFormTextarea,
} from '@coreui/react'
import { useNavigate, useLocation } from "react-router-dom";
import { leftTrim } from "../../../Utility/helper";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Currency, providerStore } from "../../../redux/slices/superAdminStateSlice";
import MasterData from "../../../Utility/MasterData";


export default function AddEditProvider(props) {
    let navigate = useNavigate();
    let formData = new FormData();
    const dispatch = useDispatch()
    const location = useLocation();
    const currency = useSelector((state) => state.currency);
    const getProviderDetails = useSelector((state) => state.provider_Details);

    const client_id = props?.allData?.client_id;
    const Type = getProviderDetails?.Type;
    const token = useSelector((state) => state.user.token);
    const get_provider_details = getProviderDetails?.alldata;
    const [update, setUpdate] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false)
    const [state, setState] = useState({
        provider_name: "",
        provider_description: "",
        list: [],
        _currency: [],
        selectedCurrency: [],
        light_logo: "",
        light_logoFile: undefined,
        dark_logo: "",
        dark_logoFile: undefined,
        provider_id: '',
        provider_list: [],
        provider_parent_id: ""
    });
    const [errorMsg, setErrorMsg] = useState({
        provider_name: "",
        status: "",
        currency: "",
        provider_parent_id: ""
    });


    useEffect(() => {
        ProviderListDetails()
        CurrencyList()
    }, [])


    useEffect(() => {


        if (Type == 1) {

            let _currencies = get_provider_details.currencies;
            _currencies.forEach((obj) => {
                state.list.forEach((object) => {
                    if (obj._id == object._id) {
                        object.isActive = true;
                    }
                });
            });
            setState(prevState => ({
                ...prevState,
                provider_name: get_provider_details?.provider_name,
                provider_parent_id: get_provider_details?.provider_parent_id != 'undefined' ? get_provider_details?.provider_parent_id : '',
                provider_description: get_provider_details?.provider_description,
                provider_id: get_provider_details?._id,
                light_logoFile: get_provider_details?.light_logo,
                dark_logoFile: get_provider_details?.dark_logo,
                _currency: get_provider_details?.currencies,
                light_logo: get_provider_details?.light_logo,
                dark_logo: get_provider_details?.dark_logo,
            }))
        }
    }, [state.list])
    const CurrencyList = () => {

        Service.apiPostCallRequest(RouteURL.currencyList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let currencies = res.data.currencies;
                    currencies.forEach((object) => {
                        object.isActive = false;
                    });
                    setState((prevState) => ({
                        ...prevState, list: currencies,
                    }));
                    // dispatch(Currency({ currencies }));

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
    const ProviderListDetails = () => {
        let params = JSON.stringify({
            // "filter_field": providerData.search,
            // "limit": providerData.limit,
            // "page": providerData.page
        })

        Service.apiPostCallRequest(RouteURL.providerList, params, token)
            .then((res) => {

                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        provider_list: res?.data?.provider,
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
        const { id, value, checked } = e.target;
        setState(prevState => ({
            ...prevState,
            [id]: leftTrim(value)
        }))
    }

    const handleChangeForCurrency = (e, i) => {
        const { id, checked } = e.target;
        if (checked == true) state.list[i]["isActive"] = true;
        else state.list[i]["isActive"] = false;
        setUpdate(!update)
        setState(prevState => ({
            ...prevState,
            _currency: state.list
        }))
    }

    useEffect(() => {
        if (state._currency.length > 0) {
            let checked = state._currency.filter((obj) => obj.isActive == true)
            setState(prevState => ({
                ...prevState,
                _currency: checked
            }))
        }
    }, [update])


    /* Validation Checking */
    const ValidateForm = (e) => {
        e.preventDefault();

        if (handleValidation()) {
            AddSubmitProvider()
        }
    }

    /* Validate all fields */
    const handleValidation = () => {
        let formIsValid = true;

        //Name
        if (!state.provider_name) {
            formIsValid = false;
            setErrorMsg(prevState => ({
                ...prevState,
                provider_name: `${ERROR_MESSAGE['providernameRequired']}`

            }))
        } else {
            setErrorMsg(prevState => ({
                ...prevState,
                provider_name: ""
            }))
        }


        if (state._currency.length == 0) {
            formIsValid = false;
            setErrorMsg(prevState => ({
                ...prevState,
                currency: `${ERROR_MESSAGE['currencycodeRequired']}`

            }))
        } else {
            setErrorMsg(prevState => ({
                ...prevState,
                currency: ""
            }))
        }

        return formIsValid;
    }
    const AddSubmitProvider = () => {

        let result = state._currency.map(({ isActive, created_at, updated_at, __v, ...rest }) => ({
            ...rest,
        }));

        if (Type == 1) formData.append("provider_id", state.provider_id)
        formData.append("provider_parent_id", state.provider_parent_id)
        formData.append("provider_name", state.provider_name)
        formData.append("provider_description", state?.provider_description != undefined ? state.provider_description : '')
        formData.append("status", 'active');
        formData.append("currencies", JSON.stringify(result))
        formData.append('light_logo', state.light_logo)
        formData.append('dark_logo', state.dark_logo)
        Service.apiPostCallFormDataRequest(RouteURL.addUpdateProvider, formData, token)
            .then((res) => {
                setIsDisabled(false)
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    toast.success(res.message, {
                        position: 'bottom-right',
                        closeOnClick: true,
                    });
                    navigate('/provider-list')

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

    return (<div className="mb-3">
        <ToastContainer />
        <div className="d-flex bd-highlight">
            <div className="p-2 w-100 bd-highlight"><h3 className="hed_txt pt-2">{Type == 0 ? 'Add' : 'Update'} Provider</h3></div>
            <div className="p-2 flex-fill  bd-highlight"></div>
        </div>

        <CForm className="justify-content-center" style={{ margin: 10 }} onSubmit={ValidateForm}>
            <div className="row">
                <div className="col-sm-3">
                    <div className='card ' >
                        <div className='card-header border-0'>
                            <label className="">Light Logo </label></div>
                        <div className='card-body d-flex justify-content-center'>

                            <div className='icon_box_shadow  align-items-center mt-2'  >
                                <div className="add_provider_imgfile"  >
                                    <i className="bi bi-pencil" />
                                    <input type="file" id="light_logo" name="ImageStyle" onChange={(e) => setState(prevState => ({
                                        ...prevState,
                                        light_logo: e.target.files[0],
                                        light_logoFile: URL.createObjectURL(e.target.files[0])
                                    }))} />
                                    <img src={state.light_logoFile ? state.light_logoFile : undefined} className="img_size" />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='card mt-3' >
                        <div className='card-header border-0'>
                            <label>Dark Logo </label></div>
                        <div className='card-body d-flex justify-content-center'>
                            <div className='icon_box_shadow d-flex align-items-center mt-2'  >
                                <div className="add_provider_imgfile"  >
                                    <i className="bi bi-pencil" />
                                    <input type="file" id="light_logo" name="ImageStyle" onChange={(e) => setState(prevState => ({
                                        ...prevState,
                                        dark_logo: e.target.files[0],
                                        dark_logoFile: URL.createObjectURL(e.target.files[0])
                                    }))} />
                                    <img src={state.dark_logoFile != null ? state.dark_logoFile : undefined} className="img_size" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-sm-9">
                    <div className='card ' >
                        <div className='card-body'>
                            <div className="col-12">
                                <label>Parent Provider</label>
                                <CInputGroup className="mb-3">
                                    <select className="form-select" aria-label="Default select example"
                                        id="provider_parent_id"
                                        onChange={handleChange}
                                        value={state.provider_parent_id}
                                    >
                                        <option value={''}>Select Provider</option>
                                        {state.provider_list.filter(obj => obj._id != state.provider_id).map((item, key) => (
                                            <option value={item._id} key={key} >{item.provider_name}</option>
                                        ))}
                                    </select>

                                </CInputGroup>
                                <span style={{ color: "red" }}>{errorMsg.provider_parent_id}</span></div>
                            <div className="col-12">
                                <label>Provider Name <span style={{ color: 'red' }}>*</span></label>
                                <CInputGroup className="mb-3">
                                    <CFormInput type="text" placeholder="Enter provider name" id="provider_name" autoComplete="off" value={state.provider_name}
                                        onChange={handleChange} />
                                </CInputGroup>
                                <span style={{ color: "red" }}>{errorMsg.provider_name}</span></div>
                            <div className="col-12">
                                <label>Provider Description</label>
                                <CInputGroup className="mb-3">
                                    <CFormTextarea type="text" placeholder="Enter client last name" id="provider_description" autoComplete="off" value={state.provider_description}
                                        onChange={handleChange} />
                                </CInputGroup>

                            </div>

                            <div className=' mt-4'>
                                <label>Currencies<span style={{ color: 'red' }}>*</span></label>
                                <div className="form-check d-flex">
                                    {state?.list.length > 0 && state?.list.map((data, key) => (
                                        <div className="checkbox checkbox-circle checkbox-color-scheme ">
                                            <label className="checkbox-checked">
                                                <input type="checkbox" id="_currency" value={data._id} checked={state?.list[key].isActive} onChange={(e) => handleChangeForCurrency(e, key)} /> <span className="label-text"> {data.currency_code.toUpperCase()} {state?.list[key].isActive}</span>
                                            </label> &nbsp; &nbsp;
                                        </div>


                                    ))}
                                </div>
                                <span style={{ color: "red" }}>{errorMsg.currency}</span>
                            </div>

                        </div>
                    </div>
                    <span className="d-flex justify-content-end" style={{ margin: 10 }}>
                        <CButton className="btn btn-secondary" style={{ color: '#fff', marginRight: 6 }} onClick={() => navigate('/provider-list')}>Back</CButton>

                        <CButton color="primary" type="submit" disabled={isDisabled ? true : false} style={{ marginRight: 6 }}>{Type == 0 ? 'Add' : 'Update'}</CButton>
                    </span>
                </div>

            </div>

        </CForm>


    </div>)
}