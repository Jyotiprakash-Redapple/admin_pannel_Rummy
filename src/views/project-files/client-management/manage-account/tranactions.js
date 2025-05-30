import React, { useState, useEffect } from "react";
import { CFormSelect, CTooltip } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import Service from "../../../../apis/Service";
import RouteURL from "../../../../apis/ApiURL";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Constants } from "../../../../apis/Constant";
import { leftTrim, camelCase } from "../../../../Utility/helper";
import moment from "moment";
import MasterData from "../../../../Utility/MasterData";

export default function TransactionsList() {
  const getClientAccountDetails = useSelector(
    (state) => state.client_account_details
  );
  const token = useSelector((state) => state.user.token);
  const [state, setState] = useState({
    account_list: [],
    game_list: [],
    transaction_type: null,
    start_date: moment(new Date())
      .subtract(7, "days")
      .format("yyyy-MM-DD HH:mm:ss"),
    end_date: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
    page: 1,
    limit: 10,
    currentPage: "",
    totalPages: "",
    totalAccountTransactions: "",
    totalPlayerTransactions: "",
    accountType: "Account",
    copied: false,
    copyText: "",
  });

  useEffect(() => {
    let params = JSON.stringify({
      client_account_id: getClientAccountDetails.accountId,
      transaction_type: state.transaction_type,
      start_date: moment(new Date(state.start_date)).format("yyyy-MM-DD"),
      end_date: moment(new Date(state.end_date)).format("yyyy-MM-DD"),
      page: state.page,
      limit: state.limit,
    });
    if (state.accountType == "Game")
      ClientAccountWisePlayerTransactionHistory(params);
    else ClientAccountWiseTransactionHistory(params);
  }, [state.accountType, state.page]);

  const ClientAccountWiseTransactionHistory = (params) => {
    Service.apiPostCallRequest(
      RouteURL.accountTransactionHistory,
      params,
      token
    )
      .then((res) => {
        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          setState((prevState) => ({
            ...prevState,
            account_list: res.data.transactions,
            currentPage: res.data.current_page,
            totalPages: res.data.total_page,
            totalAccountTransactions: res.data.total_count,
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

  const ClientAccountWisePlayerTransactionHistory = (params) => {
    Service.apiPostCallRequest(
      RouteURL.accountWisePlayerTransactionHistory,
      params,
      token
    )
      .then((res) => {
        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          setState((prevState) => ({
            ...prevState,
            game_list: res.data.transactions,
            currentPage: res.data.current_page,
            totalPages: res.data.total_page,
            totalPlayerTransactions: res.data.total_count,
          }));
        } else {
          toast.error(res.message, {
            position: "bottom-right",
            autoClose: true,
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

  const handleChange = (e) => {
    const { id, value } = e.target;

    setState((prevState) => ({
      ...prevState,
      [id]: leftTrim(value),
      page: 1,
    }));
  };

  const onCopy = React.useCallback((id) => {
    setState((prevState) => ({
      ...prevState,
      copied: true,
      copyText: id,
    }));
  }, []);

  const Search = () => {
    setState((prevState) => ({
      ...prevState,
      page: 1,
    }));
    let params = JSON.stringify({
      client_account_id: getClientAccountDetails.accountId,
      transaction_type:
        state.transaction_type == "" ? null : state.transaction_type,
      start_date: moment(state.start_date).format("yyyy-MM-DD"),
      end_date: moment(state.end_date).format("yyyy-MM-DD"),
      // "start_date": moment(state.start_date).format('yyyy-MM-DD HH:mm:ss'),
      // "end_date": moment(state.end_date).format('yyyy-MM-DD HH:mm:ss'),
      page: 1,
      limit: 10,
    });
    if (state.accountType == "Game")
      ClientAccountWisePlayerTransactionHistory(params);
    else ClientAccountWiseTransactionHistory(params);
  };

  return (
    <div>
      <div className="row p-3 bg-info bg-opacity-10 border border-info rounded">
        <div className="col-6">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="accountType"
              onChange={handleChange}
              checked={state.accountType == "Account"}
              value="Account"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault">
              Account Transaction
            </label>
          </div>
        </div>
        <div className="col-6">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="accountType"
              onChange={handleChange}
              checked={state.accountType == "Game"}
              value="Game"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault">
              Game Play Transaction
            </label>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-3">
          <label htmlFor="start_date">Start Date</label>
          <input
            id="start_date"
            className="form-control"
            type="datetime-local"
            value={state.start_date}
            onChange={handleChange}
          />
        </div>
        <div className="col-3">
          <label htmlFor="end_date">End Date</label>
          <input
            id="end_date"
            className="form-control"
            type="datetime-local"
            value={state.end_date}
            onChange={handleChange}
          />
        </div>
        <div className="col-3">
          <label htmlFor="end_date">Transaction Type</label>
          <CFormSelect
            aria-label="Default select example"
            id="transaction_type"
            onChange={handleChange}
          >
            <option disabled>Select type of transaction</option>
            {MasterData?.typeOfTransaction?.length > 0 &&
              MasterData?.typeOfTransaction?.map((data, key) => (
                <option value={data.value} key={key}>
                  {data.label}
                </option>
              ))}
          </CFormSelect>
        </div>
        <div className="col-3 mt-4">
          <button type="button" className="btn btn-primary " onClick={Search}>
            Search
          </button>
        </div>
      </div>

      {state.accountType == "Account" ? (
        <>
          <div className="table-responsive mt-2">
            <table className="table table-hover ">
              <thead className="table-primary">
                <tr>
                  <th style={{ width: "14%" }}>Transactions Id</th>
                  <th style={{ width: "10%" }}>Amount</th>
                  <th style={{ width: "12%" }}>Ava. credit</th>
                  <th style={{ width: "5%" }}>Type</th>
                  <th style={{ width: "12%" }}>Date</th>

                  <th
                    style={{
                      width: "12%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Trans. From a/c.
                  </th>
                  <th style={{ width: "10%" }}>Trans.To a/c.</th>
                  <th style={{ width: "10%" }}>Trans. From User</th>
                  <th style={{ width: "10%" }}>Trans. To User</th>
                  <th style={{ width: "5%" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.account_list?.length > 0 ? (
                  state.account_list.map((data, key) => (
                    <tr key={key}>
                      <td scope="row">
                        <CopyToClipboard
                          text={data.transaction_id}
                          onCopy={() => onCopy(data.transaction_id)}
                        >
                          <a
                            href="javascript:void(0)"
                            style={{
                              textDecoration: "none",
                              color:
                                state.copyText != data.transaction_id
                                  ? ""
                                  : "#1b9e3e",
                            }}
                            key={key}
                          >
                            {data.transaction_id.length > 8
                              ? data.transaction_id.substr(0, 8) + "..."
                              : data.transaction_id}{" "}
                            &nbsp;
                            <CTooltip content={data.transaction_id}>
                              {state.copyText != data.transaction_id ? (
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
                      <td
                        style={{
                          color:
                            data.transaction_type == "debit"
                              ? "#ff0000bf"
                              : "#0080009c",
                        }}
                      >
                        {data.amount}
                      </td>
                      <td>{data.available_balance}</td>
                      <td
                        style={{
                          color:
                            data.transaction_type == "debit"
                              ? "#ff0000bf"
                              : "#0080009c",
                        }}
                      >
                        {camelCase(data.transaction_type)}
                      </td>
                      <td>{moment(data.created_at).format("YYYY-MM-DD")}</td>

                      <td>
                        {data.from_account_name ? data.from_account_name : "-"}
                      </td>
                      <td>
                        {data.to_account_name ? data.to_account_name : "-"}
                      </td>
                      <td>
                        {data.from_user_username
                          ? data.from_user_username
                          : "-"}
                      </td>

                      <td>
                        {data.to_user_username ? data.to_user_username : "-"}
                      </td>
                      <td>{camelCase(data.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr style={{ textAlign: "center" }}>
                    <td colSpan="10">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>

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
        </>
      ) : (
        <div className="table-responsive mt-2">
          <table className="table table-hover">
            <thead className="table-primary">
              <tr>
                <th style={{ width: "14%" }}>Transactions Id</th>
                <th style={{ width: "10%" }}>Amount</th>
                <th style={{ width: "12%" }}>Ava. credit</th>
                <th style={{ width: "5%" }}>Type</th>
                <th style={{ width: "12%" }}>Date</th>
                <th style={{ width: "11%" }}>Game Name</th>
                <th style={{ width: "23%" }}>Provider Name</th>

                <th style={{ width: "5%" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.game_list?.length > 0 ? (
                state.game_list.map((data, key) => (
                  <tr key={key}>
                    <td scope="row">
                      <CopyToClipboard
                        text={data._id}
                        onCopy={() => onCopy(data._id)}
                      >
                        <a
                          href="javascript:void(0)"
                          style={{
                            textDecoration: "none",
                            color: state.copyText != data._id ? "" : "#1b9e3e",
                          }}
                          key={key}
                        >
                          {data._id.length > 8
                            ? data._id.substr(0, 8) + "..."
                            : data._id}{" "}
                          &nbsp;
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

                    <td
                      style={{
                        color:
                          data.transaction_type == "debit"
                            ? "#ff0000bf"
                            : "#0080009c",
                      }}
                    >
                      {data.transaction_amount}
                    </td>
                    <td>{data.available_balance}</td>
                    <td
                      style={{
                        color:
                          data.transaction_type == "debit"
                            ? "#ff0000bf"
                            : "#0080009c",
                      }}
                    >
                      {camelCase(data.transaction_type)}
                    </td>
                    <td>{moment(data.created_at).format("YYYY-MM-DD")}</td>

                    <td>{data.game_name?.en}</td>
                    <td>{data.provider_name?.en}</td>

                    <td>{data.status ? camelCase(data.status) : ""}</td>
                  </tr>
                ))
              ) : (
                <tr style={{ textAlign: "center" }}>
                  <td colSpan="8">No data found</td>
                </tr>
              )}
            </tbody>
          </table>

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
      )}
    </div>
  );
}
