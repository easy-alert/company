import styled, { css } from 'styled-components';

export const ContainerButton = styled.div<{
  labelPos?: string;
  selected?: boolean;
  opacity?: string;
  gap?: string;
  color?: string;
  hideLabelOnMedia?: boolean;
  fontWeight?: string;
  disable?: boolean;
  hasCircle?: boolean;
  fill?: string;
  size?: string;
  stroke?: string;
}>`
  display: flex;
  min-width: fit-content;
  align-items: center;
  cursor: pointer;
  transition: 0.25s cubic-bezier(0.39, 0.575, 0.565, 1);

  img {
    ${({ theme, hasCircle }) =>
      hasCircle &&
      `
      background-color: ${theme.color.primary};
      border-radius: 50%;
      color: ${theme.color.primary};
    `}
  }

  svg {
    ${({ fill, theme }) => {
      const themeColor =
        theme.background[fill as keyof typeof theme.background] ||
        theme.color[fill as keyof typeof theme.color];

      if (themeColor) return `fill: ${themeColor};`;

      return fill && `fill: ${fill};`;
    }}
    ${({ size }) => size && `width: ${size};`}
    ${({ size }) => size && `height: ${size};`}

    path {
      fill: none;
      ${({ stroke, theme }) => {
        const themeColor =
          theme.background[stroke as keyof typeof theme.background] ||
          theme.color[stroke as keyof typeof theme.color];

        if (themeColor) return `stroke: ${themeColor};`;

        return stroke && `stroke: ${stroke};`;
      }}
    }
  }

  > p {
    ${({ color }) => color && `color: ${color};`}
    ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight};`}


    @media (max-width: 900px) {
      ${({ hideLabelOnMedia }) => hideLabelOnMedia && `display: none;`}
    }
  }

  ${({ gap }) => gap && `gap: ${gap};`}

  ${({ disable }) =>
    disable &&
    css`
      opacity: 0.4 !important;
      :hover {
        opacity: 0.4 !important;
      }
      cursor: not-allowed;
    `}
  ${({ opacity }) =>
    opacity ? `opacity:${opacity}; :hover { opacity: 1; };` : ':hover { opacity: 0.7; };'}
  ${({ selected }) => selected && ' opacity: 1;'}
  ${({ labelPos }) => labelPos === 'top' && 'flex-direction:column-reverse;'}
  ${({ labelPos }) => labelPos === 'right' && 'flex-direction: row;'}
  ${({ labelPos }) => labelPos === 'left' && 'flex-direction: row-reverse;'}
  ${({ labelPos }) => labelPos === 'bottom' && 'flex-direction: column;'}
`;

export const SpinnerContent = styled.div<{ $size: string }>`
  display: none;
  align-items: center;
  justify-content: center;
  border: 4px solid ${({ theme }) => theme.color.dangerL};
  border-top: 4px solid ${({ theme }) => theme.color.primary};
  border-radius: 50%;

  ${({ $size }) =>
    $size &&
    css`
      width: ${$size};
      height: ${$size};
    `}

  animation: spin 0.75s linear infinite;
  display: flex;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
