import React from 'react';
import ReservationForm from '../components/ReservationForm';
import '../styles/Reservations.css';

const Reservations = () => (
  <div className="reservations-container">
    <h2 className="page-title">Reserve a Table</h2>
    <ReservationForm />
  </div>
);

export default Reservations; 