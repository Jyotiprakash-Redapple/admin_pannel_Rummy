import React, { useState, useEffect, useRef } from "react";
import {
    CTooltip,
    CLink,
    CInputGroup,
    CInputGroupText,
    CFormInput,
} from "@coreui/react";
import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from "sweetalert2";

export default function AssignProvider() {
    const token = useSelector((state) => state.user.token);
    let navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        list: [],
        search: "",
        limit: 5,
        page: 1,
        copied: false,
        client_id: "",
        provider_list: [],
        isActive: false,
        account_list: [],
        isActiveAC: false,
        selected_account_data: [],
        selected_provider_data: [],
        reload_provider: false,
        copyText: "",
        currentPage: "",
        totalGames: "",
        totalPages: "",
    });
    const [clientAccountIds, setClientAccountIds] = useState([]);
    const [providerIds, setProviderIds] = useState([]);
    const [selectedProviderIds, setSelectedProviderIds] = useState([]);  // Global Selected Provider Ids
    const [selectedProvidersIds, setSelectedProvidersIds] = useState({});



    useEffect(() => {
        if (location?.state) {
            console.log(location?.state.data.client_id);

            setState((prevState) => ({
                ...prevState,
                client_id: location?.state?.data?.client_id,
                currency_code: location?.state?.data?.currency_code,
            }));
        }
    }, []);
    useEffect(() => {
        ClientListDetails();
        ProviderListDetails();
    }, [state.search, state.page]);

    useEffect(() => {
        if (state.reload_provider == true || state.search) ProviderListDetails();
    }, [state.reload_provider, state.search]);

    const ClientListDetails = () => {
        Service.apiPostCallRequest(RouteURL.allClientList, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        list: res?.data,
                    }));
                } else {
                    toast.error(res.message, {
                        position: "bottom-right",
                        closeOnClick: true,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            account_list: [],
            isActiveAC: false,
            selected_account_data: [],
            selected_provider_data: [],
        }));
        if (state?.client_id) AccountListDetails();
    }, [state.client_id]);
    const AccountListDetails = () => {
        let params = JSON.stringify({
            client_id: state.client_id,
        });

        Service.apiPostCallRequest(RouteURL.clientwiseAccountsList, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let response = res?.data;

                    if (location?.state) {
                        let result = [];
                        response.forEach((object) => {
                            if (location?.state?.data?.account_id == object._id) {
                                object.isActiveAC = true;
                                let _data = { account_id: object._id };
                                result.push(_data);
                            } else object.isActiveAC = false;
                        });

                        setState((prevState) => ({
                            ...prevState,
                            account_list: response,
                            selected_account_data: result,
                        }));
                    } else {
                        response.forEach((object) => {
                            object.isActiveAC = false;
                        });
                        setState((prevState) => ({
                            ...prevState,
                            account_list: response,
                        }));
                    }
                } else {
                    toast.error(res.message, {
                        position: "bottom-right",
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };

    const ProviderListDetails = (
        client_account_ids = state.selected_account_data.map((acc) => acc.account_id),
        clearSelection = false
      ) => {
        let params = JSON.stringify({
            client_account_ids: client_account_ids.length > 0 ? client_account_ids : [],
            status: "active",
            search: state.search,
            page: state.page,
            limit: state.limit,
        });

        Service.apiPostCallRequest(RouteURL.allProviderListWithPagination, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let response = res?.data?.data || [];

                    const updatedSelectedProvidersIds = clearSelection ? {} : { ...selectedProvidersIds };

                    response = response.map((provider) => {
                        let isActive = false;

                        if (updatedSelectedProvidersIds.hasOwnProperty(provider.provider_id)) {
                            isActive = updatedSelectedProvidersIds[provider.provider_id];
                        } else if (!clearSelection && provider.assigned_to) {
                            isActive = true;
                            updatedSelectedProvidersIds[provider.provider_id] = true;
                        }

                        return { ...provider, isActive };
                    });

                    const isAllSelectedOnPage = response.length > 0 && response.every((item) => item.isActive);

                    const selectedData = Object.keys(updatedSelectedProvidersIds)
                        .filter((id) => updatedSelectedProvidersIds[id])
                        .map((id) => {
                            const provider = response.find((p) => p.provider_id === id);
                            return provider
                                ? {
                                    provider_id: provider.provider_id,
                                    provider_account_id: provider.provider_parent_id,
                                }
                                : null;
                        })
                        .filter(Boolean);

                    const provider_ids = Object.keys(updatedSelectedProvidersIds).filter((id) => updatedSelectedProvidersIds[id]);

                    setSelectedProvidersIds(updatedSelectedProvidersIds);
                    setProviderIds(provider_ids);

                    setState((prevState) => ({
                        ...prevState,
                        provider_list: response,
                        reload_provider: false,
                        selected_provider_data: selectedData,
                        isActive: isAllSelectedOnPage,
                        currentPage: res?.data?.current_page || 1,
                        totalGames: res?.data?.total_count || 0,
                        totalPages: res?.data?.total_pages || 1,
                    }));
                } else {
                    toast.error(res.message, {
                        position: "bottom-right",
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "An error occurred", {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };





    const selectedProvider = (e) => {
        const check = e.target.checked;
        const alldata = [...state.provider_list];

        // Update selectedProviderIds Array
        let updatedSelectedProviderIds = [];

        if (check) {
            const ids = alldata.map((item) => item.provider_id);
            updatedSelectedProviderIds = [...new Set([...selectedProviderIds, ...ids])];
        } else {
            const ids = alldata.map((item) => item.provider_id);
            updatedSelectedProviderIds = selectedProviderIds.filter(
                (id) => !ids.includes(id)
            );
        }

        alldata.forEach((item) => {
            item.isActive = check;
        });

        const selectedData = check
            ? alldata.map((obj) => ({
                provider_id: obj.provider_id,
                provider_account_id: obj.provider_parent_id,
            }))
            : [];

        const provider_ids = check
            ? alldata.map((obj) => obj.provider_id)
            : [];

        const updatedSelectedProvidersIdsObj = { ...selectedProvidersIds };
        alldata.forEach((item) => {
            updatedSelectedProvidersIdsObj[item.provider_id] = check;
        });

        setSelectedProvidersIds(updatedSelectedProvidersIdsObj);
        setSelectedProviderIds(updatedSelectedProviderIds);

        setState((prevState) => ({
            ...prevState,
            provider_list: alldata,
            isActive: check,
            selected_provider_data: selectedData,
        }));

        setProviderIds(provider_ids);
    };


    const onChangeSelectForProvider = (check, key) => {
        const alldata = [...state.provider_list];
        alldata[key].isActive = check;

        const updatedSelectedProvidersIds = {
            ...selectedProvidersIds,
            [alldata[key].provider_id]: check,
        };

        let selectedIds = [...selectedProviderIds];
        if (check) {
            selectedIds.push(alldata[key].provider_id);
        } else {
            selectedIds = selectedIds.filter((id) => id !== alldata[key].provider_id);
        }

        // 🔥 Create selected_provider_data dynamically
        const selectedData = Object.keys(updatedSelectedProvidersIds)
            .filter((id) => updatedSelectedProvidersIds[id])
            .map((id) => {
                const provider = alldata.find((p) => p.provider_id === id);
                return provider
                    ? { provider_id: provider.provider_id, provider_account_id: provider.provider_parent_id }
                    : null;
            })
            .filter(Boolean);

        const provider_ids = selectedData.map((item) => item.provider_id);

        setSelectedProvidersIds(updatedSelectedProvidersIds);
        setSelectedProviderIds(selectedIds);

        setState((prevState) => ({
            ...prevState,
            provider_list: alldata,
            isActive: alldata.every((item) => item.isActive),
            selected_provider_data: selectedData,
        }));

        setProviderIds(provider_ids);
    };




    // ✅ SELECT ALL ACCOUNTS
    const selectedAccount = (e) => {
        let check = e.target.checked;

        const alldata = [...state.account_list];
        alldata.forEach((item) => {
            item.isActiveAC = check;
        });

        let checkValue = alldata.filter((obj) => obj.isActiveAC === true);
        let result = [],
            client_account_ids = [];

        checkValue.forEach((data) => {
            result.push({ account_id: data._id });
            client_account_ids.push(data._id);
        });

        // ✅ Update state
        setState((prevState) => ({
            ...prevState,
            account_list: alldata,
            isActiveAC: check,
            selected_account_data: result,
        }));
        setClientAccountIds(client_account_ids);

        if (client_account_ids.length === 0) {
            // 🔥 CLEAR PROVIDER SELECTIONS GLOBALLY
            setSelectedProvidersIds({});
            setSelectedProviderIds([]);
            setProviderIds([]);

            const clearedProviderList = state.provider_list.map((provider) => ({
                ...provider,
                isActive: false,
                assigned_to: "",
            }));

            setState((prevState) => ({
                ...prevState,
                selected_provider_data: [],
                provider_list: clearedProviderList,
                isActive: false,
            }));
        } else {
            ProviderListDetails(client_account_ids);
        }
    };

    // ✅ SELECT SINGLE ACCOUNT
    const onChangeSelectForAccount = (check, key) => {
        const alldata = [...state.account_list];
        alldata[key].isActiveAC = check;

        let checkValue = alldata.filter((obj) => obj.isActiveAC === true);
        let result = [],
            client_account_ids = [];

        checkValue.forEach((data) => {
            result.push({ account_id: data._id });
            client_account_ids.push(data._id);
        });

        setState((prevState) => ({
            ...prevState,
            account_list: alldata,
            isActiveAC: alldata.length === checkValue.length,
            selected_account_data: result,
        }));

        setClientAccountIds(client_account_ids);

        if (client_account_ids.length === 0) {
            // 🔥 CLEAR PROVIDER SELECTIONS GLOBALLY
            setSelectedProvidersIds({});
            setSelectedProviderIds([]);
            setProviderIds([]);

            const clearedProviderList = state.provider_list.map((provider) => ({
                ...provider,
                isActive: false,
                assigned_to: "",
            }));

            setState((prevState) => ({
                ...prevState,
                selected_provider_data: [],
                provider_list: clearedProviderList,
                isActive: false,
            }));
        } else {
            ProviderListDetails(client_account_ids);
        }
    };


    useEffect(() => { }, [
        state.client_id,
        state.selected_account_data,
        state.selected_provider_data,
    ]);

    const submitDetails = (type) => {
        let params = {
            client_id: state.client_id,
            client_account_ids: location?.state?.data?.account_id
                ? [location?.state?.data?.account_id]
                : clientAccountIds,
            provider_ids: Object.keys(selectedProvidersIds).filter(id => selectedProvidersIds[id]),
            type: type,
        };

        Service.apiPostCallRequest(RouteURL.assignDeassignProvider, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    toast.success(res.message, {
                        position: "bottom-right",
                        closeOnClick: true,
                    });

                    let updatedProviderList = [...state.provider_list];
                    let updatedSelectedProvidersIds = { ...selectedProvidersIds };
                    let updatedSelectedProviderIds = [...selectedProviderIds];
                    let selectedData = [];

                    // ✅ ASSIGNING
                    if (type === "assign") {
                        updatedProviderList = updatedProviderList.map((provider) => {
                            if (providerIds.includes(provider.provider_id)) {
                                updatedSelectedProvidersIds[provider.provider_id] = true;

                                if (!updatedSelectedProviderIds.includes(provider.provider_id)) {
                                    updatedSelectedProviderIds.push(provider.provider_id);
                                }

                                selectedData.push({
                                    provider_id: provider.provider_id,
                                    provider_account_id: provider.provider_parent_id,
                                });

                                return { ...provider, isActive: true };
                            }
                            return provider;
                        });

                        setSelectedProvidersIds(updatedSelectedProvidersIds);
                        setSelectedProviderIds(updatedSelectedProviderIds);
                        setProviderIds(updatedSelectedProviderIds);
                    }

                    // ✅ DEASSIGNING
                    if (type === "deassign") {
                        updatedProviderList = updatedProviderList.map((provider) => {
                            if (providerIds.includes(provider.provider_id)) {
                                return {
                                    ...provider,
                                    isActive: false,
                                    assigned_to: "", // Clear display
                                };
                            }
                            return provider;
                        });

                        // Filter out removed
                        updatedSelectedProviderIds = updatedSelectedProviderIds.filter(
                            (id) => !providerIds.includes(id)
                        );

                        providerIds.forEach((id) => {
                            delete updatedSelectedProvidersIds[id];
                        });

                        selectedData = updatedProviderList
                            .filter((p) => updatedSelectedProviderIds.includes(p.provider_id))
                            .map((p) => ({
                                provider_id: p.provider_id,
                                provider_account_id: p.provider_parent_id,
                            }));

                        // Fully clear global selected trackers
                        setSelectedProvidersIds({});
                        setSelectedProviderIds([]);
                        setProviderIds([]);
                    }

                    setState((prevState) => ({
                        ...prevState,
                        provider_list: updatedProviderList,
                        selected_provider_data: selectedData,
                        isActive:
                            updatedProviderList.length > 0 &&
                            updatedProviderList.every((item) => item.isActive),
                    }));

                    // 🚀 Smart backend wait buffer to allow true refresh
                    setTimeout(() => {
                        ProviderListDetails(clientAccountIds, type === "deassign");
                    }, 100);
                } else {
                    toast.error(res.message, {
                        position: "bottom-right",
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "An error occurred", {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };
    const IsConfirmed = (type) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to  ${type == "assign" ? "assign" : "unassign"} provider!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                submitDetails(type);
            }
        });
    };

    const onCopy = React.useCallback((id) => {
        setState((prevState) => ({
            ...prevState,
            copied: true,
            copyText: id,
        }));
    }, []);

    return (
        <div>
            <ToastContainer />
            <div className="card shadow-lg rounded mb-3">
                <div className="card-body ">
                    <h3 className="hed_txt pt-2">Assign/Un-assign Providers</h3>
                    <div>
                        <span style={{ color: "#3d99f5" }}>
                            ASSIGN OR UN-ASSIGN MULTIPLE PROVIDERS TO OR FROM CLIENTS
                        </span>{" "}
                        <br />
                        <span style={{ color: "#db5d5d94" }}>
                            1. Select a Client &nbsp;&nbsp;2. Select Client Account
                            &nbsp;&nbsp; 3. Checkbox next to Provider(s) to be Assigned OR
                            Un-assigned &nbsp;&nbsp;4. Click Assign(BLUE) / Un-assign(RED) on
                            the left &nbsp;&nbsp;
                        </span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <div className="card shadow-lg rounded mb-3">
                        <div className="card-body" style={{ margin: 10 }}>
                            <div className="row ">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary mb-2"
                                    onClick={() => IsConfirmed("assign")}
                                    disabled={
                                        state.selected_account_data.length > 0 &&
                                            state.selected_provider_data.length > 0
                                            ? false
                                            : true
                                    }
                                >
                                    ASSIGN PROVIDERS TO CLIENTS
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm mb-3"
                                    onClick={() => IsConfirmed("deassign")}
                                    style={{ color: "#fff" }}
                                    disabled={
                                        state.selected_account_data.length > 0 &&
                                            state.selected_provider_data.length > 0
                                            ? false
                                            : true
                                    }
                                >
                                    UN-ASSIGN PROVIDERS FROM SELECTED CLIENTS
                                </button>




                            </div>
                            <div className="row mb-3">
                                <label>
                                    Client<span style={{ color: "red" }}> *</span>
                                </label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id="client_id"
                                    value={state.client_id}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setState((prevState) => ({
                                            ...prevState,
                                            client_id: e.target.value,
                                            page: 1,
                                        }));
                                    }}
                                >
                                    <option value="">Select Client</option>
                                    {state.list.map((item, key) => (
                                        <option value={item._id} key={key}>
                                            {item?.first_name +
                                                " " +
                                                item?.last_name +
                                                " " +
                                                "(" +
                                                item?.username?.toUpperCase() +
                                                ")"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="row">
                                <label>Client Account List</label>
                                <div
                                    style={{ marginTop: 10, overflowX: "auto" }}
                                    className="table-responsive"
                                >
                                    <table className="table table-striped">
                                        <thead className="table-primary">
                                            <tr>
                                                {state.client_id && state?.account_list.length > 0 && (
                                                    <th>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={state.isActiveAC}
                                                            id="flexCheckChecked"
                                                            onChange={selectedAccount}
                                                        />
                                                    </th>
                                                )}
                                                <th scope="col">Account Name</th>
                                                <th scope="col">Account Id</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {state?.account_list.length > 0 ? (
                                                state?.account_list.map((data, key) => (
                                                    <tr key={key} className="table-data">
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={data.isActiveAC}
                                                                onChange={(ev) =>
                                                                    onChangeSelectForAccount(
                                                                        ev.target.checked,
                                                                        key
                                                                    )
                                                                }
                                                                style={{
                                                                    marginRight: 5,
                                                                    borderColor: "#8fbc8f",
                                                                }}
                                                            />{" "}
                                                        </td>
                                                        <td scope="row">
                                                            <span
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color:
                                                                        state.copyText != data.account_name
                                                                            ? ""
                                                                            : "#1b9e3e",
                                                                }}
                                                            >
                                                                {data.account_name.length > 8
                                                                    ? data.account_name.substr(0, 8) + "..."
                                                                    : data.account_name}
                                                                &nbsp;
                                                            </span>
                                                            <CopyToClipboard text={data.account_name}>
                                                                <a
                                                                    href="javascript:void(0)"
                                                                    style={{
                                                                        textDecoration: "none",
                                                                        color:
                                                                            state.copyText != data.account_name
                                                                                ? ""
                                                                                : "#1b9e3e",
                                                                    }}
                                                                    key={key}
                                                                >
                                                                    <CTooltip content={data.account_name}>
                                                                        {state.copyText != data.account_name ? (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="16"
                                                                                height="16"
                                                                                fill="currentColor"
                                                                                className="bi bi-copy"
                                                                                viewBox="0 0 16 16"
                                                                            >
                                                                                <path
                                                                                    fillFule="evenodd"
                                                                                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                                                                                />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="16"
                                                                                height="16"
                                                                                fill="currentColor"
                                                                                className="bi bi-check-lg"
                                                                                viewBox="0 0 16 16"
                                                                                color="#1b9e3e"
                                                                            >
                                                                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                                            </svg>
                                                                        )}
                                                                    </CTooltip>
                                                                </a>
                                                            </CopyToClipboard>
                                                        </td>

                                                        <td>
                                                            <CTooltip content={data._id}>
                                                                <CLink style={{ textDecoration: "none" }}>
                                                                    {window.screen.width < 1400 ||
                                                                        window.screen.width > 1200
                                                                        ? data._id.substr(0, 8) + "..."
                                                                        : data._id}{" "}
                                                                </CLink>
                                                            </CTooltip>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr style={{ textAlign: "center" }}>
                                                    <td colSpan="3">Not Found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className="card shadow-lg rounded">
                        <div className="card-body">
                            {/* <h3 className="hed_txt pt-2">Provider List</h3> */}
                            <div className="row">
                                <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-5 col-sm-8 col-8">
                                    <h3 className="hed_txt pt-2">Provider List</h3>
                                </div>
                                <div className="col-xxl-6 col-xl-3 col-lg-3 col-md-4 d-none d-md-block">
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilSearch} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Search Provider by Provider Id"
                                            id="search"
                                            value={state.search}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                setState((prevState) => ({
                                                    ...prevState,
                                                    search: e.target.value,
                                                }));
                                            }}
                                        />
                                    </CInputGroup>
                                </div>
                            </div>
                            <div
                                style={{ margin: 10, overflowX: "auto" }}
                                className="table-responsive"
                            >
                                <table className="table table-hover">
                                    <thead className="table-primary">
                                        <tr>
                                            {state?.provider_list.length > 0 && (
                                                <th>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={state.isActive}
                                                        id="flexCheckChecked"
                                                        onChange={selectedProvider}
                                                    />
                                                </th>
                                            )}
                                            <th scope="col">Provider Name</th>
                                            <th scope="col">Assigned To</th>
                                            <th scope="col">Provider Id</th>
                                            {/* <th scope="col">Status</th> */}
                                            <th scope="col">Logo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state?.provider_list.length > 0 ? (
                                            state?.provider_list.map((data, key) => (
                                                <tr key={key} className="table-data">
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={data.isActive}
                                                            onChange={(ev) =>
                                                                onChangeSelectForProvider(
                                                                    ev.target.checked,
                                                                    key
                                                                )
                                                            }
                                                            style={{ marginRight: 5, borderColor: "#8fbc8f" }}
                                                        />{" "}{ }
                                                    </td>
                                                    <td scope="row">{data.provider_details?.provider_name}</td>
                                                    <td scope="row">{data.assigned_to}</td>
                                                    <td>
                                                        <span
                                                            className="d-inline-block"
                                                            tabIndex="0"
                                                            data-bs-toggle="tooltip"
                                                            data-bs-title="Disabled tooltip"
                                                        ></span>
                                                        <span
                                                            style={{
                                                                textDecoration: "none",
                                                                color:
                                                                    state.copyText != data.provider_id
                                                                        ? ""
                                                                        : "#1b9e3e",
                                                            }}
                                                        >
                                                            {data.provider_id.substr(0, 8) + "..."}{" "}
                                                        </span>
                                                        &nbsp;
                                                        <CopyToClipboard
                                                            text={data.provider_id}
                                                            onCopy={() => onCopy(data.provider_id)}
                                                        >
                                                            <a
                                                                href="javascript:void(0)"
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color:
                                                                        state.copyText != data.provider_id
                                                                            ? ""
                                                                            : "#1b9e3e",
                                                                }}
                                                                key={key}
                                                            >
                                                                <CTooltip content={data.provider_id}>
                                                                    {state.copyText != data.provider_id ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="currentColor"
                                                                            className="bi bi-copy"
                                                                            viewBox="0 0 16 16"
                                                                        >
                                                                            <path
                                                                                fillFule="evenodd"
                                                                                d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                                                                            />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="currentColor"
                                                                            className="bi bi-check-lg"
                                                                            viewBox="0 0 16 16"
                                                                            color="#1b9e3e"
                                                                        >
                                                                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                                        </svg>
                                                                    )}
                                                                </CTooltip>
                                                            </a>
                                                        </CopyToClipboard>
                                                    </td>
                                                    {/* <td style={{ color: data.already_assigned == 1 ? 'green' : 'red' }}>{data.already_assigned == 1 ? 'Assigned' : 'Inactive'}</td> */}
                                                    <td><img src={data.provider_details?.dark_logo} height={40} width={40} style={{ borderRadius: 10 }} /></td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr style={{ textAlign: "center" }}>
                                                <td colSpan="4">Not Found</td>
                                            </tr>
                                        )}
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
                    </div>
                </div>
            </div>
        </div>
    );
}
