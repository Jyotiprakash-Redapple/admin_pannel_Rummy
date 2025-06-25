import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu, cilMoon, cilSun, cilContrast } from "@coreui/icons";
import { sideBarOpen, Currency, SelectCurrency, currencyWiseAmount, walletDetails, selectedCurrencyAccountDetails } from "../redux/slices/superAdminStateSlice";
import { toast } from "react-toastify";
import Service from "../apis/Service";
import RouteURL from "../apis/ApiURL";
import { Constants } from "../apis/Constant";
import { AppHeaderDropdown } from './header/index'
import AppBreadcrumb from "src/components/AppBreadcrumb.js";

const AppHeader = () => {
  const headerRef = useRef();
  const dispatch = useDispatch();
  const { colorMode, setColorMode } = useColorModes();
  const token = useSelector((state) => state.user.token);
  const available_balance = useSelector((state) => state.currency_amount);
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [currencyData, setCurrencyData] = useState({
    list: [],
    selectedCurrencyCode: "",
    selectedCurrencyType: "fiat",
    available_balance: 0,
  });

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
   // fetchCurrencyList();

  }, [])

  useEffect(() => {
    console.log("CurrencyWiseAmount from Redux:", currencyWiseAmount);
  }, [currencyWiseAmount]);  // Add `currencyWiseAmount` as a dependency


  // Handle currency list updates
  useEffect(() => {
    if (currencyData.list.length > 0) {
      const defaultCurrency = currencyData.list[0];
      setCurrencyData((prevState) => ({
        ...prevState,
        selectedCurrencyCode: defaultCurrency._id,
        selectedCurrencyType: defaultCurrency.currency_type,
      }));
      dispatch(SelectCurrency(`${defaultCurrency._id},${defaultCurrency.currency_code}`));
     // fetchWalletBalance(defaultCurrency._id);
    }
  }, [currencyData.list]);

  // Sync available amount changes
  useEffect(() => {
    if (available_balance !== currencyData.available_balance) {
      setCurrencyData((prevState) => ({
        ...prevState,
        available_balance,
      }));
    }
  }, [available_balance]);

  const fetchCurrencyList = () => {
    // console.log("Fetching Currency List...");
    Service.apiPostCallRequest(RouteURL.clientAccountWiseCurrencyList, {}, token)
      .then((res) => {
        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          // console.log("Currency List API Response:", res.data);
          const currencies = res.data;
          setCurrencyData((prevState) => ({
            ...prevState,
            list: currencies,
          }));
          dispatch(Currency(currencies));
        } else {
          // console.error("Currency List Error:", res.message);
          toast.error(res.message, { position: "bottom-right" });
        }
      })
      .catch((error) => {
        // console.error("Currency List API Error:", error);
        toast.error(error.response?.data?.message || "Unknown Error", {
          position: "bottom-right",
        });
      });
  };

  const fetchWalletBalance = (currency_id) => {
    // console.log("Fetching Wallet Balance for Currency ID:", currency_id);
    const params = JSON.stringify({ account_id: currency_id });
    Service.apiPostCallRequest(RouteURL.accountWiseWalletBalance, params, token)
      .then((res) => {
        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          const walletData = res?.data || {};
          // console.log("Wallet Balance Data:", walletData);
          const { available_balance = 0, wallet_id = "" } = walletData;
          setCurrencyData((prevState) => ({
            ...prevState,
            available_balance,
          }));
          dispatch(selectedCurrencyAccountDetails(walletData));
          dispatch(currencyWiseAmount(available_balance));
          dispatch(walletDetails(wallet_id));
        } else {
          // console.error("Wallet Balance Error:", res.message);
          toast.error(res.message, { position: "bottom-right" });
        }
      })
      .catch((error) => {
        // console.error("Wallet Balance API Error:", error);
        toast.error(error.response?.data?.message || "Unknown Error", {
          position: "bottom-right",
        });
      });
  };

  const handleCurrencyTypeChange = (e) => {
    const selectedType = e.target.value;
    // console.log("Currency Type Changed:", selectedType);

    setCurrencyData((prevState) => ({
      ...prevState,
      selectedCurrencyType: selectedType,
      selectedCurrencyCode: "", // Reset selected currency code
    }));
  };

  const handleCurrencyCodeChange = (e) => {
    const selectedCode = e.target.value;
    // console.log("Currency Code Changed:", selectedCode);
    const selectedCurrency = currencyData.list.find((c) => c._id === selectedCode);
    if (selectedCurrency) {
      setCurrencyData((prevState) => ({
        ...prevState,
        selectedCurrencyCode: selectedCode,
      }));
      dispatch(SelectCurrency(`${selectedCurrency._id},${selectedCurrency.currency_code}`));
      fetchWalletBalance(selectedCode);
    }
  };

  // Group currencies by type
  const groupedCurrencies = currencyData.list.reduce((acc, curr) => {
    if (!acc[curr.currency_type]) acc[curr.currency_type] = [];
    acc[curr.currency_type].push(curr);
    return acc;
  }, {});

  const htmlElement = document.documentElement;

  if (colorMode === "dark") {
      htmlElement.classList.remove("darkmodeon");
   // htmlElement.classList.add("darkmodeon");
  } else {
      htmlElement.classList.remove("darkmodeon");

    //htmlElement.classList.remove("darkmodeon");
  }
  localStorage.setItem('coreui-free-react-admin-template-theme', 'light')
  console.log(colorMode, "colorMode")
 htmlElement.classList.remove("darkmodeon");
  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch(sideBarOpen({ type: 'set', sidebarShow: !sidebarShow }))
            // dispatch({ type: 'set', sidebarShow: !sidebarShow })
          }
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="ms-auto">
          <div className="d-flex">
            {/* <div className="p-2 flex-grow-1 align-self-center">
              CREDIT: {currencyData.available_balance.toLocaleString()}
            </div> */}

            {/* <div className="p-2">
              <select
                className="form-select form-select-sm mb-1"
                onChange={handleCurrencyTypeChange}
                value={currencyData.selectedCurrencyType}
              >
                <option value="">Select Currency Type</option>
                {Object.keys(groupedCurrencies).map((type) => (
                  <option value={type} key={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div> */}

            {/* <div className="p-2">
              {currencyData.selectedCurrencyType && (
                <select
                  className="form-select form-select-sm mb-1"
                  onChange={handleCurrencyCodeChange}
                  value={currencyData.selectedCurrencyCode}
                >
                  <option value="">Select Currency</option>
                  {groupedCurrencies[currencyData.selectedCurrencyType]?.map((currency) => (
                    <option value={currency._id} key={currency._id}>
                      {currency.currency_code.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}
            </div> */}
          </div>
        </CHeaderNav>

        <CHeaderNav>
          <CDropdown variant="nav-item" placement="bottom-end">
            {/* <CDropdownToggle caret={false}>
              <CIcon
                icon={
                  colorMode === "dark"
                    ? cilMoon
                    : colorMode === "light"
                      ? cilSun
                      : cilContrast
                }
                size="lg"
              />
            </CDropdownToggle> */}
            {/* <CDropdownMenu>
              <CDropdownItem onClick={() => setColorMode("dark")}>
                <CIcon icon={cilMoon} className="me-2" size="lg" />
                Dark
              </CDropdownItem>
              <CDropdownItem onClick={() => setColorMode("light")}>
                <CIcon icon={cilSun} className="me-2" size="lg" />
                Light
              </CDropdownItem>
            </CDropdownMenu> */}
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader;
