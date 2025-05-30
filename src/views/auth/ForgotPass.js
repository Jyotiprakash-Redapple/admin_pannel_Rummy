import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { leftTrim } from "../../Utility/helper";
import { ToastContainer, toast } from "react-toastify";
import { Constants, ERROR_MESSAGE } from "../../apis/Constant";
import Service from "../../apis/Service";
import RouteURL from "../../apis/ApiURL";

export default function ForgotPassword() {
  let navigate = useNavigate();
  const [state, setState] = useState({ username: "" });
  const [errorMsg, setErrorMsg] = useState({ username: "" });
  const [isDisabled, setIsDisabled] = useState(false);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: leftTrim(value),
    }));
  };

  /* Validation Checking */
  const ValidateForm = (e) => {
    e.preventDefault();

    if (handleValidation()) {
      SubmitClick();
    }
  };

  /* Validate all fields */
  const handleValidation = () => {
    let formIsValid = true;

    //Name
    if (!state.username) {
      formIsValid = false;
      setErrorMsg((prevState) => ({
        ...prevState,
        username: `${ERROR_MESSAGE["emailUsernameRequired"]}`,
      }));
    } else {
      setErrorMsg((prevState) => ({
        ...prevState,
        username: "",
      }));
    }

    return formIsValid;
  };
  const SubmitClick = (e) => {
    setIsDisabled(true); // Start loader by disabling the button
    let params = JSON.stringify({
      username: state.username,
    });

    Service.apiPostCallRequestWithoutToken(RouteURL.forgotPassword, params)
      .then((res) => {
        setIsDisabled(false); // Stop loader on success
        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          navigate("/otp", {
            state: {
              pageFor: "forgotpass",
              username: state.username,
            },
          });
        } else {
          toast.error(res.message, {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        setIsDisabled(false); // Stop loader on error
          toast.error(error.response.data.message, {
            position: "bottom-right",
            autoClose: 3000,
          });
      });
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={ValidateForm}>
                    <h1 style={{ marginBottom: "1.5rem" }}>Forgot Password</h1>{" "}
                    {/* Spacing for heading */}
                    <CInputGroup className="mb-1">
                      {" "}
                      {/* Reduced bottom margin */}
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Enter your email id / username "
                        id="username"
                        autoComplete="off"
                        value={state.username}
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <span
                      style={{
                        color: "red",
                        fontSize: "1.0rem",
                        marginTop: "0.50rem",
                        display: "block",
                      }}
                    >
                      {errorMsg.username}
                    </span>{" "}
                    {/* Reduced spacing */}
                    <CRow className="mt-3">
                      {" "}
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          type="submit"
                          disabled={isDisabled}
                        >
                          {isDisabled ? (
                            <CSpinner size="sm" />
                          ) : (
                            "Reset Password"
                          )}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}
