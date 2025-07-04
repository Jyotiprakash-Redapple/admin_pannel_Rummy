import React, { useState, useEffect } from "react";
import {
	CAvatar,
	CDropdown,
	CDropdownDivider,
	CDropdownHeader,
	CDropdownItem,
	CDropdownMenu,
	CDropdownToggle,
	CButton,
} from "@coreui/react";
import {
	CModal,
	CModalHeader,
	CModalTitle,
	CModalBody,
	CModalFooter,
	CForm,
	CFormInput,
	CFormLabel,
	CFormCheck,
	CRow,
	CCol,
} from "@coreui/react";
import { cilLockLocked, cilSettings, cilUser, cilPeople } from "@coreui/icons";

import CIcon from "@coreui/icons-react";
import avatar8 from "./../../assets/images/avatars/woman.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { signOut } from "../../redux/slices/superAdminStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import ChangePassword from "../../views/auth/ChangePass";
import RouteURL from "../../apis/ApiURL";
import Service from "../../apis/Service";
import { Constants } from "../../apis/Constant";
import { PageLoader } from "../Loder";
import {createFeatureFlags} from "../../Utility/helper"
const defaultData = {
	cfg_bonus_percentage: 50,
	cfg_gst_percentage: 28,
	cfg_gst_transfer_to_bonus: true,
	cfg_id: 1,
	cfg_min_withdraw_amount: 0,
	cfg_platform_fees_percentage: 0,
	cfg_tds_percentage: 0,
	cfg_tds_threshold_amount: 0,
	cfg_tds_transfer_to_bonus: true,
	cfg_min_deposit_limit: 0,
	cfg_max_deposit_limit: 0,
	cfg_referal_bonus_amount: 0,
cfg_refree_bonus_amount: 0,
};

