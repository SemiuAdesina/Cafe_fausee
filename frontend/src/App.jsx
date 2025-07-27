import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservations from './pages/Reservations';
import About from './pages/About';
import Gallery from './pages/Gallery';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApiTest from './components/ApiTest';
import CustomerService from './components/CustomerService';
import ToastContainer from './components/ToastContainer';
import ThemeToggle from './components/ThemeToggle';

// Theme context and hook
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

// Component to conditionally render navbar and footer
const AppContent = ({ dark, toggleTheme }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <>
      {!isAdminRoute && (
        <Navbar right={<ThemeToggle dark={dark} onToggle={toggleTheme} />} />
      )}
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/customer-service" element={<CustomerService />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  const [dark, setDark] = useState(false);
  const toggleTheme = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <div className={dark ? 'theme-dark' : ''}>
        <Router>
          <AppContent dark={dark} toggleTheme={toggleTheme} />
        </Router>
        <ToastContainer />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
