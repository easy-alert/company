import styled from 'styled-components';

export const Background = styled.div<{ center: boolean }>`
  width: fit-content;
  ${({ center }) => center && `width: 100%; display: flex; justify-content: center;`}
  height: fit-content;
`;

export const SpinnerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${({ theme }) => theme.color.white};
  border-top: 3px solid ${({ theme }) => theme.color.primaryL};
  width: ${({ theme }) => theme.size.sm};
  height: ${({ theme }) => theme.size.sm};
  border-radius: 50%;
  animation: spin 0.75s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ContainerButton = styled.div<{
  disable: boolean;
  loading: number;
  outlined: boolean;
  bgColor: string;
  borderless: boolean;
  textColor?: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.size.xsm};
    border-radius: ${({ loading }) => (loading ? '50%' : '4px')};
    width: ${({ loading, theme }) => (loading ? theme.size.lg : 'auto')};
    height: ${({ loading, theme }) => (loading ? theme.size.lg : 'auto')};
    padding: ${({ loading }) => (loading ? '0' : '8px 16px')};

    :hover {
      opacity: 0.7;
      ${({ outlined, bgColor, theme }) => {
        const themeColor =
          theme.background[bgColor as keyof typeof theme.background] ||
          theme.color[bgColor as keyof typeof theme.color];

        if (outlined && themeColor) return `background-color: ${`${themeColor}26`};`;

        return outlined && `background-color: ${`${bgColor}26`};`;
      }}
    }

    ${({ bgColor, theme }) => {
      const themeColor =
        theme.background[bgColor as keyof typeof theme.background] ||
        theme.color[bgColor as keyof typeof theme.color];

      if (themeColor) return `background-color: ${themeColor};`;

      return bgColor && `background-color: ${bgColor};`;
    }}

    ${({ textColor, theme }) => {
      const themeColor =
        theme.color[textColor as keyof typeof theme.color] ||
        theme.background[textColor as keyof typeof theme.background];

      if (themeColor) return `color: ${themeColor} !important;`;

      return textColor && `color: ${textColor} !important;`;
    }}

    ${({ outlined, bgColor, theme }) => {
      const themeColor =
        theme.color[bgColor as keyof typeof theme.color] ||
        theme.background[bgColor as keyof typeof theme.background];

      if (outlined && themeColor)
        return `outline: 2px solid ${themeColor}; outline-offset: -2px;  background-color: transparent; color:${themeColor};`;

      return `color: ${theme.color.white};`;
    }}

    ${({ disable }) => disable && 'opacity: 0.4; :hover {opacity: 0.4;} cursor: not-allowed; '}

    ${({ borderless, theme }) =>
      borderless &&
      `
      background-color: transparent;
      border: none;
      outline: none;
      color: ${theme.color.danger};
      padding: 0;
    `}

    ${({ loading, theme }) =>
      loading &&
      `
      border-radius: 50%;
      padding: ${theme.size.xsm};
      opacity: 1;
      pointer-events: none;
      width: ${theme.size.lg};
      height: ${theme.size.lg};
      display: flex;
      align-items: center;
      justify-content: center;
    `}
  }
`;
