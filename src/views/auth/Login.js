import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
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
import Service from "../../apis/Service";
import RouteURL from "../../apis/ApiURL";
import { Constants, ERROR_MESSAGE } from "../../apis/Constant";
import { ToastContainer, toast } from "react-toastify";
import casino from "src/assets/images/rummy_fair.png";
import Overlay from "src/assets/images/blue_overlay.png";
import { leftTrim } from "../../Utility/helper";
import "react-toastify/dist/ReactToastify.css";
import "src/scss/login.scss";
import { useDispatch } from "react-redux";
import { signIn } from "../../redux/slices/superAdminStateSlice";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  // Component State
  const [state, setState] = useState({
    username: "",
    password: "",
    showPassword: false,
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState({ username: "", password: "" });
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // On Component Mount: Load remembered credentials if they exist
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const rememberFlag = localStorage.getItem("rememberMe") === "true";

    if (rememberFlag) {
      setState((prevState) => ({
        ...prevState,
        username: savedUsername || "",
        password: savedPassword || "",
      }));
      setRememberMe(true);
    }

    // if (LoginDetailsData.rememberMe == "true") {
    //   setState((prevState) => ({
    //     ...prevState,
    //     username: LoginDetailsData.rememberedUsername || "",
    //     password: LoginDetailsData.rememberedPassword || "",
    //   }));
    //   setRememberMe(true);
    // }
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: leftTrim(value),
    }));
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  // Form Validation
  const validateForm = (e) => {
    e.preventDefault();
    setIsDisabled(true);

    if (handleValidation()) {
      LoginSubmitClick();
    } else {
      toast.error("Please fill all the fields!", {
        position: "bottom-right",
        onClose: () => setIsDisabled(false),
        autoClose: 3000,
      });
    }
  };

  const handleValidation = () => {
    let formIsValid = true;

    if (!state.username) {
      formIsValid = false;
      setErrorMsg((prevState) => ({
        ...prevState,
        username: ERROR_MESSAGE["usernameRequired"],
      }));
    } else {
      setErrorMsg((prevState) => ({
        ...prevState,
        username: "",
      }));
    }

    if (!state.password) {
      formIsValid = false;
      setErrorMsg((prevState) => ({
        ...prevState,
        password: ERROR_MESSAGE["passwordRequired"],
      }));
    } else {
      setErrorMsg((prevState) => ({
        ...prevState,
        password: "",
      }));
    }

    return formIsValid;
  };

  // Submit Login Form
  const LoginSubmitClick = () => {
    setIsLoading(true); // Show loader
    let params = JSON.stringify({
      username: state.username,
      password: state.password,
    });

    Service.apiPostCallRequestWithoutToken(RouteURL.login_api, params)
      .then((res) => {
        console.log(res, "RES===============>")
       
        setIsLoading(false); // Reset loader
        setIsDisabled(false); // Enable button

        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          toast.success(res.message, {
            position: "bottom-right",
            closeOnClick: true,
          });

          // Save credentials if Remember Me is checked
          if (rememberMe) {
            
            // dispatch(LoginDetails({ rememberedUsername: state.username, rememberedPassword: state.password, rememberMe: "true" }))

            localStorage.setItem("rememberedUsername", state.username);
            localStorage.setItem("rememberedPassword", state.password);
            localStorage.setItem("rememberMe", "true");
          } else {
            // Clear localStorage if unchecked
            localStorage.removeItem("rememberedUsername");
            localStorage.removeItem("rememberedPassword");
            localStorage.removeItem("rememberMe");
          }



           dispatch(signIn({ username: state.username, token: res.data.token}));
          
          navigate('/dashboard')
          

          // navigate("/otp", {
          //   state: {
          //     pageFor: "login",
          //     username: state.username,
          //     password: state.password,
          //   },
          // });
        } else {
          // Show error toast for invalid credentials
          toast.error(res.message, {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        console.log(error,"iiiiiiiiiiiii")
        setIsLoading(false); // Reset loader
        setIsDisabled(false); // Enable button

        // Show error toast for failed API call
        const errorMessage = error?.response?.data?.message || "Something went wrong. Please try again.";
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 3000,
        });
      });
  };


  return (
    <div className="position-relative">
      <div className="overlay_sec">
        <img src={Overlay} alt="overlay" />
      </div>
      <div className="login-container min-vh-100 d-flex flex-row align-items-center">
        <ToastContainer />
        <CContainer style={{ zIndex: "2" }}>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <h3>Welcome to Rummy Panel</h3>
              <img className="w-75 " src={casino} alt="Rummy Fair Logo" />
            </CCol>
            <CCol md={6} className="mt-5">
              <CCardGroup>
                <CCard className="p-4">
                  <div className="login-sec">
                    <CForm onSubmit={validateForm}>
                      <h1>Login</h1>

                      {/* Username Input */}
                      <div className="login_mid">
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={state.username}
                            onChange={handleChange}
                          />
                        </CInputGroup>
                        {errorMsg.username && (
                          <span className="error-message">{errorMsg.username}</span>
                        )}
                      </div>

                      {/* Password Input */}
                      <div className="login_mid">
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type={state.showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            value={state.password}
                            onChange={handleChange}
                          />
                          <CInputGroupText onClick={togglePasswordVisibility}>
                            <i
                              className={`fa ${state.showPassword ? "fa-eye" : "fa-eye-slash"
                                }`}
                            ></i>
                          </CInputGroupText>
                        </CInputGroup>
                        {errorMsg.password && (
                          <span className="error-message">{errorMsg.password}</span>
                        )}
                      </div>

                      {/* Remember Me */}
                      <div className="form-check my-3">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          className="form-check-input"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe" className="form-check-label mt-1">
                          Remember Me
                        </label>
                      </div>

                      {/* Login Button */}
                      <CRow>
                        <CCol xs={12}>
                          <div className="btn_sec">
                            <CButton
                              type="submit"
                              color="primary"
                              className="px-4"
                              disabled={isDisabled}
                            >
                              {isLoading ? <>Please wait&nbsp;<CSpinner size="sm" /></> : "Login"}
                            </CButton>
                          </div>
                        </CCol>
                        <CCol xs={12} className="text-right">
                          <CButton
                            type="button"
                            color="link"
                            className="px-0"
                            onClick={() => navigate("/forgot-password")}
                          >
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </div>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
}
