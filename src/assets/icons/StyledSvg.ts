import styled from 'styled-components';

export interface IStyledSVG {
  width?: string;
  height?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: string;
}

export const StyledSVG = styled.svg<IStyledSVG>`
  width: ${({ width }) => width || '16px'};
  height: ${({ height }) => height || '16px'};

  ${({ theme, fillColor }) => {
    const themeColor =
      theme.background[fillColor as keyof typeof theme.background] ||
      theme.color[fillColor as keyof typeof theme.color];

    if (themeColor) return `fill: ${themeColor};`;

    return fillColor && `fill: ${fillColor};`;
  }}

  path {
    ${({ theme, strokeColor }) => {
      const themeColor =
        theme.background[strokeColor as keyof typeof theme.background] ||
        theme.color[strokeColor as keyof typeof theme.color];

      if (themeColor) return `stroke: ${themeColor};`;

      return strokeColor && `stroke: ${strokeColor};`;
    }}

    ${({ strokeWidth }) => strokeWidth && `stroke-width: ${strokeWidth};`}
    fill: none;
  }
`;
