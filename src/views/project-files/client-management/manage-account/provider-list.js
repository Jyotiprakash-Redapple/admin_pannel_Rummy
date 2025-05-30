
/**
 * @file_purpose  page for showing player list
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
 */
import React, { useState, useEffect } from "react";
import {
    CButton
} from '@coreui/react'
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Service from "../../../../apis/Service";
import RouteURL from "../../../../apis/ApiURL";
import { Constants } from "../../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';

export default function ManageProviders() {
    let navigate = useNavigate();
    const location = useLocation();
    let pathName = location.pathname;
    const getClientAccountDetails = useSelector((state) => state.client_account_details);
    const token = useSelector((state) => state.user.token);
    const [state, setState] = useState({
        provider_list: []
    })

    useEffect(() => {
        ProviderList()
    }, [])

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

    const pageNavigate = (e) => {
        navigate("/assign-provider", {
            state: {
                data: { client_id: getClientAccountDetails.clientID, account_id: getClientAccountDetails.accountId }
            }
        })
    }

    return (
        <>
            <div className="row" style={{ padding: "20px" }}>
                <div className="col-sm-10">
                </div>

                <div className="col-sm-2 d-flex justify-content-center">
                    {pathName !== "/my-account-list/client-manage-account" &&
                        <CButton
                            color="primary"
                            onClick={(e) =>
                                pageNavigate(e)
                            }

                            style={{
                                width: "150px",  // Set the fixed width
                                height: "40px",  // Set the fixed height
                                padding: "px",   // Optional: remove extra padding to align text properly
                            }}
                        >
                            Add Provider
                        </CButton>
                    }
                </div>
            </div>
            
            <div className="row">
                {state.provider_list.map((item, key) => (
                    <div className="col-md-4 mb-5">
                        <div class="card" style={{ width: "18rem" }}>
                            <img src={item.provider_details?.dark_logo} class="card-img-top" alt="..." height={150} width={100} />
                            <div class="card-body">
                                <h5 class="card-title">{item.provider_details?.provider_name}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
