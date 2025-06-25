
import React, { useState, useEffect } from 'react'
import { CInputGroupText, CInputGroup, CFormInput, CTooltip } from '@coreui/react';
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants } from "../../../apis/Constant";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';

export default function GameList() {
    const token = useSelector((state) => state.user.token);
    const [state, setState] = useState({
        list: [],
        search: '',
        limit: 10,
        page: 1,
        copied: false,
        currentPage: '',
        totalGames: '',
        totalPages: '',
        copyText: '',
        provider_list: [],
        provider_id: '',
        game_category_list: [],
        game_category_id: '',
        status_id: 'active',
        account_id: ''
    });
    const [loader, setLoader] = useState(true)
    const [accountList, setAccountList] = useState([]);
    useEffect(() => {
        ProviderList();
        GameCategoryList();
        AccontList();
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
                    setState((prevState) => ({
                        ...prevState,
                        account_id: res?.data[0]?._id

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
        GameListDetails();
    }, [state.search, state.page, state.provider_id, state.status_id, state.game_category_id, state.account_id])

    const GameListDetails = () => {
        setLoader(true)
        let params = JSON.stringify({
            "search": state.search,
            "limit": state.limit,
            "page": state.page,
            "game_category_id": state.game_category_id,
            "status": state.status_id,
            "game_provider_id": state.provider_id,
            "client_account_ids": state.account_id ? [state.account_id] : []

        })

        Service.apiPostCallRequest(RouteURL.gameList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setLoader(false)
                    setState((prevState) => ({
                        ...prevState,
                        list: res?.data?.games,
                        currentPage: res?.data?.current_page,
                        totalGames: res?.data?.total_count,
                        totalPages: res?.data?.total_page,

                    }));
                } else {
                    setLoader(false)
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

    const onCopy = React.useCallback((id) => {
        setState(prevState => ({
            ...prevState,
            copied: true,
            copyText: id
        }))
    }, [])

    return (<div >
        <ToastContainer />

        <div className='card shadow-lg rounded' >
            <div className='card-body'>
                <h3 className="hed_txt pt-2">Game List</h3>
                <div className="row" style={{ padding: "20px" }}>


                    <div className="col-sm-2">
                        <label>Account</label>
                        <select className="form-select mb-1" id="account_id" onChange={(e) => {
                            e.preventDefault();
                            setState((prevState) => ({
                                ...prevState, account_id: e.target.value
                            }));
                        }}
                            value={state.account_id}
                        >
                            <option value="">Select Account</option>
                            {accountList.length > 0 && accountList.map((list, key) => (
                                <option value={list._id} key={key} >{list.account_name}</option>
                            ))}
                        </select>
                    </div>

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
                    <div className="col-sm-2">
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

                    <div className="col-sm-3 mt-4">
                        <CInputGroup className="mb-3">
                            <CInputGroupText>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                            <CFormInput type="text" autoComplete="off" placeholder="Search Game ID" id="search" value={state.search} onChange={(e) => {
                                e.preventDefault();
                                setState((prevState) => ({
                                    ...prevState, search: e.target.value, page: 1, limit: 10
                                }));
                            }} />
                        </CInputGroup>
                    </div>

                </div>

                <div style={{ margin: 10 }}
                // class="tableFixHead"
                >
                    <table className="table table-hover ">
                        <thead className="table-primary">
                            <tr>
                                <th>Image</th>
                                <th style={{ width: "11%" }}>Game ID</th>
                                <th style={{ width: "11%" }}>Game Name</th>
                                <th style={{ width: "11%" }}>Category</th>
                                <th style={{ width: "11%" }}>Code</th>
                                <th style={{ width: "11%" }}>Provider</th>
                                {/* <th style={{ width: "11%" }}>Status</th> */}
                            </tr>
                        </thead>
                        <tbody>

                            {state.list.length > 0 ? state.list.map((data, key) => (
                                <tr key={key}>

                                    <td scope="row">
                                        <img style={{ width: "30%" }}
                                            src={data?.game_details?.game_image ? data?.game_details?.game_image : '-'} /> </td>
                                    <td >
                                        <span style={{ textDecoration: 'none', color: state.copyText != data.game_id ? '' : '#1b9e3e' }}>{data.game_id.substr(0, 5) + '...'} </span>&nbsp;
                                        <CopyToClipboard text={data.game_id}
                                            onCopy={() => onCopy(data.game_id)}>

                                            <a href="javascript:void(0)" style={{ textDecoration: 'none', color: state.copyText != data.game_id ? '' : '#1b9e3e' }} key={key} >
                                                <CTooltip content={data.game_id}>
                                                    {state.copyText != data.game_id ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                                        <path fillFule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                                    </svg> :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16" color='#1b9e3e'>
                                                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                        </svg>
                                                    }
                                                </CTooltip>
                                            </a>

                                        </CopyToClipboard></td>
                                    <td>{data.game_details?.game_name}</td>

                                    <td>{(data?.category_details?.category_name?.en)}</td>
                                    <td>{data.game_details?.game_code}</td>
                                    <td>{data.provider_details?.provider_name}</td>
                                </tr >
                            )) : <tr style={{ textAlign: 'center' }}><td colSpan="6">No data found</td></tr>}

                        </tbody>
                    </table>
                </div>

                <div className="row" style={{ padding: "20px" }}>
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
        </div>
    </div>)

}