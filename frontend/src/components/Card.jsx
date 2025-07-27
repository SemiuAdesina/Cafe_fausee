import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTheme } from '../App';

const glowAnim = keyframes`
  0% {
    box-shadow: 0 0 16px 4px rgba(0, 255, 200, 0.4), 0 0 32px 8px rgba(0, 120, 255, 0.2);
    border-color: #00ffc8;
  }
  50% {
    box-shadow: 0 0 32px 8px rgba(255, 179, 71, 0.5), 0 0 64px 16px rgba(0, 120, 255, 0.3);
    border-color: #ffb347;
  }
  100% {
    box-shadow: 0 0 16px 4px rgba(0, 255, 200, 0.4), 0 0 32px 8px rgba(0, 120, 255, 0.2);
    border-color: #00ffc8;
  }
`;

const CardWrapper = styled.div`
  background: ${({ $dark }) => ($dark ? '#111' : '#fff')};
  color: ${({ $dark }) => ($dark ? '#fff' : '#222')};
  border-radius: 1.2rem;
  padding: 2rem;
  margin: 1rem 0;
  position: relative;
  transition: background 0.5s cubic-bezier(0.4,0,0,0.2,1), color 0.5s cubic-bezier(0.4,0,0,0.2,1),
    box-shadow 0.5s cubic-bezier(0.4,0,0,0.2,1), border-color 0.5s cubic-bezier(0.4,0,0,0.2,1);
  border: 2.5px solid transparent;
  background-clip: padding-box, border-box;
  animation: ${glowAnim} 3s ease-in-out infinite;
  border-image: ${({ $dark }) =>
    $dark
      ? 'linear-gradient(135deg, #00ffc8 0%, #0078ff 50%, #ffb347 100%) 1'
      : 'linear-gradient(135deg, #00ffc8 0%, #ffb347 50%, #0078ff 100%) 1'};
`;

const Card = ({ children, dark, ...props }) => {
  const theme = useTheme();
  const isDark = dark !== undefined ? dark : theme?.dark;
  return <CardWrapper $dark={isDark} {...props}>{children}</CardWrapper>;
};

export default Card; 