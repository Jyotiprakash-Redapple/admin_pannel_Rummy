import React from 'react';
import {
  ExportAsExcel,
  ExportAsCsv
} from '@siamf/react-export';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpreadsheet } from '@coreui/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const addTotalsRow = (data) => {
  if (!data || data.length === 0) return data;

  const keys = Object.keys(data[0]);

  const totals = {};
  keys.forEach((key, index) => {
    const values = data.map(row => row[key]);
    const isNumeric = values.every(val => !isNaN(parseFloat(val)) && isFinite(val));

    if (index === 0) {
      totals[key] = 'TOTAL';
    } else if (isNumeric) {
      totals[key] = values.reduce((sum, val) => sum + parseFloat(val || 0), 0).toFixed(2);
    } else {
      totals[key] = '';
    }
  });

  return [...data, totals];
};


const exportStyledPDF = (data, filename) => {
  if (!data || data.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text(`${filename}`, 40, 40);

  const keys = Object.keys(data[0]);
  const body = data.map(row => Object.values(row));

  const totals = keys.map((key, index) => {
    const values = data.map(row => row[key]);
    const isNumeric = values.every(val => !isNaN(parseFloat(val)) && isFinite(val));

    if (index === 0) return 'TOTAL';
    if (isNumeric) {
      return values.reduce((acc, val) => acc + parseFloat(val || 0), 0).toFixed(2);
    }
    return '';
  });

  body.push(totals);

  autoTable({
    startY: 60,
    head: [keys],
    body,
    theme: 'striped',
    headStyles: {
      fillColor: [29, 140, 248],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      textColor: [50, 50, 50],
      fontSize: 10
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 5
    },
    margin: { top: 60, bottom: 20, left: 20, right: 20 }
  });

  doc.save(`${filename}.pdf`);
};


const AllInOneExportButton = ({ data, filename }) => {
  const formatHeader = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  let headers = [];
  if (data?.length >= 1) {
    headers = Object.keys(data?.[0]).map((key) => formatHeader(key));
  }

 
  const dataWithTotals = addTotalsRow(data);

  return (
    <CDropdown>
      <CDropdownToggle color="primary" size="sm">
        <CIcon icon={cilSpreadsheet} className="me-2" />
        Export
      </CDropdownToggle>
      <CDropdownMenu>
        <ExportAsExcel data={dataWithTotals} headers={headers} fileName={filename}>
          {(props) => (
            <CDropdownItem {...props}>Export to Excel</CDropdownItem>
          )}
        </ExportAsExcel>

        {data?.length ? (
          <ExportAsCsv data={dataWithTotals} fileName={filename}>
            {(props) => (
              <CDropdownItem {...props}>Export to CSV</CDropdownItem>
            )}
          </ExportAsCsv>
        ) : null}

        <CDropdownItem onClick={() => exportStyledPDF(data, filename)}>
          Export to PDF (with Totals)
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AllInOneExportButton;
