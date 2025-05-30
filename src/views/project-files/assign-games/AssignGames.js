import React, { useState, useEffect } from "react";
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
import { Constants } from "../../../apis/Constant";
import { ToastContainer, toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from "sweetalert2";

export default function AssignGames() {
    const token = useSelector((state) => state.user.token);
    let navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        list: [],
        search: "",
        limit: 10,
        page: 1,
        copied: false,
        client_id: "",
        game_list: [],
        isActive: false,
        account_list: [],
        isActiveAC: false,
        selected_account_data: [],
        selected_game_data: [],
        reload_game: false,
        copyText: "",
        game_category_list: [],
        provider_list: [],
        game_category_id: "",
        provider_id: "",
        currentPage: "",
        totalGames: "",
        totalPages: "",
    });
    const [clientAccountIds, setClientAccountIds] = useState([]);
    const [gameIds, setGameIds] = useState([]);
    const [selectedGameIds, setSelectedGameIds] = useState([]);
    const [selectedGamesIds, setSelectedGamesIds] = useState({});
    const [manuallyDeselectedGameIds, setManuallyDeselectedGameIds] = useState({});

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
        ProviderList();
        GameCategoryList();
        GameListDetails();
    }, [
        state.search,
        state.page,
        state.provider_id,
        state.game_category_id,
    ]);

    useEffect(() => {
        if (state.reload_game == true || state.search) GameListDetails();
    }, [
        state.reload_game,
        state.search,
        state.provider_id,
        state.game_category_id,
    ]);

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

    const GameCategoryList = () => {
        Service.apiPostCallRequest(RouteURL.AllGameCategory, {}, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    setState((prevState) => ({
                        ...prevState,
                        game_category_list: res?.data.categories,
                    }));
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
    }
    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            account_list: [],
            isActiveAC: false,
            selected_account_data: [],
            selected_game_data: [],
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
    // Main logic to load game list
    const GameListDetails = (
        client_account_ids = state.selected_account_data.map((acc) => acc.account_id),
        clearSelection = false
    ) => {
        const params = JSON.stringify({
            client_account_ids: client_account_ids.length > 0 ? client_account_ids : [],
            status: "active",
            search: state.search,
            game_category_id: state.game_category_id,
            game_provider_id: state.provider_id,
            page: state.page,
            limit: state.limit,
        });

        Service.apiPostCallRequest(RouteURL.allGamesWithPagination, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    let response = res?.data?.games || [];

                    // Restore previous selections unless clearing
                    let updatedSelectedGamesIds = clearSelection ? {} : { ...selectedGamesIds };

                    // Apply selection and deselection logic
                    response = response.map((game) => {
                        let isActive = false;

                        // 1. If game is assigned AND not manually deselected, select it
                        if (game.assigned_to && !manuallyDeselectedGameIds[game._id]) {
                            updatedSelectedGamesIds[game._id] = true;
                            isActive = true;
                        }

                        // 2. If game was manually selected before, also select it
                        if (updatedSelectedGamesIds[game._id]) {
                            isActive = true;
                        }

                        // 3. If game was assigned but user deselected it, mark as inactive
                        if (manuallyDeselectedGameIds[game._id]) {
                            isActive = false;
                        }

                        return { ...game, isActive };
                    });

                    // Check if all on current page are selected
                    const isAllSelectedOnPage =
                        response.length > 0 && response.every((game) => game.isActive);

                    // Collect all selected game data
                    const selectedIds = Object.keys(updatedSelectedGamesIds);
                    const allSelectedData = selectedIds.map((id) => {
                        const match = response.find((g) => g._id === id);
                        return {
                            game_id: id,
                            game_account_id: match?.client_account_id || null,
                        };
                    });

                    // Update global state
                    setSelectedGamesIds(updatedSelectedGamesIds);
                    setGameIds(selectedIds);
                    setState((prev) => ({
                        ...prev,
                        game_list: response,
                        isActive: isAllSelectedOnPage,
                        selected_game_data: allSelectedData,
                        reload_game: false,
                        currentPage: res?.data?.current_page || 1,
                        totalGames: res?.data?.total_count || 0,
                        totalPages: res?.data?.total_pages || 1,
                    }));
                } else {
                    toast.error(res.message || "Failed to load games", {
                        position: "bottom-right",
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || "An error occurred", {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };
    // Select all games
    const selectedGame = (e) => {
        const check = e.target.checked;

        const updatedSelectedGamesIds = { ...selectedGamesIds };
        const updatedDeselectedGameIds = { ...manuallyDeselectedGameIds };
        const currentPageGames = [...state.game_list];

        currentPageGames.forEach((game) => {
            if (check) {
                // Select game
                updatedSelectedGamesIds[game._id] = true;

                // If game was manually deselected before, remove from that list
                if (updatedDeselectedGameIds[game._id]) {
                    delete updatedDeselectedGameIds[game._id];
                }

                game.isActive = true;
            } else {
                // Deselect game
                delete updatedSelectedGamesIds[game._id];
                game.isActive = false;

                // If it's an assigned game, mark it as manually deselected
                if (game.assigned_to) {
                    updatedDeselectedGameIds[game._id] = true;
                }
            }
        });

        const selectedIds = Object.keys(updatedSelectedGamesIds);

        const selectedData = selectedIds.map((id) => {
            const game = currentPageGames.find((g) => g._id === id);
            return game ? { game_id: game._id, game_account_id: game.client_account_id } : null;
        }).filter(Boolean);

        setSelectedGamesIds(updatedSelectedGamesIds);
        setSelectedGameIds(selectedIds);
        setGameIds(selectedIds);
        setManuallyDeselectedGameIds(updatedDeselectedGameIds);

        setState((prevState) => ({
            ...prevState,
            game_list: currentPageGames,
            isActive: currentPageGames.length > 0 && currentPageGames.every(g => g.isActive),
            selected_game_data: selectedData,
        }));
    };
    // Select single game
    const onChangeSelectForGame = (check, key) => {
        const updatedGameList = [...state.game_list];
        const game = updatedGameList[key];
        game.isActive = check;

        const updatedSelectedGamesIds = { ...selectedGamesIds };

        if (check) {
            updatedSelectedGamesIds[game._id] = true;

            // If re-selected, remove from manual deselections
            if (manuallyDeselectedGameIds[game._id]) {
                const updatedDeselections = { ...manuallyDeselectedGameIds };
                delete updatedDeselections[game._id];
                setManuallyDeselectedGameIds(updatedDeselections);
            }
        } else {
            delete updatedSelectedGamesIds[game._id];

            // If it was assigned, mark as manually deselected
            if (game.assigned_to) {
                setManuallyDeselectedGameIds((prev) => ({
                    ...prev,
                    [game._id]: true,
                }));
            }
        }

        const selectedIds = Object.keys(updatedSelectedGamesIds);

        const selectedData = selectedIds.map((id) => {
            const g = updatedGameList.find((item) => item._id === id);
            return g ? { game_id: g._id, game_account_id: g.client_account_id } : null;
        }).filter(Boolean);

        setSelectedGamesIds(updatedSelectedGamesIds);
        setSelectedGameIds(selectedIds);
        setGameIds(selectedIds);

        setState((prevState) => ({
            ...prevState,
            game_list: updatedGameList,
            isActive: updatedGameList.length > 0 && updatedGameList.every((item) => item.isActive),
            selected_game_data: selectedData,
        }));
    };

    // ✅ SELECT ALL ACCOUNTS
    const selectedAccount = (e) => {
        const check = e.target.checked;

        const updatedAccountList = [...state.account_list];
        updatedAccountList.forEach((acc) => {
            acc.isActiveAC = check;
        });

        const selectedAccounts = updatedAccountList.filter((acc) => acc.isActiveAC);
        const selectedAccountData = selectedAccounts.map((acc) => ({ account_id: acc._id }));
        const client_account_ids = selectedAccounts.map((acc) => acc._id);

        // Clear selections if nothing is selected
        if (client_account_ids.length === 0) {
            setSelectedGamesIds({});
            setSelectedGameIds([]);
            setGameIds([]);
            setManuallyDeselectedGameIds({});

            const clearedGameList = state.game_list.map((game) => ({
                ...game,
                isActive: false,
                assigned_to: "",
            }));

            setState((prevState) => ({
                ...prevState,
                selected_account_data: [],
                account_list: updatedAccountList,
                isActiveAC: false,
                selected_game_data: [],
                game_list: clearedGameList,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                selected_account_data: selectedAccountData,
                account_list: updatedAccountList,
                isActiveAC: check,
            }));
            setClientAccountIds(client_account_ids);
            GameListDetails(client_account_ids, true); // fetch fresh game list
        }
    };



    // ✅ SELECT SINGLE ACCOUNT
    const onChangeSelectForAccount = (check, key) => {
        const updatedAccountList = [...state.account_list];
        updatedAccountList[key].isActiveAC = check;

        const selectedAccounts = updatedAccountList.filter((acc) => acc.isActiveAC);
        const selectedAccountData = selectedAccounts.map((acc) => ({ account_id: acc._id }));
        const client_account_ids = selectedAccounts.map((acc) => acc._id);

        if (client_account_ids.length === 0) {
            // Clear all game selections
            setSelectedGamesIds({});
            setSelectedGameIds([]);
            setGameIds([]);
            setManuallyDeselectedGameIds({});

            const clearedGameList = state.game_list.map((game) => ({
                ...game,
                isActive: false,
                assigned_to: "",
            }));

            setState((prevState) => ({
                ...prevState,
                selected_account_data: [],
                account_list: updatedAccountList,
                isActiveAC: false,
                selected_game_data: [],
                game_list: clearedGameList,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                selected_account_data: selectedAccountData,
                account_list: updatedAccountList,
                isActiveAC: updatedAccountList.length === selectedAccounts.length,
            }));
            setClientAccountIds(client_account_ids);
            GameListDetails(client_account_ids, true);
        }
    };


    useEffect(() => { }, [
        state.client_id,
        state.selected_account_data,
        state.selected_game_data,
    ]);

    const submitDetails = (type) => {
        let params = {
            client_id: state.client_id,
            client_account_ids: location?.state?.data?.account_id
                ? [location?.state?.data?.account_id]
                : clientAccountIds,
            game_ids: Object.keys(selectedGamesIds).filter(id => selectedGamesIds[id]),
            type: type,
        };

        Service.apiPostCallRequest(RouteURL.assignDeassignGames, params, token)
            .then((res) => {
                if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
                    toast.success(res.message, {
                        position: "bottom-right",
                        closeOnClick: true,
                    });

                    let updatedGameList = [...state.game_list];
                    let updatedSelectedGamesIds = { ...selectedGamesIds };
                    let updatedSelectedGameIds = [...selectedGameIds];
                    let selectedData = [];

                    // ✅ ASSIGNING
                    if (type === "assign") {
                        updatedGameList = updatedGameList.map((game) => {
                            if (gameIds.includes(game.game_id)) {
                                updatedSelectedGamesIds[game.game_id] = true;

                                if (!updatedSelectedGameIds.includes(game.game_id)) {
                                    updatedSelectedGameIds.push(game.game_id);
                                }

                                selectedData.push({
                                    game_id: game.game_id,
                                    game_account_id: game.client_account_id,
                                });

                                return { ...game, isActive: true };
                            }
                            return game;
                        });

                        setSelectedGamesIds(updatedSelectedGamesIds);
                        setSelectedGameIds(updatedSelectedGameIds);
                        setGameIds(updatedSelectedGameIds);

                        setTimeout(() => {
                            GameListDetails(clientAccountIds, type === "assign");
                        }, 100);
                    }

                    // ✅ DEASSIGNING
                    if (type === "deassign") {
                        updatedGameList = updatedGameList.map((game) => {
                            if (gameIds.includes(game.game_id)) {
                                return {
                                    ...game,
                                    isActive: false,
                                    assigned_to: "", // Clear display
                                };
                            }
                            return game;
                        });

                        // Filter out removed
                        updatedSelectedGameIds = updatedSelectedGameIds.filter(
                            (id) => !gameIds.includes(id)
                        );

                        gameIds.forEach((id) => {
                            delete updatedSelectedGamesIds[id];
                        });

                        selectedData = updatedGameList
                            .filter((p) => updatedSelectedGameIds.includes(p.game_id))
                            .map((p) => ({
                                game_id: p.game_id,
                                game_account_id: p.client_account_id,
                            }));

                        // Fully clear global selected trackers
                        setSelectedGamesIds({});
                        setSelectedGameIds([]);
                        setGameIds([]);
                    }

                    setState((prevState) => ({
                        ...prevState,
                        game_list: updatedGameList,
                        selected_game_data: selectedData,
                        isActive:
                            updatedGameList.length > 0 &&
                            updatedGameList.every((item) => item.isActive),
                    }));

                    // 🚀 Smart backend wait buffer to allow true refresh
                    setTimeout(() => {
                        GameListDetails(clientAccountIds, type === "deassign");
                    }, 100);
                } else {
                    toast.error(res.message, {
                        position: "bottom-right",
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || "An error occurred", {
                    position: "bottom-right",
                    autoClose: false,
                });
            });
    };

    const IsConfirmed = (type) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to  ${type == "assign" ? "assign" : "unassign"} games!`,
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
    const loadMoreData = () => {
        setState((prevState) => ({
            ...prevState,
            page: state.page + 1,
            pageAdd: true,
        }));
    };
    return (
        <div>
            <ToastContainer />
            <div className="card shadow-lg rounded mb-3">
                <div className="card-body ">
                    <h3 className="hed_txt pt-2">Assign/Un-assign Games</h3>
                    <div>
                        <span style={{ color: "#3d99f5" }}>
                            ASSIGN OR UN-ASSIGN MULTIPLE GAMES TO OR FROM CLIENTS
                        </span>{" "}
                        <br />
                        <span style={{ color: "#db5d5d94" }}>
                            1. Select a Client &nbsp;&nbsp;2. Select Client Account
                            &nbsp;&nbsp; 3. Checkbox next to Game(s) to be Assigned OR
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
                                            state.selected_game_data.length > 0
                                            ? false
                                            : true
                                    }
                                >
                                    ASSIGN GAMES TO CLIENTS
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm mb-3"
                                    onClick={() => IsConfirmed("deassign")}
                                    style={{ color: "#fff" }}
                                    disabled={
                                        state.selected_account_data.length > 0 &&
                                            state.selected_game_data.length > 0
                                            ? false
                                            : true
                                    }
                                >
                                    UN-ASSIGN GAMES FROM SELECTED CLIENTS
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
                            <h3 className="hed_txt pt-2">Game List</h3>
                            <div className="row">
                                <div className="col-sm-3">
                                    <label>Provider</label>
                                    <select
                                        className="form-select mb-1"
                                        id="provider_id"
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setState((prevState) => ({
                                                ...prevState,
                                                list: [],
                                                page: 1,
                                                provider_id: e.target.value,
                                            }));
                                        }}
                                        value={state.provider_id}
                                    >
                                        <option value={""}>Select Provider</option>
                                        {state?.provider_list?.length > 0 &&
                                            state?.provider_list?.map((data, key) => (
                                                <option value={data.provider_id} key={key} >{data.provider_details.provider_name}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className="col-sm-3">
                                    <label>Category</label>
                                    <select
                                        className="form-select mb-1"
                                        id="game_category_id"
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setState((prevState) => ({
                                                ...prevState,
                                                game_category_id: e.target.value,
                                            }));
                                        }}
                                        value={state.game_category_id}
                                    >
                                        <option value="">Select Category</option>
                                        {state.game_category_list.length > 0 &&
                                            state.game_category_list.map((item, key) => (
                                                <option value={item._id} key={key}>
                                                    {item.category_name?.en}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="col-xxl-6 col-xl-3 col-lg-3 col-md-4 d-none d-md-block mt-4">
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilSearch} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Search Games by Game Id"
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
                                            {state?.game_list.length > 0 && (
                                                <th>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={state.isActive}
                                                        id="flexCheckChecked"
                                                        onChange={selectedGame}
                                                    />
                                                </th>
                                            )}
                                            <th scope="col">Game Name</th>
                                            <th scope="col">Assigned To</th>
                                            <th scope="col">Game Id</th>
                                            <th scope="col">Game Code</th>
                                            <th scope="col">Logo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state?.game_list.length > 0 ? (
                                            state?.game_list.map((data, key) => (
                                                <tr key={key} className="table-data">
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={data.isActive}
                                                            onChange={(ev) =>
                                                                onChangeSelectForGame(ev.target.checked, key)
                                                            }
                                                            style={{ marginRight: 5, borderColor: "#8fbc8f" }}
                                                        />{" "}
                                                    </td>
                                                    <td scope="row">{data.game_details?.game_name}</td>
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
                                                                    state.copyText != data._id ? "" : "#1b9e3e",
                                                            }}
                                                        >
                                                            {data._id.substr(0, 8) + "..."}{" "}
                                                        </span>
                                                        &nbsp;
                                                        <CopyToClipboard
                                                            text={data._id}
                                                            onCopy={() => onCopy(data._id)}
                                                        >
                                                            <a
                                                                href="javascript:void(0)"
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color:
                                                                        state.copyText != data.game_id
                                                                            ? ""
                                                                            : "#1b9e3e",
                                                                }}
                                                                key={key}
                                                            >
                                                                <CTooltip content={data._id}>
                                                                    {state.copyText != data._id ? (
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
                                                    <td>{data.game_details?.game_code}</td>
                                                    <td><img src={data?.game_details?.game_image ? data?.game_details?.game_image : '-'} height={40} width={40} style={{ borderRadius: 10 }} /></td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr style={{ textAlign: "center" }}>
                                                <td colSpan="5">Games are not available.Please contact to admin.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="row">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
