import React from 'react'
import {
    CForm,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import ClientDetailsPage from './client-details';

export default function ClientAccountPage(props) {
    const getAccountDetails = useSelector((state) => state.client_Account_Details);
    const clientData = getAccountDetails?.alldata;//location?.state?.alldata;

    return (
        <>
            <ToastContainer />
            <div className='row'>
                <div className="d-flex bd-highlight">
                    <div className="p-2 w-100 bd-highlight"><h3 className="hed_txt pt-2">Client Account List</h3>
                    </div>
                    <div className="p-2 flex-fill  bd-highlight"></div>
                </div>


                <div className='col-4'>
                    <div className='card shadow-lg rounded' >
                        <div className='card-body'>
                            <CForm className="justify-content-center" style={{ margin: 10 }}>
                                <div className="row grid gap-2">
                                    <div className="p-2 g-col-12 ">
                                        <label>Client First Name : <b>{clientData?.first_name}</b></label>

                                    </div>
                                    <div className="p-2 g-col-12">
                                        <label>Client Last Name : <b>{clientData?.last_name}</b></label>

                                    </div>

                                    <div className="p-2 g-col-12">
                                        <label>Client Username : <b>{clientData?.username}</b></label>

                                    </div>
                                    <div className="p-2 g-col-12">
                                        <label>Client Contact No : <b>{clientData?.contact}</b> </label>

                                    </div>
                                    <div className="p-2 g-col-12">
                                        <label>Client Email : <b>{clientData?.email}</b> </label>

                                    </div>
                                    <div className="p-2 g-col-12 ">
                                        <label>Client Id : <b>{clientData?._id}</b></label>

                                    </div>
                                </div>

                            </CForm>
                        </div>
                    </div>
                </div>
                <div className='col-8'>
                    <ClientDetailsPage clientData={clientData?._id} client_name={clientData?.first_name + ' ' + clientData?.last_name} />
                </div>
            </div>

        </>
    )
}