
import React, { useState, useEffect } from 'react'
import {
    CForm,
    CFormLabel,
    CNav,
    CNavItem, CNavLink,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import PlayersList from './players';
import TransactionsList from './tranactions';
import ManageGamesList from './manage-games';
import GeneralList from './general-list';
import Service from "../../../../apis/Service";
import RouteURL from "../../../../apis/ApiURL";
import { Modal } from 'react-bootstrap';
import { Constants } from "../../../../apis/Constant";
import { technicalDetails } from "src/redux/slices/superAdminStateSlice.js";
import RevenueSetting from './revenue-setting';
import TechnicalList from './technical-list';
import ManageProviderList from './provider-list';

export default function ClientManageAccountDetailsMainPage(props) {

    const getClientAccountDetails = useSelector((state) => state.client_account_details);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();
    const [providerModal, setProviderModal] = useState(false)
    const [menuName, setMenuName] = useState("Players");
    const [state, setState] = useState({
        clientData: {},
        accountData: {},
        players_count: 0,
        provider_count: 0,
        currency: "",
        avalableBalance: "",
        provider_list: []
    })

    useEffect(() => {
        ClientAccountDetails()
        ProviderList()
        TechnicalAccountDetails()
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

    const ProviderList = () => {
        let params = JSON.stringify({
            "client_account_id": getClientAccountDetails.accountId
        })
        Service.apiPostCallRequest(RouteURL.ProviderList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        provider_list: res?.data,
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
                        clientData: res.data?.clientDetails,
                        accountData: res.data.account_details,
                        players_count: res.data.account_details?.total_player,
                        provider_count: res.data.account_details?.total_providers
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

    const handleMenuSet = (e, menuName) => {
        setMenuName(menuName);
    };

    return (
        <>
            <ToastContainer />
            <div className='row'>
                <div className="d-flex bd-highlight">
                    <div className="p-2 w-100 bd-highlight"><h3 className="hed_txt pt-2">Manage Account</h3></div>
                    <div className="p-2 flex-fill  bd-highlight"></div>
                </div>
                <div className='col-4'>
                    <div className='card shadow-lg rounded' >
                        <div className='card-body'>
                            <CForm className="justify-content-center" style={{ margin: 10 }}>
                                <div className="row grid gap-2">

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client First Name :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{state.clientData?.first_name}</b></CFormLabel>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client Last Name :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{state.clientData?.last_name}</b></CFormLabel>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client Username  :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{state.clientData?.username}</b></CFormLabel>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client Contact No :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{state.clientData?.contact}</b></CFormLabel>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client Email :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{state.clientData?.email}</b></CFormLabel>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client ID :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{state.clientData?._id}</b></CFormLabel>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center p-3 bg-info bg-opacity-10 border border-info rounded">
                                    <label className=''>Total Providers Allocated : <b>{state.provider_count}</b></label>

                                </div>
                                <div className="text-center">
                                    <span
                                        // onClick={(e) => handleMenuSet(e, "ManageProviders")}
                                        onClick={() => setProviderModal(true)}
                                        style={{ cursor: 'pointer', color: "#3e97ff", textAlign: 'center' }}>Click to view your providers</span>
                                </div>
                                <div className="text-center p-2 g-col-12">
                                    <h5>Account Details</h5>
                                </div>
                                <div className="row grid gap-2">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Name :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{state.accountData?.account_name}</b></CFormLabel>
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Currency :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{state.accountData?.currency_details != undefined && state.accountData?.currency_details?.currency_code.toUpperCase()}</b></CFormLabel>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Credit Limit :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b> {state.accountData?.available_balance}</b></CFormLabel>
                                        </div>
                                    </div>

                                </div>

                                <div className="text-center p-3 bg-info bg-opacity-10 border border-info rounded" style={{}}>
                                    <label className=''>Total Player Count : <b>{state.players_count}</b></label>

                                </div>
                                <div className="text-center">
                                    <span onClick={(e) => handleMenuSet(e, "Players")} style={{ cursor: 'pointer', color: "#3e97ff", textAlign: 'center' }}>Click to view your players</span>
                                </div>
                            </CForm>
                        </div>
                    </div>
                </div>
                <div className='col-8 '>
                    <div className='card shadow-lg rounded' >
                        <div className='card-body '>
                            {/* <Breadcrumbs /> */}
                            <CNav variant="underline-border">
                                {/* <CNavItem>
                                    <CNavLink active={menuName == 'General'} onClick={(e) => handleMenuSet(e, "General")}>
                                        General
                                    </CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink active={menuName == 'Technical'} onClick={(e) => handleMenuSet(e, "Technical")}>
                                        Technical
                                    </CNavLink>
                                </CNavItem> */}
                                <CNavItem>
                                    <CNavLink active={menuName == 'Players'} onClick={(e) => handleMenuSet(e, "Players")}>
                                        Players
                                    </CNavLink>
                                </CNavItem>
                                {/* <CNavItem>
                                    <CNavLink active={menuName == 'RevenueSetting'} onClick={(e) => handleMenuSet(e, "RevenueSetting")}>
                                        Revenue Setting
                                    </CNavLink>
                                </CNavItem> */}
                                <CNavItem>
                                    <CNavLink active={menuName == 'Transactions'} onClick={(e) => handleMenuSet(e, "Transactions")}>
                                        Transactions
                                    </CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink active={menuName == 'ManageGames'} onClick={(e) => handleMenuSet(e, "ManageGames")}>
                                        Manage Games
                                    </CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink active={menuName == 'ManageProviders'} onClick={(e) => handleMenuSet(e, "ManageProviders")}>
                                        Manage Providers
                                    </CNavLink>
                                </CNavItem>

                            </CNav>
                            <div className="m-3">
                                {(() => {
                                    switch (menuName) {
                                        case "Players":
                                            return <PlayersList />;
                                        case "Transactions":
                                            return <TransactionsList />;
                                        case "ManageGames":
                                            return <ManageGamesList />

                                        case "General":
                                            return <GeneralList />;
                                        case "Technical":
                                            return <TechnicalList />;
                                        case "RevenueSetting":
                                            return <RevenueSetting />;
                                        case "ManageProviders":
                                            return <ManageProviderList />


                                        default:
                                            return null;
                                    }
                                })()}
                            </div>

                        </div>
                    </div>

                </div>

            </div>


            <Modal backdrop="static" centered show={providerModal} size="lg"
                onHide={() => setProviderModal(false)}
            >
                <div className="modal_form_main">
                    <Modal.Header closeButton>
                        <h6 className="hed_txt">Provider Details</h6>
                    </Modal.Header>
                    <div className="row" style={{ margin: 10 }}>
                        {state.provider_list.map((item, key) => (
                            <div className="col-md-4">
                                <div class="card">
                                    <img src={item.provider_details?.dark_logo} class="card-img-top" alt="..." height={130} />
                                    <div class="card-body">
                                        <h5 class="card-title">{item.provider_details?.provider_name}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>
                </div>

            </Modal>

        </>
    )
}