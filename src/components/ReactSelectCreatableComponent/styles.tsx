import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const ReactSelectDiv = styled.div<{
  selectPlaceholderValue: any;
}>`
  width: 100%;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  font-style: normal;

  > h6 {
    margin-bottom: 3px;
  }

  .css-4tefbm-control {
    ${({ selectPlaceholderValue }) =>
      selectPlaceholderValue === 'Selecione' || !selectPlaceholderValue
        ? `
        border-color: ${theme.color.gray3};
        color: #757575
      `
        : `
          border-color: ${theme.color.gray4};
      `}
  }
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const IconButton = styled.button`
  margin-top: 2px;
  height: 36px;
  min-width: 36px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.color.gray4};
  background: white;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  color: ${theme.color.danger};
  margin-top: 2px;

  > p {
    animation: scale-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    @keyframes scale-in-left {
      0% {
        transform: scale(0);
        transform-origin: 0% 50%;
        opacity: 1;
      }
      100% {
        transform: scale(1);
        transform-origin: 0% 50%;
        opacity: 1;
      }
    }
  }
`;
