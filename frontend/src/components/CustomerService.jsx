import React, { useState } from 'react';
import { reservationService } from '../services/index.js';
import { showSuccess, showError, formatDateTime } from '../services/utils.js';
import Card from './Card';
import { FiSearch, FiCalendar, FiUsers, FiPhone, FiMail, FiX, FiAlertTriangle } from 'react-icons/fi';
import '../styles/CustomerService.css';

const CustomerService = () => {
  const [searchData, setSearchData] = useState({
    email: '',
    reservation_id: ''
  });
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchData.email || !searchData.reservation_id) {
      setError('Please enter both email and reservation ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await reservationService.lookupReservation(
        searchData.email, 
        searchData.reservation_id
      );
      setReservation(result);
    } catch (err) {
      setError(err.message || 'Reservation not found. Please check your details.');
      setReservation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!reservation) return;

    try {
      setLoading(true);
      await reservationService.cancelReservation(
        searchData.email, 
        searchData.reservation_id
      );
      setReservation(null);
      setSearchData({ email: '', reservation_id: '' });
      setShowCancelConfirm(false);
      showSuccess('Reservation cancelled successfully');
    } catch (err) {
      showError(err.message || 'Failed to cancel reservation');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSearchData({ email: '', reservation_id: '' });
    setReservation(null);
    setError('');
    setShowCancelConfirm(false);
  };

  return (
    <div className="customer-service-container">
      <h2 className="page-title">Reservation Lookup</h2>
      
      <Card>
        <div className="lookup-form">
          <h3>Find Your Reservation</h3>
          <p className="form-description">
            Enter your email address and reservation ID to view or cancel your reservation.
          </p>
          
          <form onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FiMail />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={searchData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>
                  <FiCalendar />
                  Reservation ID
                </label>
                <input
                  type="text"
                  name="reservation_id"
                  value={searchData.reservation_id}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your reservation ID"
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                <FiSearch />
                {loading ? 'Searching...' : 'Find Reservation'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={loading}
              >
                <FiX />
                Clear
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <FiAlertTriangle />
              {error}
            </div>
          )}
        </div>
      </Card>

      {/* Reservation Details */}
      {reservation && (
        <Card>
          <div className="reservation-details">
            <div className="reservation-header">
              <h3>Reservation Details</h3>
              <span className="reservation-status confirmed">Confirmed</span>
            </div>
            
            <div className="reservation-info">
              <div className="info-row">
                <div className="info-item">
                  <FiCalendar />
                  <div>
                    <label>Date & Time</label>
                    <span>{formatDateTime(reservation.time_slot)}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiUsers />
                  <div>
                    <label>Number of Guests</label>
                    <span>{reservation.number_of_guests} people</span>
                  </div>
                </div>
              </div>
              
              <div className="info-row">
                <div className="info-item">
                  <FiMail />
                  <div>
                    <label>Email</label>
                    <span>{reservation.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiPhone />
                  <div>
                    <label>Phone</label>
                    <span>{reservation.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-item full-width">
                <div>
                  <label>Customer Name</label>
                  <span>{reservation.customer_name}</span>
                </div>
              </div>
              
              <div className="info-item full-width">
                <div>
                  <label>Table Number</label>
                  <span>Table {reservation.table_number}</span>
                </div>
              </div>
            </div>
            
            <div className="reservation-actions">
              <button 
                className="btn btn-danger"
                onClick={() => setShowCancelConfirm(true)}
                disabled={loading}
              >
                <FiX />
                Cancel Reservation
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Cancel Reservation</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel your reservation?</p>
              <p><strong>This action cannot be undone.</strong></p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-danger"
                onClick={handleCancelReservation}
                disabled={loading}
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel Reservation'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCancelConfirm(false)}
                disabled={loading}
              >
                No, Keep Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerService; 