import React, { useState } from 'react';
import { reservationService } from '../services/index.js';
import { validateReservationData, showSuccess, showError, getDefaultReservationDate } from '../services/utils.js';
import Card from './Card';
import styled from 'styled-components';
import { FiCalendar, FiUsers, FiUser, FiMail, FiPhone } from 'react-icons/fi';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  
  @media (max-width: 600px) {
    gap: 0.5rem;
  }
`;
const FormRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: #fff;
  border: 2px solid #e1e5e9;
  border-radius: 0.75rem;
  margin-bottom: 0.3rem;
  transition: all 0.3s ease;
  padding: 0.25rem;
  
  &:focus-within {
    border-color: #0078ff;
    box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #0078ff;
    box-shadow: 0 2px 8px rgba(0, 120, 255, 0.1);
  }
`;
const Icon = styled.span`
  color: #0078ff;
  font-size: 1.4rem;
  margin-right: 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  @media (max-width: 600px) {
    font-size: 1.2rem;
    margin-right: 0.8rem;
    width: 20px;
    height: 20px;
  }
`;
const Input = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  padding: 0.75rem 0.5rem;
  width: 100%;
  transition: all 0.3s ease;
  font-weight: 400;
  
  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
  
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 0.6rem 0.4rem;
  }
`;
const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #374151;
  font-size: 0.95rem;
  display: block;
`;
const Button = styled.button`
  background: linear-gradient(90deg, #00ffc8 0%, #0078ff 100%);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  box-shadow: 0 4px 16px rgba(0, 120, 255, 0.2);
  
  &:hover {
    background: linear-gradient(90deg, #0078ff 0%, #00ffc8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 120, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;
const Message = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  text-align: center;
  
  color: ${({ error }) => (error ? '#dc2626' : '#059669')};
  background: ${({ error }) => (error ? '#fef2f2' : '#f0fdf4')};
  border: 1px solid ${({ error }) => (error ? '#fecaca' : '#bbf7d0')};
`;

const ReservationForm = () => {
  const [form, setForm] = useState({
    time_slot: getDefaultReservationDate(),
    number_of_guests: 2,
    customer_name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const validation = validateReservationData(form);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(false);
    
    const validation = validateReservationData(form);
    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).join(', ');
      setMessage(errorMessages);
      setError(true);
      return;
    }
    
    setLoading(true);
    try {
      const result = await reservationService.createReservation(form);
      showSuccess('Reservation created successfully!');
      setMessage(result.message || 'Reservation successful!');
      setError(false);
      setForm({ 
        time_slot: getDefaultReservationDate(), 
        number_of_guests: 2, 
        customer_name: '', 
        email: '', 
        phone: '' 
      });
    } catch (err) {
      showError(err.message);
      setMessage(err.message || 'Reservation failed. Try another slot.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card as="section">
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="time_slot">Time Slot*</Label>
        <FormRow>
          <InputWrapper>
            <Icon><FiCalendar /></Icon>
            <Input
              type="datetime-local"
              id="time_slot"
              name="time_slot"
              value={form.time_slot}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormRow>
        <Label htmlFor="number_of_guests">Number of Guests*</Label>
        <FormRow>
          <InputWrapper>
            <Icon><FiUsers /></Icon>
            <Input
              type="number"
              id="number_of_guests"
              name="number_of_guests"
              min="1"
              max="20"
              value={form.number_of_guests}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormRow>
        <Label htmlFor="customer_name">Name*</Label>
        <FormRow>
          <InputWrapper>
            <Icon><FiUser /></Icon>
            <Input
              type="text"
              id="customer_name"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormRow>
        <Label htmlFor="email">Email*</Label>
        <FormRow>
          <InputWrapper>
            <Icon><FiMail /></Icon>
            <Input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </InputWrapper>
        </FormRow>
        <Label htmlFor="phone">Phone</Label>
        <FormRow>
          <InputWrapper>
            <Icon><FiPhone /></Icon>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </InputWrapper>
        </FormRow>
        <FormRow>
          <Button type="submit" disabled={loading}>{loading ? 'Booking...' : 'Book Reservation'}</Button>
        </FormRow>
        {message && <Message error={error}>{message}</Message>}
      </Form>
    </Card>
  );
};

export default ReservationForm; 