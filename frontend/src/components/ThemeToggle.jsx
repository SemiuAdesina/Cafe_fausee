import React from 'react';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  /* margin-left: 1rem; */
  color: ${({ $dark }) => ($dark ? '#00ffc8' : '#0078ff')};
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px !important;
  height: 44px !important;
  padding: 0 !important;
`;

const ThemeToggle = ({ dark, onToggle }) => (
  <ToggleButton $dark={dark} onClick={onToggle} title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
    {dark ? <FaSun size={40} /> : <FaMoon size={40} />}
  </ToggleButton>
);

export default ThemeToggle; 