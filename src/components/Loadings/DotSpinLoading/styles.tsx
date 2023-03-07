import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 11px;

  .dot-spin {
    border: 6px solid ${theme.color.primaryL};
    border-top: 6px solid ${theme.color.primary};
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 0.5s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  opacity: 0.7;
  position: relative;

  > h4 {
    position: absolute;
    top: -28px;
    white-space: nowrap;
  }
`;
