import React, { useEffect, useState } from "react";
import {
	CCard,
	CCardHeader,
	CCardBody,
	CButton,
	CFormInput,
	CInputGroup,
	CInputGroupText,
	CModal,
	CModalBody,
	CModalHeader,
	CModalTitle,
	CModalFooter,
	CTable,
	CTableHead,
	CTableRow,
	CTableHeaderCell,
	CTableBody,
	CTableDataCell,
	CBadge,
	CFormSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilPlus } from "@coreui/icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createFeatureFlags } from "../../../Utility/helper";
import { useSelector, useDispatch } from "react-redux";
import { PageLoader } from "../../../components/Loder";
import { clearLimit } from "../../../redux/slices/superAdminStateSlice";
import Pagination from "../../../components/Pagination";
//import { BASE_URL } from "../../../apis/API";
const defaultForm = {
	name: "",
	minBuyin: 0,
	maxBuyin: 0,
	minPlayer: 2,
	maxPlayer: 2,
	noOfCards: 0,
	gameStartTime: 30000,
	variantType: "",
	pointValue: 1,
	dealsPerGame: 1,
	noOfDeck: 1,
	cardsPerPlayer: 13,
	playerTurnTime: 5000,
	serviceFee: 1,
	graceTime: 1000,
	skillBasedMM: false,
	status: 1,
	gid: 1,
};

