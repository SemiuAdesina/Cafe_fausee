import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFilter, FaTimes, FaUtensils, FaWineGlass, FaIceCream, FaLeaf, FaSlidersH, FaFunnel } from 'react-icons/fa';
import { GiMeat, GiFishCooked, GiBreadSlice, GiCoffeeCup } from 'react-icons/gi';
import { MdRestaurantMenu } from 'react-icons/md';
import '../styles/MenuSearchFilter.css';

const MenuSearchFilter = ({ onFilterChange, menuData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50 });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  // Category icons mapping
  const categoryIcons = {
    'Starters': <FaLeaf className="category-icon" />,
    'Appetizers': <FaLeaf className="category-icon" />,
    'Main Courses': <FaUtensils className="category-icon" />,
    'Entrees': <FaUtensils className="category-icon" />,
    'Desserts': <FaIceCream className="category-icon" />,
    'Beverages': <FaWineGlass className="category-icon" />,
    'Drinks': <FaWineGlass className="category-icon" />,
    'Wine': <FaWineGlass className="category-icon" />,
    'Beer': <FaWineGlass className="category-icon" />,
    'Coffee': <GiCoffeeCup className="category-icon" />,
    'Bread': <GiBreadSlice className="category-icon" />,
    'Meat': <GiMeat className="category-icon" />,
    'Seafood': <GiFishCooked className="category-icon" />,
  };

  // Get unique categories from menu data
  const getCategories = () => {
    if (!menuData) return [];
    
    const categories = new Set();
    Object.entries(menuData).forEach(([category, items]) => {
      categories.add(category);
    });
    return Array.from(categories);
  };

  const categories = getCategories();

  // Handle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Handle price range change
  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: parseFloat(value) || 0
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 50 });
    setSortBy('name');
  };

  // Debounced filter change
  const debouncedFilterChange = useCallback(
    (() => {
      let timeoutId;
      return (filters) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onFilterChange(filters);
        }, 300); // 300ms debounce
      };
    })(),
    [onFilterChange]
  );

  // Apply filters and notify parent
  useEffect(() => {
    const filters = {
      searchTerm,
      selectedCategories,
      priceRange,
      sortBy
    };
    debouncedFilterChange(filters);
  }, [searchTerm, selectedCategories, priceRange, sortBy, debouncedFilterChange]);

  return (
    <div className="menu-search-filter">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search-btn"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
        >
          {showFilters ? <FaFunnel /> : <FaFilter />}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="filters-panel">
          {/* Category Filters */}
          <div className="filter-section">
            <h4 className="filter-title">
              <MdRestaurantMenu className="filter-icon" />
              Categories
            </h4>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`category-filter-btn ${selectedCategories.includes(category) ? 'active' : ''}`}
                >
                  {categoryIcons[category] || <FaUtensils className="category-icon" />}
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4 className="filter-title">
              <FaUtensils className="filter-icon" />
              Price Range
            </h4>
            <div className="price-range-container">
              <div className="price-input-group">
                <label>Min: $</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="price-input"
                />
              </div>
              <div className="price-input-group">
                <label>Max: $</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="price-input"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="filter-section">
            <h4 className="filter-title">
              <FaFilter className="filter-icon" />
              Sort By
            </h4>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-filters-btn">
              <FaTimes />
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(searchTerm || selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 50) && (
        <div className="active-filters">
          <span className="active-filters-label">Active Filters:</span>
          {searchTerm && (
            <span className="active-filter-tag">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="remove-filter-btn">
                <FaTimes />
              </button>
            </span>
          )}
          {selectedCategories.map(category => (
            <span key={category} className="active-filter-tag">
              {category}
              <button onClick={() => toggleCategory(category)} className="remove-filter-btn">
                <FaTimes />
              </button>
            </span>
          ))}
          {(priceRange.min > 0 || priceRange.max < 50) && (
            <span className="active-filter-tag">
              ${priceRange.min} - ${priceRange.max}
              <button onClick={() => setPriceRange({ min: 0, max: 50 })} className="remove-filter-btn">
                <FaTimes />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuSearchFilter; 