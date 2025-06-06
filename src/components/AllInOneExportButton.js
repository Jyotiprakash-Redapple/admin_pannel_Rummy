import React from 'react';
import { ExportAsExcel, ExportAsCsv } from '@siamf/react-export';
import { CButton, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpreadsheet } from '@coreui/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const exportStyledPDF = (data, filename) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  // Add a title
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text(`${filename}`, 40, 40);

  autoTable({
    startY: 60,
    head: [Object.keys(data[0])],
    body: data.map((row) => Object.values(row)),
    theme: 'striped', // cleaner look
    headStyles: {
      fillColor: [29, 140, 248], // blue header
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      textColor: [50, 50, 50],
      fontSize: 10
    },
    styles: {
      overflow: 'linebreak', // wrap long text
      cellPadding: 5
    },
    margin: { top: 60, bottom: 20, left: 20, right: 20 },
    // didDrawPage: (data) => {
    //   // Optional: add page numbers
    //   const pageCount = doc.getNumberOfPages();
    //   doc.setFontSize(9);
    //   doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 20);
    // }
  });

  doc.save(`${filename}.pdf`);
};

const AllInOneExportButton = ({ data, filename }) => {
console.log(data, "data AllInOneExportButton", filename)
  const formatHeader = (key) =>
	key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  let headers = []
  if (data?.length >= 1) {
    headers = Object.keys(data?.[0]).map((key) => formatHeader(key));
  }

  return (
    <CDropdown>
      <CDropdownToggle color="primary" size="sm">
        <CIcon icon={cilSpreadsheet} className="me-2" />
        Export
      </CDropdownToggle>
      <CDropdownMenu>
        <ExportAsExcel data={data} headers={headers} fileName={filename}>
          {(props) => (
            <CDropdownItem {...props}>Export to Excel</CDropdownItem>
          )}
        </ExportAsExcel>

        {
          data?.length ? <ExportAsCsv data={data} fileName={filename}>
          {(props) => (
            <CDropdownItem {...props}>Export to CSV</CDropdownItem>
          )}
        </ExportAsCsv> : <></>
        }
        {/* <ExportAsCsv data={data} fileName={filename}>
          {(props) => (
            <CDropdownItem {...props}>Export to CSV</CDropdownItem>
          )}
        </ExportAsCsv> */}

       {/* <CButton style={{paddingInline: '20px', fontSize: '15px'}} size="sm" onClick={() => exportStyledPDF(data, 'User Report')}>
  
  Export to PDF
</CButton> */}

      </CDropdownMenu>
    </CDropdown>
  );
};

export default AllInOneExportButton;
