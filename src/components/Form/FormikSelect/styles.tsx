import styled from 'styled-components';

export const SelectContainer = styled.div<{
  error: boolean;
  selectPlaceholderValue: string;
  arrowColor?: string;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;

  > h6 {
    margin-bottom: ${({ theme }) => theme.size.xxsm};
  }

  > select {
    line-height: 17px;
    cursor: pointer;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    font-size: 14px;
    outline: none;
    width: 100%;
    background-color: ${({ theme }) => theme.color.white};
    border-radius: ${({ theme }) => theme.size.xxsm};
    padding: 0 ${({ theme }) => theme.size.sm};

    background-image: ${({ arrowColor = 'black', theme }) => {
      const color = theme.color[arrowColor as keyof typeof theme.color] || arrowColor;
      return `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
          <polyline points='6 9 12 15 18 9'/>
        </svg>`,
      )}")`;
    }};
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
  }

  ${({ selectPlaceholderValue, theme }) =>
    selectPlaceholderValue === 'Selecione' || selectPlaceholderValue === ''
      ? `
      > select {
        border-color: ${theme.color.gray3};
        color: #757575;
      }
      `
      : `
      > select {
          border-color: ${theme.color.gray4};
      }`}

  ${({ error, theme }) =>
    error &&
    `
   > select {
    border-color: ${theme.color.danger} !important;
    color: ${theme.color.danger};
    margin-bottom: 2px;
  }
 `}
`;

export const ErrorMessage = styled.div`
  display: flex;
  color: ${({ theme }) => theme.color.danger};
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
