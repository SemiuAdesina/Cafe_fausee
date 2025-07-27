import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import MenuSearchFilter from '../components/MenuSearchFilter';
import { menuService } from '../services/index.js';
import { showError, formatPrice } from '../services/utils.js';
import '../styles/Menu.css';

// Import menu images
import bruschettaImage from '../assets/menu-appetizer-bruschetta.jpg';
import caesarSaladImage from '../assets/menu-salad-caesar.jpg';
import salmonImage from '../assets/menu-main-salmon.jpg';
import ribeyeImage from '../assets/menu-main-ribeye-steak.jpg';
import tiramisuImage from '../assets/menu-dessert-tiramisu.jpg';
import redWineImage from '../assets/menu-drink-red-wine.jpg';
import risottoImage from '../assets/menu-main-risotto.jpg';
import cheesecakeImage from '../assets/menu-dessert-cheesecake.jpg';
import whiteWineImage from '../assets/menu-drink-white-wine.jpg';
import craftBeerImage from '../assets/menu-drink-craft-beer.jpg';
import espressoImage from '../assets/menu-drink-espresso.jpg .png';

// Static menu data as fallback (from SRS requirements)
const staticMenu = {
  Starters: [
    { name: 'Bruschetta', description: 'Fresh tomatoes, basil, olive oil, and toasted baguette slices', price: 8.5, image: bruschettaImage },
    { name: 'Caesar Salad', description: 'Crisp romaine with homemade Caesar dressing', price: 9.0, image: caesarSaladImage },
  ],
  'Main Courses': [
    { name: 'Grilled Salmon', description: 'Served with lemon butter sauce and seasonal vegetables', price: 22.0, image: salmonImage },
    { name: 'Ribeye Steak', description: '12 oz prime cut with garlic mashed potatoes', price: 28.0, image: ribeyeImage },
    { name: 'Vegetable Risotto', description: 'Creamy Arborio rice with wild mushrooms', price: 18.0, image: risottoImage },
  ],
  Desserts: [
    { name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone', price: 7.5, image: tiramisuImage },
    { name: 'Cheesecake', description: 'Creamy cheesecake with berry compote', price: 7.0, image: cheesecakeImage },
  ],
  Beverages: [
    { name: 'Red Wine (Glass)', description: 'A selection of Italian reds', price: 10.0, image: redWineImage },
    { name: 'White Wine (Glass)', description: 'Crisp and refreshing', price: 9.0, image: whiteWineImage },
    { name: 'Craft Beer', description: 'Local artisan brews', price: 6.0, image: craftBeerImage },
    { name: 'Espresso', description: 'Strong and aromatic', price: 3.0, image: espressoImage },
  ],
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(false);
  const [filteredMenu, setFilteredMenu] = useState({});

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        const items = await menuService.getAllMenuItems();
        if (items && items.length > 0) {
          setMenuItems(items);
          setUseBackend(true);
        } else {
          // Use static data if backend returns empty
          setUseBackend(false);
        }
      } catch (err) {
        console.log('Using static menu data:', err.message);
        setUseBackend(false);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  // Use backend data if available, otherwise use static data
  const menuData = useBackend ? menuItems : staticMenu;

  // Group menu items by category
  const groupedMenu = useBackend 
    ? menuItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {})
    : staticMenu;

  // Initialize filtered menu with all items
  useEffect(() => {
    setFilteredMenu(groupedMenu);
  }, [groupedMenu]);

  // Handle filter changes
  const handleFilterChange = useCallback((filters) => {
    const { searchTerm, selectedCategories, priceRange, sortBy } = filters;
    
    let filtered = { ...groupedMenu };

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      Object.keys(filtered).forEach(category => {
        filtered[category] = filtered[category].filter(item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      const categoryFiltered = {};
      selectedCategories.forEach(category => {
        if (filtered[category]) {
          categoryFiltered[category] = filtered[category];
        }
      });
      filtered = categoryFiltered;
    }

    // Filter by price range
    if (priceRange.min > 0 || priceRange.max < 50) {
      Object.keys(filtered).forEach(category => {
        filtered[category] = filtered[category].filter(item =>
          item.price >= priceRange.min && item.price <= priceRange.max
        );
      });
    }

    // Sort items
    Object.keys(filtered).forEach(category => {
      filtered[category].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          default:
            return 0;
        }
      });
    });

    // Remove empty categories
    Object.keys(filtered).forEach(category => {
      if (filtered[category].length === 0) {
        delete filtered[category];
      }
    });

    setFilteredMenu(filtered);
  }, [groupedMenu]);

  if (loading) {
    return (
      <div className="menu-container">
        <h2 className="page-title">Menu</h2>
        <Card>
          <div className="loading-message">Loading menu...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <h2 className="page-title">Menu</h2>
      
      {/* Search and Filter Component */}
      <MenuSearchFilter 
        onFilterChange={handleFilterChange}
        menuData={groupedMenu}
      />

      {/* Menu Items */}
      {Object.entries(filteredMenu).map(([category, items]) => (
        <Card key={category}>
          <section className="menu-section">
            <h3>{category}</h3>
            <ul>
              {items.map((item, index) => (
                <li key={useBackend ? item.id : `${category}-${index}`} className="menu-item">
                  {item.image && (
                    <div className="menu-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                  )}
                  <div className="menu-item-content">
                    <span className="item-name">{item.name}</span>
                    <span className="item-desc">{item.description}</span>
                  </div>
                  <span className="item-price">
                    {useBackend ? formatPrice(item.price) : `$${item.price.toFixed(2)}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Card>
      ))}
      
      {Object.keys(filteredMenu).length === 0 && (
        <Card>
          <div className="empty-message">
            <p>No menu items match your current filters.</p>
            <p>Try adjusting your search criteria or clearing the filters.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Menu; 