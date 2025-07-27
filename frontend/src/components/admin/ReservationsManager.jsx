import React, { useState, useEffect } from 'react';
import { reservationService, emailService } from '../../services/index.js';
import { showSuccess, showError, showWarning, formatDateTime } from '../../services/utils.js';
import Card from '../Card';
import SearchFilter from '../SearchFilter';
import Pagination from '../Pagination';
import { FiEdit, FiTrash2, FiDownload, FiRefreshCw, FiMail, FiEye } from 'react-icons/fi';
import '../../styles/Admin.css';



const ReservationsManager = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      setReservations(data.reservations || []);
      setFilteredReservations(data.reservations || []);
    } catch (error) {
      showError('Failed to load reservations: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search reservations
  useEffect(() => {
    let filtered = [...reservations];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(reservation =>
        reservation.customer_name?.toLowerCase().includes(term) ||
        reservation.email?.toLowerCase().includes(term) ||
        reservation.phone?.toLowerCase().includes(term) ||
        reservation.id?.toString().includes(term)
      );
    }

    // Apply filters
    if (filters.date) {
      filtered = filtered.filter(reservation => {
        const reservationDate = new Date(reservation.time_slot).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        return reservationDate === filterDate;
      });
    }

    if (filters.guests) {
      filtered = filtered.filter(reservation =>
        reservation.number_of_guests === parseInt(filters.guests)
      );
    }

    setFilteredReservations(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [reservations, searchTerm, filters]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (reservation) => {
    const details = `
Reservation Details:
ID: ${reservation.id}
Customer: ${reservation.customer_name}
Email: ${reservation.email}
Phone: ${reservation.phone || 'Not provided'}
Date & Time: ${formatDateTime(reservation.time_slot)}
Number of Guests: ${reservation.number_of_guests}
Table Number: ${reservation.table_number}
    `;
    alert(details);
  };

  const handleSendEmail = async (reservation) => {
    try {
      await emailService.sendReservationConfirmation(reservation);
      showSuccess('Email sent successfully!');
    } catch (error) {
      showError('Failed to send email: ' + error.message);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await reservationService.exportReservationsCSV();
      showSuccess('Reservations exported successfully!');
    } catch (error) {
      showError('Export failed: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) {
      return;
    }

    try {
      await reservationService.deleteReservation(id);
      showSuccess('Reservation deleted successfully!');
      loadReservations(); // Reload the list
    } catch (error) {
      showError('Delete failed: ' + error.message);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  if (loading) {
    return (
      <div className="admin-manager-container">
        <div className="admin-loading-message">
          <FiRefreshCw className="admin-spin" />
          Loading reservations...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manager-container">
      <div className="admin-manager-header">
        <h2 className="admin-manager-title">Reservations Management</h2>
        <div className="admin-button-group">
          <button className="admin-btn" onClick={loadReservations}>
            <FiRefreshCw />
            Refresh
          </button>
          <button className="admin-btn" onClick={handleExport} disabled={exporting}>
            <FiDownload />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          placeholder="Search reservations by name, email, phone, or ID..."
          filters={[
            {
              key: 'date',
              label: 'Date',
              type: 'date'
            },
            {
              key: 'guests',
              label: 'Number of Guests',
              type: 'select',
              options: [
                { value: 1, label: '1 Guest' },
                { value: 2, label: '2 Guests' },
                { value: 3, label: '3 Guests' },
                { value: 4, label: '4 Guests' },
                { value: 5, label: '5+ Guests' }
              ]
            }
          ]}
        />
      </Card>

      <Card>
        {filteredReservations.length === 0 ? (
          <div className="admin-empty-message">
            {reservations.length === 0 ? 'No reservations found.' : 'No reservations match your search criteria.'}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Table</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.customer_name}</td>
                  <td>{reservation.email}</td>
                  <td>{reservation.phone || '-'}</td>
                  <td>{formatDateTime(reservation.time_slot)}</td>
                  <td>{reservation.number_of_guests}</td>
                  <td>{reservation.table_number}</td>
                  <td>
                    <button
                      className="admin-action-button"
                      onClick={() => handleViewDetails(reservation)}
                      title="View details"
                    >
                      <FiEye />
                    </button>
                    <button
                      className="admin-action-button"
                      onClick={() => handleSendEmail(reservation)}
                      title="Send email"
                    >
                      <FiMail />
                    </button>
                    <button
                      className="admin-action-button danger"
                      onClick={() => handleDelete(reservation.id)}
                      title="Delete reservation"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredReservations.length}
            itemsPerPage={itemsPerPage}
          />
        </Card>
      )}
    </div>
  );
};

export default ReservationsManager; 