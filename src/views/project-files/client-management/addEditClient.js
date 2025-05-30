import React, { useState, useEffect } from "react";
import {
  CButton,
  CForm,
  CFormInput,
  CInputGroup, CInputGroupText, CTooltip
} from '@coreui/react'
import { useNavigate, useLocation } from "react-router-dom";
import Service from "../../../apis/Service";
import RouteURL from "../../../apis/ApiURL";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function AddEditClient(props) {
  let navigate = useNavigate();
  const getClientDetails = useSelector((state) => state.client_Details);
  const Type = getClientDetails?.Type; //location?.state?.Type//props.data.Type;
  const client_id = getClientDetails?.alldata?._id;//location?.state.client_id;
  const clientData = getClientDetails?.alldata;//location?.state?.alldata;
  const token = useSelector((state) => state.user.token);
  const [isDisabled, setIsDisabled] = useState(false)

  const [state, setState] = useState({
    "first_name": "",
    "last_name": "",
    "parent_client_id": null,
    "contact": "",
    "email": "",
    "username": "",
    "password": "",
    "brand_name": "",
    "platform_name": "",
    "level_id": "",
    client_id: Type == 0 ? null : client_id,
    copy_text: '',
    copied: false,
    showPassword: false,
    labellist: []
  });

  const [errorMsg, setErrorMsg] = useState({
    "first_name": "",
    "last_name": "",
    "parent_client_id": "",
    "contact": "",
    "email": "",
    "username": "",
    "password": "",
    "level_id": ""
  });

  useEffect(() => {
    if (Type == 1) {
      setState(prevState => ({
        ...prevState,
        "first_name": clientData.first_name,
        "last_name": clientData.last_name,
        "contact": clientData.contact,
        "email": clientData.email,
        "username": clientData.username,
        "level_id": clientData.level_id,
        "platform_name": clientData.platform_name,
        "brand_name": clientData.brand_name
      }));
    }
    LabelList();
  }, [Type]);

  const LabelList = () => {
    Service.apiPostCallRequest(RouteURL.levelList, {}, token)
      .then((res) => {
        if (res.err === false) {
          setState((prevState) => ({
            ...prevState,
            labellist: res.data || [],
          }));
        } else {
          toast.error(res.message, {
            position: 'bottom-right',
            autoClose: false,
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data?.message || 'An error occurred';
          toast.error(errorMessage, {
            position: 'bottom-right',
            autoClose: false,
          });
        }
      });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target
    setState(prevState => ({
      ...prevState,
      [id]: value.trimStart(),
    }))
  }

  /* Validation Checking */
  const ValidateForm = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      AddEditSubmitClient()
    }
  }

  /* Validate all fields */
  const handleValidation = () => {
    let formIsValid = true;

    //Name
    if (!state.first_name) {
      formIsValid = false;
      setErrorMsg(prevState => ({
        ...prevState,
        first_name: `${ERROR_MESSAGE['clientFirstNameRequired']}`

      }))
    } else {
      setErrorMsg(prevState => ({
        ...prevState,
        first_name: ""
      }))
    }

    if (!state.last_name) {
      formIsValid = false;
      setErrorMsg(prevState => ({
        ...prevState,
        last_name: `${ERROR_MESSAGE['clientLastNameRequired']}`

      }))
    } else {
      setErrorMsg(prevState => ({
        ...prevState,
        last_name: ""
      }))
    }

    if (!state.username) {
      formIsValid = false;
      setErrorMsg(prevState => ({
        ...prevState,
        username: `${ERROR_MESSAGE['clientRequired']}`

      }))
    } else {
      setErrorMsg(prevState => ({
        ...prevState,
        username: ""
      }))
    }

    if (!state.contact) {
      formIsValid = false;
      setErrorMsg(prevState => ({
        ...prevState,
        contact: `${ERROR_MESSAGE['phoneNoRequired']}`

      }))
    } else if (state.contact && !state.contact.match(REGEX.phone)) {
      formIsValid = false;
      setErrorMsg(prevState => ({
        ...prevState,
        contact: `${ERROR_MESSAGE['phoneNoInvalid']}`

      }))
    } else {
      setErrorMsg(prevState => ({
        ...prevState,
        contact: ""
      }))
    }

    if (!state.email) {
      formIsValid = false;
      setErrorMsg(prevState => ({
        ...prevState,
        email: `${ERROR_MESSAGE['emailRequired']}`

      }))
    } else if (state.email && !state.email.match(REGEX.email)) {
      formIsValid = false;
      setErrorMsg(prevState => ({
        ...prevState,
        email: `${ERROR_MESSAGE['emailInvalid']}`
      }))
    }
    else {
      setErrorMsg(prevState => ({
        ...prevState,
        email: ""
      }))
    }

    if (!state.level_id) {
      formIsValid = false;
      setErrorMsg(prevState => ({
        ...prevState,
        level_id: `${ERROR_MESSAGE['levelIdRequired']}`

      }))
    } else {
      setErrorMsg(prevState => ({
        ...prevState,
        level_id: ""
      }))
    }

    if (Type != 1) {
      if (!state.password) {
        formIsValid = false;
        setErrorMsg(prevState => ({
          ...prevState,
          password: `${ERROR_MESSAGE['passwordRequired']}`
        }))
      } else if (state.password && !state.password.match(REGEX.password)) {
        formIsValid = false;
        setErrorMsg(prevState => ({
          ...prevState,
          password: `${ERROR_MESSAGE['passwordInvalid']}`
        }))
      }
      else {
        setErrorMsg(prevState => ({
          ...prevState,
          password: ""
        }))
      }
    }


    return formIsValid;
  }

  /* genarate password*/
  const GenaratePass = (e) => {
    e.preventDefault();

    const passwordLength = 12;

    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%&*";

    const allChars = upperCase + lowerCase + numbers + specialChars;
    let password = "";

    // Ensure at least one character from each required set
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Add random characters from the entire set to reach the desired length
    for (let i = password.length; i < passwordLength; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password string to randomize the character order
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    // Set the generated password in the state
    setState(prevState => ({
      ...prevState,
      password: password
    }));
  };

  const onCopy = React.useCallback(() => {
    setState(prevState => ({
      ...prevState,
      copied: true,
    }))
  }, [])
  const AddEditSubmitClient = () => {

    let params = JSON.stringify({
      request_type: Type === 0 ? "add" : "update",
      client_id: state.client_id,
      first_name: state.first_name,
      last_name: state.last_name,
      username: state.username,
      password: state.password,
      email: state.email,
      contact: state.contact,
      // parent_client_id: state.parent_client_id,
      status: state.status,
      level_id: state.level_id,
    })

    Service.apiPostCallRequest(RouteURL.AddEditClient, params, token)
      .then((res) => {
        setIsDisabled(false)
        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          toast.success(res.message, {
            position: 'bottom-right',
            closeOnClick: true,
          });
          // navigate('/client-list')
          setTimeout(() => navigate('/client-list'), 2000);

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
          closeOnClick: true,
        });
        setIsDisabled(false)

      });
  }
  const passwordValidation = (password) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return validation;
  };


  return (
    <div className="mb-3">
      <ToastContainer />
      <div className="card">
        <div className="card-body">
          <h3 className="hed_txt pt-2">
            {Type == 0 ? "Add" : "Update"} Client
          </h3>
          <CForm
            className="justify-content-center"
            style={{ margin: 10 }}
            onSubmit={ValidateForm}
          >
            <div className="row">
              <div className="col-6">
                <label>
                  Client First Name <span style={{ color: "red" }}>*</span>
                </label>
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="text"
                    placeholder="Enter client first name"
                    id="first_name"
                    autoComplete="off"
                    value={state.first_name}
                    onChange={handleChange}
                  />
                </CInputGroup>
                <span style={{ color: "red" }}>{errorMsg.first_name}</span>
              </div>
              <div className="col-6">
                <label>
                  Client Last Name <span style={{ color: "red" }}>*</span>
                </label>
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="text"
                    placeholder="Enter client last name"
                    id="last_name"
                    autoComplete="off"
                    value={state.last_name}
                    onChange={handleChange}
                  />
                </CInputGroup>
                <span style={{ color: "red" }}>{errorMsg.last_name}</span>
              </div>

              <div className="col-6">
                <label>
                  Client Username <span style={{ color: "red" }}>*</span>
                </label>
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="text"
                    placeholder="Enter client username"
                    id="username"
                    autoComplete="off"
                    value={state.username}
                    onChange={handleChange}
                    disabled={Type == 0 ? false : true}
                  />
                </CInputGroup>
                <span style={{ color: "red" }}>{errorMsg.username}</span>
              </div>
              <div className="col-6">
                <label>
                  Client Contact No. <span style={{ color: "red" }}>*</span>
                </label>
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="number"
                    placeholder="Enter client contact no."
                    id="contact"
                    autoComplete="off"
                    value={state.contact}
                    onChange={handleChange}
                  />
                </CInputGroup>
                <span style={{ color: "red" }}>{errorMsg.contact}</span>
              </div>
              <div className="col-6">
                <label>
                  Client Email Id <span style={{ color: "red" }}>*</span>
                </label>
                <CInputGroup className="mb-1">
                  <CFormInput
                    type="text"
                    placeholder="Enter client email id"
                    id="email"
                    autoComplete="off"
                    value={state.email}
                    onChange={handleChange}
                  />
                </CInputGroup>
                <span style={{ color: "red" }}>{errorMsg.email}</span>
              </div>
              {Type != 1 && (
                <div className="col-6">
                  <label>
                    Client Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <CInputGroup className="mb-1">
                    <CFormInput
                      type={state.showPassword === true ? "text" : "password"}
                      placeholder="Enter client password"
                      id="password"
                      autoComplete="off"
                      value={state.password}
                      onChange={handleChange}
                    />
                    <CInputGroupText
                      onClick={() =>
                        setState((prevState) => ({
                          ...prevState,
                          showPassword: !state.showPassword,
                        }))
                      }
                    >
                      <i
                        className={`fa-regular ${state.showPassword === true ? "fa-eye" : "fa-eye-slash"}`}
                      ></i>
                    </CInputGroupText>
                    <CButton
                      color="primary"
                      onClick={GenaratePass}
                      style={{ marginRight: 3 }}
                    >
                      Generate Password
                    </CButton>
                    <div>
                      <CopyToClipboard
                        text={state.password}
                        onCopy={onCopy}
                        disabled={state.password ? false : true}
                      >
                        <button type="button" className="btn btn-light">
                          {!state.copied ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-copy"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
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
                        </button>
                      </CopyToClipboard>
                    </div>
                  </CInputGroup>
                  <span style={{ color: "red" }}>{errorMsg.password}</span>

                  {/* Display password validation rules */}
                  <div className="password-rules">
                    <ul>
                      <li style={{ color: passwordValidation(state.password).length ? 'green' : 'red' }}>
                        Minimum 8 characters
                      </li>
                      <li style={{ color: passwordValidation(state.password).uppercase ? 'green' : 'red' }}>
                        At least one uppercase letter
                      </li>
                      <li style={{ color: passwordValidation(state.password).number ? 'green' : 'red' }}>
                        At least one number
                      </li>
                      <li style={{ color: passwordValidation(state.password).specialChar ? 'green' : 'red' }}>
                        At least one special character (!@#$%^&*(),.?":{ }|)
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <div className="col-6">
                <label>
                  Level <span style={{ color: "red" }}>*</span> &nbsp;
                  <CTooltip
                    content={
                      <ul>
                        {state.labellist.map((item) => (
                          <li key={item._id}>
                            <span>{item.level_name}:&nbsp;</span>
                            {item.level_description}
                            <span></span>
                          </li>
                        ))}
                      </ul>
                    }
                  >
                    <i className="fa-solid fa-circle-info"></i>
                  </CTooltip>
                </label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={handleChange}
                  id="level_id"
                  value={state.level_id}
                >
                  <option value="">Select Level</option>
                  {state.labellist.map((item, key) => (
                    <option value={item._id} key={key}>
                      {item.level_name}
                    </option>
                  ))}
                </select>
                <span style={{ color: "red" }}>{errorMsg.level_id}</span>
              </div>
            </div>
            <span className="d-flex justify-content-end">
              <CButton
                className="btn btn-secondary"
                style={{ color: "#fff", marginRight: 6 }}
                onClick={() => navigate("/client-list")}
              >
                Back
              </CButton>

              {Type == 0 && (
                <CButton
                  color="secondary"
                  onClick={() => {
                    setState((prevState) => ({
                      ...prevState,
                      first_name: "",
                      last_name: "",
                      contact: "",
                      email: "",
                      username: "",
                      password: "",
                      brand_name: "",
                      platform_name: "",
                    }));
                  }}
                  disabled={isDisabled ? true : false}
                  style={{ marginRight: 6 }}
                >
                  Reset
                </CButton>
              )}

              <CButton
                color="primary"
                type="submit"
                disabled={isDisabled ? true : false}
                style={{ marginRight: 6 }}
              >
                {Type == 0 ? "Add" : "Update"}
              </CButton>
            </span>
          </CForm>
        </div>
      </div>
    </div>
  );
}