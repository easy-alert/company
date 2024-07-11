import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { icon } from '../../../assets/icons';

export const InputContainer = styled.div<{
  typeDatePlaceholderValue?: string;
  type?: string;
  selectPlaceholderValue: any;
}>`
  display: flex;
  flex-direction: column;
  > h6 {
    margin-bottom: ${theme.size.xxsm};
  }
  width: 100%;

  position: relative;

  ${({ typeDatePlaceholderValue, type }) =>
    type === 'date' &&
    typeDatePlaceholderValue === '' &&
    `
      > input {
        border-color: ${theme.color.gray3};
        color: #757575
      }
      `}

  ${({ selectPlaceholderValue }) =>
    selectPlaceholderValue === 'Selecione' || !selectPlaceholderValue
      ? `
      > select {
        border-color: ${theme.color.gray3};
        color: #757575
      }
      `
      : `
      > select {
          border-color: ${theme.color.gray4};
      }`}
`;

export const ErrorMessage = styled.div`
  display: flex;
  color: ${theme.color.danger};

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

export const IconContainer = styled.div`
  position: absolute;
  right: 16px;
  bottom: 8px;
  z-index: 1;
`;

export const IconArrow = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;

  right: 17px;
  bottom: 8px;

  background-size: 16px;
  background-image: url(${icon.downArrow});
  background-repeat: no-repeat, repeat;
`;
