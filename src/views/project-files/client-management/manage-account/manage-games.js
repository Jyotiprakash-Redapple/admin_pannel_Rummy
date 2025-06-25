
/**
 * @file_purpose  page for showing player list
 * @author Sucheta Singha
 * @Date_Created 10.12.2024
 * @Date_Modified 10.12.2024
 */
import React, { useState, useEffect } from "react";
import {
    CButton,
} from '@coreui/react'
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Service from "../../../../apis/Service";
import RouteURL from "../../../../apis/ApiURL";
import { Constants } from "../../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { camelCase } from "../../../../Utility/helper";
import moment from 'moment';

export default function ManageGamesList() {
    let navigate = useNavigate();
    const getClientAccountDetails = useSelector((state) => state.client_account_details);
    const token = useSelector((state) => state.user.token);
    const location = useLocation();
    let pathName = location.pathname;
    const [state, setState] = useState({
        list: [],
        search: '',
        limit: 10,
        page: 1,
        copied: false,
        currentPage: '',
        totalDataCount: '',
        totalPages: '',
        copyText: '',
        currentList: [],
        _status: false,
        account_id: '',
        provider_list: [],
        provider_id: '',
        game_category_list: [],
        game_category_id: '',
    })

    useEffect(() => {
        ProviderList();
        GameCategoryList();
    }, [])

    const ProviderList = () => {
        let params = JSON.stringify({
            "client_account_ids": [],
            "status": "active",
        })
        Service.apiPostCallRequest(RouteURL.allProviderList, params, token)
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

    const GameCategoryList = () => {
        Service.apiPostCallRequest(RouteURL.AllGameCategory, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        game_category_list: res?.data?.categories,
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


    useEffect(() => {
        AccountWiseGameList();
    }, [state.search, state.page, state.account_id, state.provider_id, state.game_category_id])

    const AccountWiseGameList = () => {
        let params = JSON.stringify({
            "client_account_id": getClientAccountDetails.accountId,
            "game_provider_id": state.provider_id,
            "game_category_id": state.game_category_id,
            "page": state.page,
            "limit": state.limit
        })

        Service.apiPostCallRequest(RouteURL.AccountWiseGameList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        list: res?.data?.games,
                        currentPage: res?.data?.current_page,
                        totalDataCount: res?.data?.total_count,
                        totalPages: res?.data?.total_page,

                    }));
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
                });
            });
    }

    const pageNavigate = (e) => {
        navigate("/assign-games", {
            state: {
                data: { client_id: getClientAccountDetails.clientID, account_id: getClientAccountDetails.accountId }
            }
        })
    }
    return (<div >
        <ToastContainer />
        <div>
            <div className='row'>
                <div className="col-sm-3">
                    <label>Provider</label>
                    <select className="form-select mb-1" id="provider_id" onChange={(e) => {
                        e.preventDefault();
                        setState((prevState) => ({
                            ...prevState, provider_id: e.target.value,
                        }));
                    }}
                        value={state.provider_id}
                    >
                        <option value="">Select Provider</option>
                        {state?.provider_list?.length > 0 && state?.provider_list?.map((data, key) => (
                            <option value={data.provider_id} key={key} >{data.provider_details.provider_name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-sm-3">
                    <label>Category</label>
                    <select className="form-select mb-1" id="game_category_id" onChange={(e) => {
                        e.preventDefault();
                        setState((prevState) => ({
                            ...prevState, game_category_id: e.target.value,
                        }));
                    }}
                        value={state.game_category_id}
                    >
                        <option value="">Select Category</option>
                        {state.game_category_list.length > 0 && state.game_category_list.map((item, key) => (
                            <option value={item._id} key={key} >
                                {item.category_name?.en}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-sm-3"></div>
                <div className="col-sm-3 d-flex text-end mt-4">
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
                            Add Games
                        </CButton>
                    }
                </div>


            </div>

            <div style={{ margin: 10 }} className="tableFixHead">
                <table className="table table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">Category</th>
                            <th scope="col">Provider</th>
                            <th scope="col">Game Name</th>
                            <th scope="col">Image</th>
                            <th scope="col">Release Date</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>

                        {state.list.length > 0 ? state.list.map((data, key) => (
                            <tr key={key}>
                                <td>{data.category_details?.category_name?.en}</td>
                                <td>{data.provider_details?.provider_name}</td>
                                <td>{data.game_details?.game_name}</td>
                                <td><img src={data.game_details?.game_image} width={100} height={60}></img></td>
                                <td>{moment(data.release_date).format('YYYY-MM-DD')}</td>
                                <td>{camelCase(data.status)}</td>
                            </tr >
                        )) : <tr style={{ textAlign: 'center' }}><td colSpan="6">No data found</td></tr>}


                    </tbody>
                </table>


            </div>
            <div className="row">
                {state.totalPages > 1 &&
                    <div className="col-12 d-flex justify-content-center">
                        {(() => {
                            const maxPagesToShow = 5;
                            const totalPages = state.totalPages;
                            const currentPage = state.page;
                            let pages = [];

                            let startPage = Math.max(
                                1,
                                currentPage - Math.floor(maxPagesToShow / 2)
                            );
                            let endPage = Math.min(
                                totalPages,
                                startPage + maxPagesToShow - 1
                            );

                            if (endPage - startPage < maxPagesToShow - 1) {
                                startPage = Math.max(1, endPage - maxPagesToShow + 1);
                            }

                            if (startPage > 1) {
                                pages.push(1); // Always show the first page
                            }
                            if (startPage > 2) {
                                pages.push("prev-ellipsis"); // Ellipsis before skipped pages
                            }

                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(i);
                            }

                            if (endPage < totalPages - 1) {
                                pages.push("next-ellipsis"); // Ellipsis after skipped pages
                            }
                            if (endPage < totalPages) {
                                pages.push(totalPages); // Always show the last page
                            }

                            return pages.map((page, index) =>
                                typeof page === "string" ? (
                                    <span key={page} className="mx-2">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={`page-${page}`} // Unique key to prevent duplicate rendering
                                        className={`btn mx-1 ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => {
                                            if (currentPage !== page) {
                                                setState((prevState) => ({ ...prevState, page }));
                                            }
                                        }}
                                    >
                                        {page}
                                    </button>
                                )
                            );
                        })()}
                    </div>
                }
            </div>
        </div>
    </div>)
}