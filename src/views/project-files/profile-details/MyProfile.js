/**
 * @file_purpose  page for client profile details
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
 */

import React, { useState, useEffect } from 'react'
import {
    CForm,
    CFormLabel
} from '@coreui/react'
import { useNavigate } from "react-router-dom";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants} from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import MyAccountList from './MyAccountList';


export default function ClientProfilePage(props) {
    const token = useSelector((state) => state.user.token);
    const [clientData, setClientData] = useState({})
    useEffect(() => {
        ClientListDetails();
    }, [])
    /**
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
  * @function sync
  * @functionName ClientListDetails
  * @functionPurpose this function for client list.
  *
  * @functionParam {payload object:filter_field,limit,page,}
  * 
  * @functionSuccess Success status and message.
  *
  * @functionError {Boolean} error error is there.
  * @functionError {String} message  Description message.
  */
    const ClientListDetails = () => {
        Service.apiPostCallRequest(RouteURL.clientDetails, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setClientData(res?.data[0]);
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

    return (
        <>
            {/* <ToastContainer /> */}
            <div className='row'>
                <div className="d-flex bd-highlight">
                    <div className="p-2 w-100 bd-highlight"><h3 className="hed_txt pt-2">My Account List</h3></div>
                    <div className="p-2 flex-fill  bd-highlight"></div>
                </div>


                <div className='col-4'>
                    <div className='card' >
                        <div className='card-body'>
                            <CForm className="justify-content-center" style={{ margin: 10 }}>
                                <div className="row grid gap-2">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client First Name :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{clientData?.first_name}</b></CFormLabel>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client Last Name :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{clientData?.last_name}</b></CFormLabel>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client Username :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{clientData?.username}</b></CFormLabel>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client Contact No :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{clientData?.contact}</b></CFormLabel>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client Email :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{clientData?.email}</b></CFormLabel>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input">Client ID :</CFormLabel>
                                        </div>
                                        <div className="col-md-6">
                                            <CFormLabel htmlFor="text-input"><b>{clientData?._id}</b></CFormLabel>
                                        </div>
                                    </div>
                                   
                                 
                                    {/* <div className="p-2 g-col-12">
                                        <label>Label: <b>{clientData?.levelDetails != undefined && clientData?.levelDetails.level_name}</b></label>
                                    </div>

                                    <div className="p-2 g-col-12">
                                        <label>Brand Name : <b>{clientData?.brand_name ? clientData?.brand_name : '-'}</b></label>
                                    </div>
                                    <div className="p-2 g-col-12">
                                        <label>Platform Name: <b>{clientData?.platform_name ? clientData?.platform_name : '-'}</b></label>

                                    </div> */}

                                </div>
                                {/* <div className="p-3 bg-info bg-opacity-10 border border-info rounded">
                                    <label className=''>Total Provider : <b>{providerCount}</b></label>

                                </div> */}

                            </CForm>
                        </div>
                    </div>
                </div>
                <div className='col-8'>
                    <MyAccountList clientData={clientData?._id} client_name={clientData?.first_name + ' ' + clientData?.last_name} />
                </div>
            </div>

        </>
    )
}