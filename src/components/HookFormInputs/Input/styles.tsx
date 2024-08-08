import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

export const InputContainer = styled.div<{
  $labelColor: string;
  $error: boolean;
  $removeStyles: boolean;
}>`
  display: flex;
  flex-direction: column;
  > h6 {
    color: ${({ $labelColor }) => $labelColor};
    margin-bottom: ${theme.size.xxsm};
  }
  width: 100%;

  ${({ $removeStyles }) =>
    $removeStyles &&
    css`
      input {
        border: 0;
        border-radius: 0;
        outline: 0;
        border-radius: 0;
        background-color: transparent;

        :placeholder-shown {
          border: 0;
        }
      }
    `}

  ${({ $error }) =>
    $error &&
    `
   input {
    border-color: ${theme.color.danger} !important;
    color: ${theme.color.danger} !important;
    margin-bottom: 2px !important;
    }
 `}
`;

export const ErrorMessage = styled.div<{ $errorColor: string }>`
  display: flex;

  > p {
    color: ${({ $errorColor }) => $errorColor} !important;
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

export const PasswordDiv = styled.div`
  position: relative;
  display: flex;

  > :nth-child(2) {
    position: absolute;
    top: 6px;
    right: 16px;
    width: fit-content;
  }
`;