const TaxConfigModal = ({ visible, onClose, isEdit, isView }) => {
	const [formData, setFormData] = useState(defaultData);
	const [type, setType] = useState("get");
	const token = useSelector((state) => state.user.token);

	const PlayerDetails = () => {
		Service.apiPostCallRequest(RouteURL.tax_config, { type: "get" , ...formData}, token)
			.then((res) => {
				console.log(res, "tax-confif");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					if (res.data) {
						setFormData(res.data.data);
					}
					//setFormData()
				} else {
					toast.error(res.data.message, {
						position: "bottom-right",
						closeOnClick: true,
					});
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message, {
					position: "bottom-right",
				});
			});
	};

	useEffect(() => {
		if (token) {
			PlayerDetails();
		}
	}, []);

	const handleChange = (e) => {
		const { name, value, type: inputType, checked } = e.target;
		if (
			name == "cfg_gst_transfer_to_bonus" ||
			name == "cfg_tds_transfer_to_bonus"
		) {
			setFormData((prev) => ({
				...prev,
				[name]: checked ? true : false,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: parseInt(value),
			}));
		}
	};

	const handleSubmit = () => {
		Service.apiPostCallRequest(
			RouteURL.tax_config,
			{ type: "set", ...formData },
			token
		)
			.then((res) => {
				console.log(res, "tax-confif");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
					toast.success(res.message, {
						position: "bottom-right",
						closeOnClick: true,
					});
					//setFormData()
				} else {
					toast.error(res.data.message, {
						position: "bottom-right",
						closeOnClick: true,
					});
				}
			})
			.catch((error) => {
				console.log(error.response.data.message);
				toast.error(error.response.data.message, {
					position: "bottom-right",
				});
			});
	};


	console.log(formData, "hello=============>");
	return (
		<CModal visible={visible} onClose={onClose} backdrop={'static'}>
			<ToastContainer />
			<CModalHeader>
				<CModalTitle> Setting Configuration</CModalTitle>
			</CModalHeader>
			<CModalBody>
				<CForm>
					<CRow className='g-3'>
						<CCol md={6}>
							<CFormLabel htmlFor='cfg_gst_percentage'>GST %</CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_gst_percentage'
								value={formData.cfg_gst_percentage}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>
						<CCol md={6}>
							<CFormLabel htmlFor='cfg_bonus_percentage'>Bonus %</CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_bonus_percentage'
								value={formData.cfg_bonus_percentage}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>
						<CCol md={6}>
							<CFormLabel htmlFor='cfg_tds_threshold_amount'>
								Min Threshold for TDS %
							</CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_tds_threshold_amount'
								value={formData.cfg_tds_threshold_amount}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>
						<CCol md={6}>
							<CFormLabel htmlFor='cfg_tds_percentage'>TDS %</CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_tds_percentage'
								value={formData.cfg_tds_percentage}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>
						<CCol md={6}>
							<CFormLabel htmlFor='cfg_min_withdraw_amount'>Min Withdraw Amount </CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_min_withdraw_amount'
								value={formData.cfg_min_withdraw_amount}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>
							<CCol md={6}>
							<CFormLabel htmlFor='cfg_min_deposit_limit'>Min Deposit Amount </CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_min_deposit_limit'
								value={formData.cfg_min_deposit_limit}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>
							<CCol md={6}>
							<CFormLabel htmlFor='cfg_max_deposit_limit'>Max Deposit Amount </CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_max_deposit_limit'
								value={formData.cfg_max_deposit_limit}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>

							<CCol md={6}>
							<CFormLabel htmlFor='cfg_referal_bonus_amount'>Referral Amount *</CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_referal_bonus_amount'
								value={formData.cfg_referal_bonus_amount}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>
						
	<CCol md={6}>
							<CFormLabel htmlFor='cfg_refree_bonus_amount'>Referee Amount *</CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_refree_bonus_amount'
								value={formData.cfg_refree_bonus_amount}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>

						<CCol md={6}>
							<CFormLabel htmlFor='cfg_platform_fees_percentage'>Platform Fees %</CFormLabel>
							<CFormInput
								readOnly={isEdit === false}
								type='number'
								name='cfg_platform_fees_percentage'
								value={formData.cfg_platform_fees_percentage}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>
						<CCol md={6}>
							<CFormCheck
								readOnly={isEdit === false}
								label='Apply GST on Bonus'
								name='cfg_gst_transfer_to_bonus'
								checked={formData.cfg_gst_transfer_to_bonus}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>

							<CFormCheck
								readOnly={isEdit === false}
								label='Apply TDS on Bonus'
								name='cfg_tds_transfer_to_bonus'
								checked={formData.cfg_tds_transfer_to_bonus}
								onChange={handleChange}
								// disabled={type === 'get'}
							/>
						</CCol>
					</CRow>
				</CForm>
			</CModalBody>
			<CModalFooter>
				<CButton color='secondary' onClick={onClose}>
					Close
				</CButton>
				<CButton
					color='primary'
					onClick={handleSubmit}
					className={` ${isEdit === false ? "prevent_default" : "auto"}`}>
					Save
				</CButton>
			</CModalFooter>
		</CModal>
	);
};

