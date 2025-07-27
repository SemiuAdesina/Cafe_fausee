import React, { useState } from 'react';
import { newsletterService } from '../services/index.js';
import { validateEmail, showSuccess, showError } from '../services/utils.js';
import Card from './Card';
import styled from 'styled-components';
import { FiMail } from 'react-icons/fi';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
`;
const InputGroup = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
`;
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const Icon = styled(FiMail)`
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #0078ff;
  font-size: 1.1rem;
  pointer-events: none;
  @media (max-width: 600px) {
    left: 1.2rem;
    font-size: 1rem;
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem 0.7rem 4rem !important;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
  @media (max-width: 600px) {
    padding-left: 5rem !important;
    font-size: 0.95rem;
  }
`;
const Button = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #00ffc8 0%, #0078ff 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
  &:hover {
    background: linear-gradient(90deg, #0078ff 0%, #00ffc8 100%);
  }
`;
const Message = styled.div`
  margin-top: 1rem;
  color: ${({ error }) => (error ? '#ff4d4f' : '#00c896')};
  font-weight: 600;
`;

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const validate = () => validateEmail(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(false);
    if (!validate()) {
      setMessage('Please enter a valid email address.');
      setError(true);
      return;
    }
    setLoading(true);
    try {
      const result = await newsletterService.signupNewsletter(email);
      showSuccess('Newsletter subscription successful!');
      setMessage(result.message || 'Subscribed successfully!');
      setError(false);
      setEmail('');
    } catch (err) {
      showError(err.message);
      setMessage(err.message || 'Subscription failed.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card as="section">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <InputWrapper>
            <Icon />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </InputWrapper>
          <Button type="submit" disabled={loading}>{loading ? 'Subscribing...' : 'Subscribe'}</Button>
        </InputGroup>
        {message && <Message error={error}>{message}</Message>}
      </Form>
    </Card>
  );
};

export default NewsletterForm; 