import React, { useEffect, useState } from 'react';
import {
  CCard, CCardHeader, CCardBody, CButton, CFormInput, CInputGroup,
  CInputGroupText, CModal, CModalBody, CModalHeader, CModalTitle,
  CModalFooter, CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CBadge, CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPlus } from '@coreui/icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultForm = {
  name: '', minBuyin: '', maxBuyin: '', minPlayer: 2, maxPlayer: 2,
  noOfCards: '', gameStartTime: '', variantType: '', pointValue: '',
  dealsPerGame: '', noOfDeck: '', cardsPerPlayer: '', playerTurnTime: '',
  serviceFee: '', graceTime: '', skillBasedMM: false, status: 1, gid: 1
};

const TemplateManagement = () => {
  const [formData, setFormData] = useState(defaultForm);
  const [visible, setVisible] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    const errors = [];
    const {
      name, minBuyin, maxBuyin, minPlayer, maxPlayer, noOfCards, gameStartTime,
      variantType, pointValue, dealsPerGame, noOfDeck, cardsPerPlayer,
      playerTurnTime, serviceFee, graceTime
    } = formData;

    if (!name) errors.push("Name is required.");
    if (minBuyin < 2) errors.push("Min Buyin must be at least 2.");
    if (maxBuyin > 5) errors.push("Max Buyin cannot be greater than 5.");
    if (minPlayer < 2) errors.push("Minimum player must be at least 2.");
    if (![2, 6].includes(Number(maxPlayer))) errors.push("Max player must be 2 or 6.");
    if (!noOfCards) errors.push("Number of cards is required.");
    if (gameStartTime % 1000 !== 0 || gameStartTime < 1000 || gameStartTime > 30000)
      errors.push("Game Start Time must be between 1000 and 30000 in steps of 1000.");
    if (playerTurnTime % 1000 !== 0 || playerTurnTime < 5000 || playerTurnTime > 60000)
      errors.push("Player Turn Time must be between 5000 and 60000 in steps of 1000.");
    if (graceTime % 1000 !== 0 || graceTime < 1000 || graceTime > 30000)
      errors.push("Grace Time must be between 1000 and 30000 in steps of 1000.");
    if (serviceFee < 1 || serviceFee > 99)
      errors.push("Service Fee must be between 1 and 99.");
    if (![13, 14].includes(Number(cardsPerPlayer)))
      errors.push("Cards Per Player must be 13 or 14.");
    if (![1, 2, 3, 4, 5].includes(Number(noOfDeck)))
      errors.push("No of Deck must be 1, 2, 3, 4, or 5.");
    if (![1, 2, 3].includes(Number(variantType)))
      errors.push("Variant Type is required.");

    if (variantType === '1' && !pointValue)
      errors.push("Point value is required for Points Rummy.");
    if (variantType === '2' && (!dealsPerGame || dealsPerGame < 1 || dealsPerGame > 10))
      errors.push("Deals per game must be between 1 and 10 for Deals Rummy.");

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      await axios.post('http://3.12.20.117:8081/template', formData);
      toast.success("Template Added Successfully");
      setVisible(false);
      fetchTemplates();
    } catch {
      toast.error("Failed to submit form.");
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get('http://3.12.20.117:8081/template/contest');
      setTemplateData(res?.data || []);
    } catch {
      toast.error("Failed to fetch data, using fallback.");
      setTemplateData([]);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const filteredData = templateData.filter((item) =>
    Object.values(item).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <CCard className="mt-4">
      <ToastContainer />
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>Template Management</h5>
        <CButton color="primary" onClick={() => setVisible(true)}>
          <CIcon icon={cilPlus} className="me-2" /> Add Template
        </CButton>
      </CCardHeader>

      <CCardBody>
        <div className="row mb-3">
          <div className="col-4">
            <CInputGroup>
              <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
              <CFormInput
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CInputGroup>
          </div>
        </div>

        <CTable hover bordered responsive>
          <CTableHead className="table-primary text-center">
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Min Buyin</CTableHeaderCell>
              <CTableHeaderCell>Max Buyin</CTableHeaderCell>
              <CTableHeaderCell>Players</CTableHeaderCell>
              <CTableHeaderCell>Cards</CTableHeaderCell>
              <CTableHeaderCell>Service Fee</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.map((item, idx) => (
              <CTableRow key={idx} className="text-center">
                <CTableDataCell>{item.id}</CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.minBuyin}</CTableDataCell>
                <CTableDataCell>{item.maxBuyin}</CTableDataCell>
                <CTableDataCell>{item.minPlayer}-{item.maxPlayer}</CTableDataCell>
                <CTableDataCell>{item.noOfCards}</CTableDataCell>
                <CTableDataCell>{item.serviceFee}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={item.status === 1 ? 'success' : 'danger'}>
                    {item.status === 1 ? 'Active' : 'Inactive'}
                  </CBadge>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

      <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static">
        <CModalHeader>
          <CModalTitle>Add Template</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            {[
              'name', 'minBuyin', 'maxBuyin', 'minPlayer', 'maxPlayer',
              'noOfCards', 'gameStartTime', 'variantType', 'noOfDeck',
              'cardsPerPlayer', 'playerTurnTime', 'serviceFee', 'graceTime'
            ].map((field, i) => (
              <div key={field} className="col-md-6 mb-3">
                <label className="form-label">{field}</label>
                {field === 'variantType' ? (
                  <CFormSelect name="variantType" value={formData.variantType} onChange={handleChange}>
                    <option value="">Select Variant</option>
                    <option value="1">Points Rummy</option>
                    <option value="2">Deals Rummy</option>
                    <option value="3">Pools Rummy</option>
                  </CFormSelect>
                ) : (
                  <CFormInput name={field} value={formData[field]} onChange={handleChange} />
                )}
              </div>
            ))}

            {formData.variantType === '1' && (
              <div className="col-md-6 mb-3">
                <label className="form-label">Point Value</label>
                <CFormInput name="pointValue" value={formData.pointValue} onChange={handleChange} />
              </div>
            )}

            {formData.variantType === '2' && (
              <div className="col-md-6 mb-3">
                <label className="form-label">Deals Per Game</label>
                <CFormInput name="dealsPerGame" value={formData.dealsPerGame} onChange={handleChange} />
              </div>
            )}

            <div className="col-md-6 mb-3">
              <label className="form-label">Skill Based Matchmaking</label>
              <CFormSelect name="skillBasedMM" value={formData.skillBasedMM ? 'true' : 'false'} onChange={(e) =>
                setFormData({ ...formData, skillBasedMM: e.target.value === 'true' })}>
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </CFormSelect>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSubmit}>Submit</CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default TemplateManagement;