const AppHeaderDropdown = () => {
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
	const menuPermission = useSelector((state) => state.menu_permission);
	const [tax_config_key, _] = useState(14);

	const [taxtConfigFeature, setTaxConfigFeature] = useState(null);
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = (e) => {
		e.preventDefault();
		setShow(true);
	};
	const [taxConfigModal, setTaxConfigModal] = useState(false);

	// const IsLogoutConfirmed = (e) => {
	//   e.preventDefault();
	//   Swal.fire({
	//     title: "Are you sure?",
	//     text: "You want to logout!",
	//     icon: "warning",
	//     showCancelButton: true,
	//     confirmButtonColor: "#3085d6",
	//     cancelButtonColor: "#d33",
	//     cancelButtonText: "No",
	//     confirmButtonText: "Yes",
	//   }).then((result) => {
	//     if (result.isConfirmed) {
	//       handleSignOut()
	//     }
	//   });

	// }

	const handleSignOut = (e) => {
		const keysToKeep = ["rememberedUsername", "rememberedPassword"];
		const tempStorage = {};

		keysToKeep.forEach((key) => {
			tempStorage[key] = localStorage.getItem(key);
		});

		localStorage.clear();

		keysToKeep.forEach((key) => {
			if (tempStorage[key] !== null) {
				localStorage.setItem(key, tempStorage[key]);
			}
		});

		localStorage.setItem("rememberMe", "true");

		setTimeout(() => {
			dispatch(signOut());
			navigate("/");
		}, 1000);
	};
	useEffect(() => {
		let feature = menuPermission.filter((_) => {
			if (_.menu_id === tax_config_key) {
				return _;
			}
		});
		setTaxConfigFeature(feature?.[0] || null);
	}, []);
	console.log(taxtConfigFeature, "TAX CONFIG ");

	let isTaxConfigFeatureView = false;
	let isTaxConfigFeatureEdit = false;
	taxtConfigFeature?.menu_features.map((_) => {
		if (_.feature_name == "view" && _.prop === true) {
			isTaxConfigFeatureView = true;
		}
	});
	taxtConfigFeature?.menu_features.map((_) => {
		if (_.feature_name == "edit" && _.prop === true) {
			isTaxConfigFeatureEdit = true;
		}
	});
	console.log(isTaxConfigFeatureEdit, "isTaxConfigFeatureEdit=======")

	return (
		<>
			{/* <ToastContainer /> */}
			<CDropdown variant='nav-item'>
				<CDropdownToggle placement='bottom-end' className='py-0 pe-0' caret={false}>
					<CAvatar src={avatar8} size='md' />
				</CDropdownToggle>
				<CDropdownMenu className='pt-0' placement='bottom-end'>
					<CDropdownHeader className='bg-body-secondary fw-semibold my-2'>
						<CIcon icon={cilPeople} className='me-2' />
						{user?.username}
					</CDropdownHeader>
					{/* <CDropdownItem href={import.meta.env.VITE_APP_PLATFORM_ENVIROMENT == 'development' ? '/profile' : '/cl/profile'}>
            {user?.username}
          </CDropdownItem> */}

					{/* <CDropdownItem href={import.meta.env.VITE_APP_PLATFORM_ENVIROMENT == 'development' ? '/my-account-list' : '/cl/my-account-list'}>
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem> */}
					{/* <CDropdownItem href="" onClick={handleShow}>
            <CIcon icon={cilSettings} className="me-2" />
            Change Password
          </CDropdownItem> */}
					{isTaxConfigFeatureView ? (
						<CDropdownItem
							href=''
							onClick={(e) => {
								e?.preventDefault();
								setTaxConfigModal(true);
							}}>
							<CIcon icon={cilSettings} className='me-2' />
							Setting
						</CDropdownItem>
					) : (
						<></>
					)}
					<CDropdownDivider />
					<CDropdownItem
						href=''
						onClick={handleSignOut}
						// onClick={(e) => IsLogoutConfirmed(e)}
					>
						<CIcon icon={cilLockLocked} className='me-2' />
						Logout
					</CDropdownItem>
				</CDropdownMenu>
			</CDropdown>

			<Modal size='md' backdrop='static' centered show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Set New Password</Modal.Title>
				</Modal.Header>
				<ChangePassword
					pageFor='changePassword'
					username={user?.username}
					onclose={handleClose}
				/>
			</Modal>
			<TaxConfigModal
				visible={taxConfigModal}
				onClose={() => {
					setTaxConfigModal(false);
				}}
				isEdit={isTaxConfigFeatureEdit}
				isView={isTaxConfigFeatureView}
			/>
		</>
	);
};

export default AppHeaderDropdown;
