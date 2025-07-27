import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import '../styles/Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems = 0,
  itemsPerPage = 10,
  showInfo = true,
  className = ""
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`pagination-container ${className}`}>
      {/* Page Info */}
      {showInfo && totalItems > 0 && (
        <div className="pagination-info">
          Showing {startItem} to {endItem} of {totalItems} items
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        {/* First Page */}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          title="First page"
        >
          <FiChevronsLeft />
        </button>

        {/* Previous Page */}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
        >
          <FiChevronLeft />
        </button>

        {/* Page Numbers */}
        <div className="pagination-pages">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="pagination-ellipsis">...</span>
              ) : (
                <button
                  className={`pagination-btn page-number ${page === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Page */}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          <FiChevronRight />
        </button>

        {/* Last Page */}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last page"
        >
          <FiChevronsRight />
        </button>
      </div>

      {/* Page Jump */}
      <div className="pagination-jump">
        <span>Go to page:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value=""
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              handlePageChange(page);
              e.target.value = '';
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                handlePageChange(page);
                e.target.value = '';
              }
            }
          }}
          className="pagination-jump-input"
          placeholder={currentPage.toString()}
        />
      </div>
    </div>
  );
};

export default Pagination; 