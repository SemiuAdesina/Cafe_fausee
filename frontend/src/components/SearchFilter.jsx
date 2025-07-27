import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FaFilter, FaTimes, FaSlidersH } from 'react-icons/fa';
import { debounce } from '../services/utils.js';
import '../styles/SearchFilter.css';

const SearchFilter = ({ 
  onSearch, 
  onFilter, 
  filters = [], 
  placeholder = "Search...",
  showFilters = true,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce((term) => {
    onSearch(term);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters };
    if (value) {
      newFilters[filterKey] = value;
    } else {
      delete newFilters[filterKey];
    }
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilter({});
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length;
  };

  return (
    <div className={`search-filter-container ${className}`}>
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={clearSearch}
              title="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && filters.length > 0 && (
        <div className="filter-section">
          <button
            className={`filter-toggle ${showFilterDropdown ? 'active' : ''}`}
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            {showFilterDropdown ? <FaTimes /> : <FaSlidersH />}
            {showFilterDropdown ? 'Close Filters' : 'Filters'}
            {getActiveFilterCount() > 0 && (
              <span className="filter-badge">{getActiveFilterCount()}</span>
            )}
          </button>

          {showFilterDropdown && (
            <div className="filter-dropdown">
              <div className="filter-header">
                <h4>Filters</h4>
                {getActiveFilterCount() > 0 && (
                  <button 
                    className="clear-filters-btn"
                    onClick={clearAllFilters}
                  >
                    <FaTimes />
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="filter-options">
                {filters.map((filter) => (
                  <div key={filter.key} className="filter-option">
                    <label>{filter.label}</label>
                    {filter.type === 'select' ? (
                      <select
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All {filter.label}</option>
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : filter.type === 'date' ? (
                      <input
                        type="date"
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="filter-input"
                      />
                    ) : (
                      <input
                        type="text"
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        placeholder={`Filter by ${filter.label.toLowerCase()}`}
                        className="filter-input"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter; 