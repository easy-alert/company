import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

export const RadioWrapper = styled.label<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.size.xxsm};
  width: fit-content;
  transition: 0.25s;

  > input {
    width: 16px;
    height: 16px;
  }

  font-size: 14px;
  line-height: 16px;
  color: ${theme.color.gray4};
  font-weight: 400;

  ${({ $disabled }) =>
    !$disabled &&
    css`
      cursor: pointer;

      cursor: pointer;
      color: ${theme.color.gray6};

      :hover {
        opacity: 0.7;
      }
    `}
`;

export const InputContainer = styled.div<{
  $labelColor: string;
  $error: boolean;
  $passwordPlaceholder?: boolean;
  $marginTop: string;
}>`
  > p {
    color: ${({ $labelColor }) => $labelColor};
    margin-bottom: ${theme.size.xxsm};
  }

  margin-top: ${({ $marginTop }) => $marginTop};

  ${({ $error }) =>
    $error &&
    `
   > input {
    border-color: ${theme.color.danger} !important;
    color: ${theme.color.danger};
    margin-bottom: 2px;
    }
 `};
`;

export const ErrorMessage = styled.div<{ $errorColor: string }>`
  display: flex;
  color: ${({ $errorColor }) => $errorColor};
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
