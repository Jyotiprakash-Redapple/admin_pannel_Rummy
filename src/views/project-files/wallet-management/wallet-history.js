
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CCard,
  CCardBody,
} from '@coreui/react'
import { useSelector } from "react-redux";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';


export default function WalletHistory() {
  const token = useSelector((state) => state.user.token);
  let navigate = useNavigate();
  const select_Currency = useSelector((state) => state.select_currency);
  const wallet_records_id = useSelector((state) => state.wallet_details);
  let currency_details = select_Currency.split(',');
  let currency_name = currency_details[1];
  let currency_id = currency_details[0];
  const [state, setState] = useState({
    list: [],
    limit: 10,
    page: 1,
    pageAdd: '',
    currentPage: "",
    totalPages: "",
    totalTransactions: 0,
    updatetedcurrency_id: currency_id
  })

  useEffect(() => {
    WalletHistoryListDetails()

  }, [state.page, currency_id,])
  const WalletHistoryListDetails = () => {
    let params = JSON.stringify({
      "wallet_id": wallet_records_id,
      "limit": state.limit,
      "page": state.page
    })

    Service.apiPostCallRequest(RouteURL.adminTransactionDetails, params, token)
      .then((res) => {

        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          setState((prevState) => ({
            ...prevState,
            list: res?.data.transactions,
            currentPage: res?.data?.current_page,
            totalAccounts: res?.data?.total_count,
            totalPages: res?.data?.total_page,
            totalTransactions: res?.data?.total_count,
          }));
          if (state.pageAdd == true) {
            setState((prevState) => ({
              ...prevState,
              // list: res?.data.adminTransactionDetails,
              list: [...state.list, ...res?.data.transactions],
              currentPage: res?.data?.current_page,
              totalAccounts: res?.data?.total_count,
              totalPages: res?.data?.total_page,
              pageAdd: ""
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              // list: [...state.list, ...res?.data.adminTransactionDetails],
              currentPage: res?.data?.current_page,
              totalAccounts: res?.data?.total_count,
              totalPages: res?.data?.total_page
            }));
          }
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


  const loadMoreData = () => {
    setState((prevState) => ({
      ...prevState,
      page: state.page + 1,
      pageAdd: true
    }));

  }

  return (
    <CCard>
      <ToastContainer />
      <CCardBody>
        <div className="row">
          <div className="d-flex bd-highlight">
            <div className="p-2 w-100 bd-highlight">
              <h3 className="hed_txt pt-2">Transaction Wallet History</h3>
            </div>
            <div className="p-2 flex-fill  bd-highlight"></div>
          </div>
          <div style={{ margin: 10 }} className="table-responsive">
            <table className="table table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Sl No</th>
                  <th style={{ textAlign: "center" }}>Date Time</th>
                  <th style={{ textAlign: "right" }}>Debit</th>
                  <th style={{ textAlign: "right" }}>Credit</th>
                  <th style={{ textAlign: "right" }}>
                    Available Credit Limit
                  </th>
                  {/* <th>Note</th> */}
                </tr>
              </thead>
              <tbody>
                {state.list.length > 0 ? (
                  state.list.map((data, key) => (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td style={{ textAlign: "center" }}>
                        {moment(data.created_at).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </td>

                      <td style={{ textAlign: "right", color: "#ff0000bf" }}>
                        {data.transaction_type == "debit" ? data.amount : "-"}
                      </td>
                      <td style={{ textAlign: "right", color: "#0080009c" }}>
                        {data.transaction_type == "admin_deposit" ||
                          data.transaction_type == "credit"
                          ? data.amount
                          : "-"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {data?.available_balance}
                      </td>
                      {/* <td>{data?.note}</td> */}
                    </tr>
                  ))
                ) : (
                  <tr style={{ textAlign: "center" }}>
                    <td colSpan="5">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-6 ">
              <span className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => loadMoreData()}
                  disabled={
                    state.list.length == state.totalTransactions
                      ? true
                      : false
                  }
                >
                  {" "}
                  Load More
                </button>
              </span>
            </div>
            <div className="col-6">
              <span className="d-flex justify-content-end ">
                {state.list.length + " / " + state.totalTransactions} Wallet
                History Loaded
              </span>
            </div>
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
}