const TemplateManagement = () => {
	const dispatch = useDispatch();
	const [formData, setFormData] = useState(defaultForm);
	const [visible, setVisible] = useState(false);
	const [templateData, setTemplateData] = useState([]);
	const [search, setSearch] = useState("");
	const [errors, setErrors] = useState({});
	const activeMenuId = useSelector((state) => state.active_menu_id);
	const menuPermission = useSelector((state) => state.menu_permission);
	const pageLimit = useSelector((state) => state.limit);
	const [accessMenu, setAccessMenu] = useState(null);

	console.log(formData, "FORM DATA====>")
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		console.log(name, value, "FORM CHNAGE")
		setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
	};

	const validateForm = () => {
		const errors = {};
		const {
			name,
			minBuyin,
			maxBuyin,
			minPlayer,
			maxPlayer,
			noOfCards,
			gameStartTime,
			variantType,
			pointValue,
			dealsPerGame,
			noOfDeck,
			cardsPerPlayer,
			playerTurnTime,
			serviceFee,
			graceTime,
		} = formData;

		if (!name) errors.name = "Name is required.";
		if (Number(minBuyin) < 2) errors.minBuyin = "Min Buyin must be at least 2.";
		if(Number(minBuyin) > 5) errors.minBuyin = "Min Buyin cannot be greater than 5."
		if (Number(maxBuyin) > 5) errors.maxBuyin = "Max Buyin cannot be greater than 5.";
		if (Number(minPlayer) < 2) errors.minPlayer = "Minimum player must be at least 2.";
		if (![2, 6].includes(Number(minPlayer)))
			errors.maxPlayer = "Min player must be 2 or 6."; 
		if (![2, 6].includes(Number(maxPlayer)))
			errors.maxPlayer = "Max player must be 2 or 6.";
		if (!noOfCards) errors.noOfCards = "Number of cards is required.";

		if (Number(gameStartTime) % 1000 !== 0 || Number(gameStartTime) < 1000 || Number(gameStartTime) > 30000)
			errors.gameStartTime = "Must be between 1000 and 30000 (steps of 1000).";

		if (
			Number(playerTurnTime) % 1000 !== 0 ||
			Number(playerTurnTime) < 5000 ||
			Number(playerTurnTime) > 60000
		)
			errors.playerTurnTime = "Must be between 5000 and 60000 (steps of 1000).";

		if (Number(graceTime) % 1000 !== 0 || Number(graceTime) < 1000 || Number(graceTime) > 30000)
			errors.graceTime = "Must be between 1000 and 30000 (steps of 1000).";

		if (Number(serviceFee) < 1 || Number(serviceFee) > 99)
			errors.serviceFee = "Service Fee must be between 1 and 99.";

		if (![13, 14].includes(Number(cardsPerPlayer)))
			errors.cardsPerPlayer = "Cards Per Player must be 13 or 14.";

		if (![1, 2, 3, 4, 5].includes(Number(noOfDeck)))
			errors.noOfDeck = "No of Deck must be 1, 2, 3, 4, or 5.";

		if (!variantType || ![1, 2, 3].includes(Number(variantType)))
			errors.variantType = "Variant Type is required.";

		if (variantType === "1" && !pointValue)
			errors.pointValue = "Point Value is required for Points Rummy.";

		if (
			variantType === "2" &&
			(!dealsPerGame || Number(dealsPerGame) < 1 || Number(dealsPerGame) > 10)
		)
			errors.dealsPerGame = "Deals per game must be between 1 and 10.";

		return errors;
	};

	const handleSubmit = async () => {
		const validationErrors = validateForm();
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			// Submit form
			console.log("Form submitted", formData);

			let param = {
				minBuyin: formData.minBuyin,
				maxBuyin: formData.maxBuyin,
				status: 1,
				//     "gid": 1,
				name: formData.name,
				minPlayer: formData.minPlayer,
				maxPlayer: formData.maxPlayer,
				noOfCards: formData.noOfCards,
				gameStartTime: formData.gameStartTime,
				pointValue: formData.pointValue,
				noOfDeck: formData.noOfCards,
				cardsPerPlayer: formData.cardsPerPlayer,
				playerTurnTime: formData.playerTurnTime,
				serviceFee: formData.serviceFee,
				graceTime: formData.graceTime,
				dealsPerGame: formData.dealsPerGame,
				variantType: formData.variantType,
				skillBasedMM: Boolean(formData.skillBasedMM),
			};
			try {
				let URL = 'http://18.191.105.81:8081' + '/template/create'
				await axios.post(URL, param);
				toast.success("Template Added Successfully");
				setVisible(false);
				fetchTemplates();
			} catch {
				toast.error("Failed to submit form.");
			}
		}
	};

	const fetchTemplates = async () => {
		try {
			let URL ='http://18.191.105.81:8081' + '/template/contest?userId=3'
			const res = await axios.get(
				URL
			);
			console.log(res, "RES++++++++++++");
			setTemplateData(res?.data?.payload?.templates || []);
		} catch (e) {
			console.log(e, "ERROR");
			toast.error("Failed to fetch data, using fallback.");
			setTemplateData([]);
		}
	};

	useEffect(() => {
		fetchTemplates();

		return () => {
			dispatch(clearLimit());
		};
	}, []);

	const filteredData = templateData?.filter((item) =>
		Object.values(item).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	useEffect(() => {
		if (menuPermission.length && activeMenuId) {
			let menu = menuPermission.filter((mId) => mId.menu_id === activeMenuId);
			console.log("MENU PERMISSION::", menu);
			if (menu.length > 0) {
				setAccessMenu(menu[0]);
			}
		}
	}, [activeMenuId, menuPermission]);

	if (accessMenu === null) {
		return <PageLoader />;
	}
	const FEATURE = createFeatureFlags(accessMenu?.menu_features);
	console.log(
		FEATURE?.isDelete,
		"FETAURE ROLE GAME TAMP",
		accessMenu?.menu_features
	);

	return (
		<CCard className='mt-4'>
			<ToastContainer />
			<CCardHeader className='d-flex justify-content-between align-items-center'>
				<h5>Template Management</h5>
				<CButton
					color='primary'
					onClick={() => setVisible(true)}
					className={FEATURE?.isCreate == false ? "prevent_default" : "auto"}>
					<CIcon icon={cilPlus} className='me-2' /> Add Template
				</CButton>
			</CCardHeader>

			<CCardBody>
				<div className='row mb-3'>
					<div className='col-4'>
						<CInputGroup>
							<CInputGroupText>
								<CIcon icon={cilSearch} />
							</CInputGroupText>
							<CFormInput
								placeholder='Search...'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</CInputGroup>
					</div>
					<div className='col-4'>
						<div
							style={{
								height: "100%",
								display: "flex",
								alignItems: "flex-end",
							}}>
							<CButton color='primary' onClick={() => {}}>
								Search
							</CButton>
						</div>
					</div>
				</div>
				<div className='table-responsive'>
					<CTable hover bordered responsive>
						<CTableHead className='table-primary text-center'>
							<CTableRow>
								<CTableHeaderCell>ID</CTableHeaderCell>
								<CTableHeaderCell>Variant Type</CTableHeaderCell>
								<CTableHeaderCell>Name</CTableHeaderCell>
								<CTableHeaderCell>Min Buyin</CTableHeaderCell>
								<CTableHeaderCell>Max Buyin</CTableHeaderCell>
								<CTableHeaderCell>Min Player</CTableHeaderCell>
								<CTableHeaderCell>Max Player</CTableHeaderCell>
								<CTableHeaderCell>Cards</CTableHeaderCell>
								<CTableHeaderCell>Decks</CTableHeaderCell>
								<CTableHeaderCell>Platform Fee (%)</CTableHeaderCell>
								<CTableHeaderCell>Status</CTableHeaderCell>
							</CTableRow>
						</CTableHead>
						<CTableBody>
							{filteredData.map((item, idx) => (
								<CTableRow key={idx} className='text-center'>
									<CTableDataCell>{item.id}</CTableDataCell>
									<CTableDataCell>
										{{
											1: "Points Rummy",
											2: "Deals Rummy",
											3: "Pools Rummy",
										}[item.variantType] || "N/A"}
									</CTableDataCell>
									<CTableDataCell>{item.name}</CTableDataCell>
									<CTableDataCell>{item.minBuyin}</CTableDataCell>
									<CTableDataCell>{item.maxBuyin}</CTableDataCell>
									<CTableDataCell>{item.minPlayer}</CTableDataCell>
									<CTableDataCell>{item.maxPlayer}</CTableDataCell>
									<CTableDataCell>{item.noOfCards}</CTableDataCell>
									<CTableDataCell>{item.noOfDeck}</CTableDataCell>
									<CTableDataCell>{item.serviceFee}%</CTableDataCell>
									<CTableDataCell>
										<CBadge color={item.status === 1 ? "success" : "danger"}>
											{item.status === 1 ? "Active" : "Inactive"}
										</CBadge>
									</CTableDataCell>
								</CTableRow>
							))}
						</CTableBody>
					</CTable>
				</div>
				{filteredData.length > 0 && (
					<div className='d-flex justify-content-center mt-4'>
						 {/* <Pagination
							page={page}
							totalPages={total}
							onPageChange={(newPage) =>
								//
							}
						/>  */}
					</div>
				)}
			</CCardBody>

			<CModal visible={visible} onClose={() => setVisible(false)} backdrop='static'>
				<CModalHeader>
					<CModalTitle>Add Template</CModalTitle>
				</CModalHeader>
				<CModalBody>
					<div className='row'>
						<div className='col-12 mb-3'>
							<label className='form-label'>Variant Type</label>
							<CFormSelect
								name='variantType'
								value={formData.variantType}
								onChange={handleChange}>
								<option value=''>Select Variant</option>
								<option value='1'>Points Rummy</option>
								<option value='2'>Deals Rummy</option>
								<option value='3'>Pools Rummy</option>
							</CFormSelect>
							{errors.variantType && <div className='text-danger'>{errors.variantType}</div>}
						</div>
					</div>

					{formData.variantType === "1" && (
						<div className='row'>
							<div className='col-12 mb-3'>
								<label className='form-label'>Point Value</label>
								<CFormInput
									name='pointValue'
									value={formData.pointValue}
									onChange={handleChange}
								/>
								{errors.pointValue && <div className='text-danger'>{errors.pointValue}</div>}
							</div>
						</div>
					)}

					{formData.variantType === "2" && (
						<div className='row'>
							<div className='col-12 mb-3'>
								<label className='form-label'>Deals Per Game</label>
								<CFormInput
									name='dealsPerGame'
									value={formData.dealsPerGame}
									onChange={handleChange}
								/>
								{errors.dealsPerGame && (
									<div className='text-danger'>{errors.dealsPerGame}</div>
								)}
							</div>
						</div>
					)}
					<div className='row'>
						<div className='col-6 mb-3'>
							<label className='form-label'>Min Player</label>
							<CFormInput
								name={"minPlayer"}
								value={formData.minPlayer}
								onChange={handleChange}
							/>
							{errors.minPlayer && <div className='text-danger'>{errors.minPlayer}</div>}
						</div>
						<div className='col-6 mb-3'>
							<label className='form-label'>Max Player</label>
							<CFormInput
								name={"maxPlayer"}
								value={formData.maxPlayer}
								onChange={handleChange}
							/>
							{errors.maxPlayer && <div className='text-danger'>{errors.maxPlayer}</div>}
						</div>
					</div>
					<div className='row'>
						<div className='col-12 mb-3'>
							<label className='form-label'>Name</label>
							<CFormInput name={"name"} value={formData.name} onChange={handleChange} />
							{errors.name && <div className='text-danger'>{errors.name}</div>}
						</div>
					</div>
					<div className='row'>
						<div className='col-6 mb-3'>
							<label className='form-label'>Min Buyin</label>
							<CFormInput
								name={"minBuyin"}
								value={formData.minBuyin}
								onChange={handleChange}
							/>
							{errors.minBuyin && <div className='text-danger'>{errors.minBuyin}</div>}
						</div>
						<div className='col-6 mb-3'>
							<label className='form-label'>Max Buyin</label>
							<CFormInput
								name={"maxBuyin"}
								value={formData.maxBuyin}
								onChange={handleChange}
							/>
							{errors.maxBuyin && <div className='text-danger'>{errors.maxBuyin}</div>}
						</div>
					</div>

					<div className='row'>
						<div className='col-12 mb-3'>
							<label className='form-label'>No Of Cards</label>
							<CFormInput
								name={"noOfCards"}
								value={formData.noOfCards}
								onChange={handleChange}
							/>
							{errors.noOfCards && <div className='text-danger'>{errors.noOfCards}</div>}
						</div>
					</div>
					<div className='row'>
						<div className='col-12 mb-3'>
							<label className='form-label'>Game Start Time</label>
							<CFormInput
								name={"gameStartTime"}
								value={formData.gameStartTime}
								onChange={handleChange}
							/>
							{errors.gameStartTime && (
								<div className='text-danger'>{errors.gameStartTime}</div>
							)}
						</div>
					</div>

					<div className='row'>
						<div className='col-12 mb-3'>
							<label className='form-label'>No Of Deck</label>
							<CFormInput
								name={"noOfDeck"}
								value={formData.noOfDeck}
								onChange={handleChange}
							/>
							{errors.noOfDeck && <div className='text-danger'>{errors.noOfDeck}</div>}
						</div>
					</div>
					<div className='row'>
						<div className='col-12 mb-3'>
							<label className='form-label'>Cards Per Player</label>
							<CFormInput
								name={"cardsPerPlayer"}
								value={formData.cardsPerPlayer}
								onChange={handleChange}
							/>
							{errors.cardsPerPlayer && (
								<div className='text-danger'>{errors.cardsPerPlayer}</div>
							)}
						</div>
					</div>

					<div className='row'>
						<div className='col-12 mb-3'>
							<label className='form-label'>Player Turn Time</label>
							<CFormInput
								name={"playerTurnTime"}
								value={formData.playerTurnTime}
								onChange={handleChange}
							/>
							{errors.playerTurnTime && (
								<div className='text-danger'>{errors.playerTurnTime}</div>
							)}
						</div>
					</div>
					<div className='row'>
						<div className='col-12 mb-3 '>
							<label className='form-label'>Platform Fess</label>
							<span
								style={{
									display: "flex",
									alignItems: "center",
								}}>
								<CFormInput
									name={"serviceFee"}
									value={formData.serviceFee}
									onChange={handleChange}
								/>{" "}
								<span
									style={{
										height: "100%",
										marginInline: "5px",
									}}>
									%
								</span>
							</span>

							{errors.serviceFee && <div className='text-danger'>{errors.serviceFee}</div>}
						</div>
					</div>

					<div className='row'>
						<div className='col-12 mb-3'>
							<label className='form-label'>graceTime</label>
							<CFormInput
								name={"graceTime"}
								value={formData.graceTime}
								onChange={handleChange}
							/>
							{errors.graceTime && <div className='text-danger'>{errors.graceTime}</div>}
						</div>
					</div>
					<div className='row'>
						<div className='col-12 mb-3'>
							<label className='form-label'>Skill Based Matchmaking</label>
							<CFormSelect
								name='skillBasedMM'
								value={formData.skillBasedMM ? "true" : "false"}
								onChange={(e) =>
									setFormData({ ...formData, skillBasedMM: e.target.value === "true" })
								}>
								<option value='false'>Disabled</option>
								<option value='true'>Enabled</option>
							</CFormSelect>
							{errors.skillBasedMM && (
								<div className='text-danger'>{errors.skillBasedMM}</div>
							)}
						</div>
					</div>
				</CModalBody>
				<CModalFooter>
					<CButton color='secondary' onClick={() => setVisible(false)}>
						Cancel
					</CButton>
					<CButton color='primary' onClick={handleSubmit}>
						Submit
					</CButton>
				</CModalFooter>
			</CModal>
		</CCard>
	);
};

export default TemplateManagement;
