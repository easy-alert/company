import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

export const RootContainer = styled.div`
  width: 100%;
  position: relative;

  > h6 {
    margin-bottom: ${theme.size.xxsm};
  }
`;

export const RootInputContainer = styled.div<{
  error: boolean;
  removeStyles?: boolean;
}>`
  position: relative;
  z-index: 11;

  display: grid;
  place-items: center;

  > input {
    cursor: pointer;
    padding-right: 40px;
    input.middle:focus {
      outline-width: 0;
    }

    ${({ removeStyles }) =>
      removeStyles &&
      css`
        border: 0;
        outline: 0;
        border-radius: 0;

        :placeholder-shown {
          border: 0;
        }
      `}

    ${({ error }) =>
      error &&
      css`
        border-color: ${theme.color.danger} !important;
        color: ${theme.color.danger};
      `}
  }
`;

export const RootResetValueContainer = styled.div`
  position: absolute;
  right: 17px;
  bottom: 5px;
`;

export const RootDownArrowContainer = styled.div`
  position: absolute;
  right: 20px;
  bottom: 8px;
`;

export const RootErrorMessage = styled.div`
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

// #region OPTIONS

export const OptionsContainer = styled.div`
  position: absolute;
  width: 100%;
  margin-top: ${theme.size.xxsm};
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  background-color: ${theme.color.white};
  border: 1px solid ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  overflow: hidden;
  max-height: 200px;
  overflow-y: auto;

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  Track ::-webkit-scrollbar-track {
    background: ${theme.color.gray1};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${theme.color.primaryL};
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.color.primaryL};
  }
  z-index: 1200;
`;

export const OptionRowContainer = styled.div<{
  focused: boolean;
  disabled?: boolean;
}>`
  cursor: pointer;
  ${({ focused }) => focused && `background-color: ${theme.color.primaryL}80;`}

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.7;
    `}
`;

export const OptionRow = styled.div<{
  disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  padding: ${theme.size.xsm} ${theme.size.sm};

  .p3 {
    color: ${theme.color.gray4};
  }

  ${({ disabled }) => disabled && `cursor: not-allowed;`}
`;

export const EmptyOptionsContainer = styled.div`
  display: grid;
  place-items: center;
  padding: 12px ${theme.size.sm};
  color: ${theme.color.gray4};

  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
`;

// #endregion
