import React from 'react';
import { CPagination, CPaginationItem } from '@coreui/react';

const TransactionPagination = ({ page, totalPages, onPageChange }) => {
  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  // Generate a range of page numbers to show
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <CPagination align="center" aria-label="Transactions pagination">
      <CPaginationItem
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </CPaginationItem>

      {getPageNumbers().map((p) => (
        <CPaginationItem
          key={p}
          active={p === page}
          onClick={() => handlePageChange(p)}
        >
          {p}
        </CPaginationItem>
      ))}

      <CPaginationItem
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </CPaginationItem>
    </CPagination>
  );
};

export default TransactionPagination;
