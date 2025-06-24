
import React, { useEffect, useState } from 'react';
import {
  CCard, CCardHeader, CButton, CFormInput, CInputGroup, CInputGroupText,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPlus } from '@coreui/icons';
import AllInOneExportButton from '../../../components/AllInOneExportButton';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const demoData = [
  {
    id: 1,
    name: "Test-1",
    minBuyin: 1,
    maxBuyin: 5,
    status: 1,
    gid: 1,
    minPlayer: 2,
    maxPlayer: 6,
    noOfCards: 56,
    gameStartTime: 5000,
    pointValue: 1,
    noOfDeck: 2,
    cardsPerPlayer: 13,
    playerTurnTime: 5000,
    serviceFee: 1,
    graceTime: 10000,
    dealsPerGame: 1,
    variantType: 1,
    skillBasedMM: true
  }
];

const TemplateManagement = () => {
  const [templateData, setTemplateData] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '', minBuyin: '', maxBuyin: '', gid: '', status: '', minPlayer: '',
    maxPlayer: '', noOfCards: '', gameStartTime: '', pointValue: '', noOfDeck: '',
    cardsPerPlayer: '', playerTurnTime: '', serviceFee: '', graceTime: '',
    dealsPerGame: '', variantType: '', skillBasedMM: false
  });

  const fetchTemplates = async () => {
    try {
      const res = await axios.get('http://3.12.20.117:8081/template/contest');
      console.log(res, "FETCH TAMPLATE ++++++++++++++++++>>>")
      if (res?.data?.length) setTemplateData(res.data);
      else throw new Error();
    } catch (error) {
      console.log(error, "ERROR")
      toast.error("Using demo data due to API failure");
      setTemplateData(demoData);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://3.12.20.117:8081/template', formData);
      toast.success("Template Added Successfully");
      setVisible(false);
      fetchTemplates();
    } catch (err) {
      toast.error("Failed to submit form. Please try again");
    }
  };

  const filteredData = templateData.filter((item) =>
    Object.values(item).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => { fetchTemplates(); }, []);

  return (
    <CCard className="mt-4">
      <ToastContainer />
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>Template Management</h5>
        <CButton color="primary" onClick={() => setVisible(true)}>
          <CIcon icon={cilPlus} className="me-2" /> Add Template
        </CButton>
      </CCardHeader>

      <div className="row m-3">
        <div className="col-md-6">
          <CInputGroup>
            <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CInputGroup>
        </div>
        <div className="col-md-6 text-end">
          <AllInOneExportButton data={filteredData} filename="template-export" />
        </div>
      </div>

      <div className="table-responsive">
        <CTable hover bordered responsive>
          <CTableHead color="light">
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
            {filteredData.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{item.id}</CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.minBuyin}</CTableDataCell>
                <CTableDataCell>{item.maxBuyin}</CTableDataCell>
                <CTableDataCell>{item.minPlayer} - {item.maxPlayer}</CTableDataCell>
                <CTableDataCell>{item.noOfCards}</CTableDataCell>
                <CTableDataCell>{item.serviceFee}</CTableDataCell>
                <CTableDataCell>{item.status === 1 ? 'Active' : 'Inactive'}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static">
        <CModalHeader>
          <CModalTitle>Add New Template</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {Object.keys(formData).map((key, idx) => (
            <div className="mb-3" key={idx}>
              <label className="form-label">{key}</label>
              <CFormInput
                type={typeof formData[key] === 'boolean' ? 'checkbox' : 'text'}
                name={key}
                checked={typeof formData[key] === 'boolean' ? formData[key] : undefined}
                value={typeof formData[key] !== 'boolean' ? formData[key] : undefined}
                onChange={handleFormChange}
              />
            </div>
          ))}
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
