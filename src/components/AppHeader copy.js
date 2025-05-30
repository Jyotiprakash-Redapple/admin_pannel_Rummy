import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { sideBarOpen, sideBarClose, Currency, SelectCurrency, currencyWiseAmount } from "../redux/slices/superAdminStateSlice";
import { ToastContainer, toast } from 'react-toastify';
import Service from "../apis/Service";
import RouteURL from "../apis/ApiURL";
import { useSelector, useDispatch } from 'react-redux';
import { Constants, REGEX, ERROR_MESSAGE } from "../apis/Constant";
const AppHeader = () => {
  // const headerRef = useRef()
  // const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  // const dispatch = useDispatch()
  // const sidebarShow = useSelector((state) => state.sidebarShow)

  // useEffect(() => {
  //   document.addEventListener('scroll', () => {
  //     headerRef.current &&
  //       headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
  //   })
  // }, [])

  const headerRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const token = useSelector((state) => state.user.token);
  const client_id = useSelector((state) => state.user.client_id);
  const selectCurrency = useSelector((state) => state.select_currency);
  const _currencyListStore = useSelector((state) => state.currency);
  const available_amount = useSelector((state) => state.currency_amount);
  const client_account_transfer_balance = useSelector((state) => state.clientAccountTransferBalance);
  const [_available_amount, setAvailable_amount] = useState(available_amount);
  let currency_details = selectCurrency.split(',');
  let currency_name = currency_details[1];
  let currency_id = currency_details[0];

  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [currencyData, setCurrencyData] = useState({
    list: [],
    search: '',
    wallet_records_id: "",
    currency_code_id: '',
    available_amount: "",
    amount: "",
    currency_name: '',
    currency_list: [],
    selectedCurrencyType: "fiat",
    selectedCurrencyCode: "",
  });


  // initial 
  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
    // CurrencyList();
    AccountWiseCurrencyList()
  }, [])



  // if currency code get the walletebalance api call
  useEffect(() => {
    dispatch(SelectCurrency(selectCurrency));
    // if (selectCurrency == '' && currencyData.currency_code_id) {
    //   let currency_details = currencyData.currency_code_id + "," + currencyData.currency_name
    //   dispatch(SelectCurrency(currency_details));   

    // }
  }, [selectCurrency])




  useEffect(() => {
    if ((client_account_transfer_balance?.accountCurrency?.currency_code == currency_name) && location.pathname == "/client-list/client-transfer-balance") {
      if (available_amount) {
        setCurrencyData(prevState => ({
          ...prevState,
          available_amount: available_amount,
        }))
      }
    } else {
      if (available_amount) {
        setCurrencyData(prevState => ({
          ...prevState,
          available_amount: available_amount,
        }))
      }
    }
  }, [available_amount])


  const changeCurrency = (e) => {
    e.preventDefault();
    let selectCurrency = e.target.value;
    let currency_details = selectCurrency.split(',');
    let currency_name = currency_details[1];
    let currency_id = currency_details[0];
    let currency_amount = currency_details[2];
    dispatch(SelectCurrency(selectCurrency));
    dispatch(currencyWiseAmount(currency_amount));
    setCurrencyData(prevState => ({
      ...prevState,
      available_amount: currency_amount,
    }))

  }



  /**
* @author Sucheta Singha
* @Date_Created  09.12.2024
* @Date_Modified 
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
  const AccountWiseCurrencyList = () => {

    Service.apiPostCallRequest(RouteURL.clientAccountWiseCurrencyList, {}, token)
      .then((res) => {
        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          let selectCurrency = res?.data[0].currency_code_id + ',' + res?.data[0].currency_code + ',' + res?.data[0].available_balance;
          setCurrencyData((prevState) => ({
            ...prevState,
            currency_list: res?.data,
            selectedCurrencyCode: selectCurrency, 
            // available_balance: res?.data?.accounts[0].available_balance
          }));

          dispatch(currencyWiseAmount(res?.data[0].available_balance));
         
          // currencyWiseAmount
          dispatch(SelectCurrency(selectCurrency));
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

  const fetchWalletBalance = (currency_code) => {
    let selectCurrency = currency_code;
    let currency_details = selectCurrency.split(',');
    let currency_name = currency_details[1];
    let currency_id = currency_details[0];
    let currency_amount = currency_details[2];
    dispatch(SelectCurrency(selectCurrency));
    dispatch(currencyWiseAmount(currency_amount));
    setCurrencyData(prevState => ({
      ...prevState,
      available_amount: currency_amount,
    }))
  };

  const handleCurrencyTypeChange = (e) => {
    const selectedType = e.target.value;
    setCurrencyData((prevState) => ({
      ...prevState,
      selectedCurrencyType: selectedType,
      selectedCurrencyCode: "", // Reset selected currency code
    }));
  };

  const handleCurrencyCodeChange = (e) => {
    const selectedCode = e.target.value;
    setCurrencyData((prevState) => ({
      ...prevState,
      selectedCurrencyCode: selectedCode,
    }));
    fetchWalletBalance(selectedCode);

  };

  // Group currencies by type
  const groupedCurrencies = currencyData.currency_list.reduce((acc, curr) => {
    if (!acc[curr.currency_type]) acc[curr.currency_type] = [];
    acc[curr.currency_type].push(curr);
    return acc;
  }, {});


  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch(sideBarOpen({ type: 'set', sidebarShow: !sidebarShow }))
          }
          // onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="ms-auto">
          <div className="d-flex ">
            <div className="p-2 flex-grow-1 align-self-center">CREDIT :
              {/* {currencyData.available_balance} */}
              {/* {available_amount} */}
              {currencyData?.available_amount ? currencyData?.available_amount.toLocaleString() : 0}
            </div>
            <div className="p-2">
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
            </div>

            <div className="p-2">
              {currencyData.selectedCurrencyType && (
                <select
                  className="form-select form-select-sm mb-1"
                  onChange={handleCurrencyCodeChange}
                  value={currencyData.selectedCurrencyCode}
                >
                  <option value="">Select Currency</option>
                  {groupedCurrencies[currencyData.selectedCurrencyType]?.map((currency) => (
                    <option value={[currency.currency_code_id, currency.currency_code, currency.available_balance]} key={currency._id}>
                      {currency.currency_code.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* <div className="p-2"> <select className="form-select form-select-sm mb-1" onChange={changeCurrency} value={selectCurrency} >
              {currencyData?.currency_list.length > 0 && currencyData?.currency_list.map((list, key) => (
                <option value={[list.currency_code_id, list.currency_code, list.available_balance]} key={key} >{list.currency_code?.toUpperCase()}</option>
              ))}
            </select>
            </div> */}
          </div>

        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              {/* <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem> */}
            </CDropdownMenu>
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

export default AppHeader
