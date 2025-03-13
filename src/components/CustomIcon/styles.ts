import styled from 'styled-components';

import type { IStyledSVG, IStyledSVGContainer } from './types';

export const StyledSVGContainer = styled.div<IStyledSVGContainer>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: ${({ theme, padding }) => {
    const themePadding = theme.size[padding as keyof typeof theme.size];

    if (themePadding) return themePadding;

    return padding;
  }};

  border-radius: 50%;

  ${({ theme, backgroundColor }) => {
    const themeColor =
      theme.background[backgroundColor as keyof typeof theme.background] ||
      theme.color[backgroundColor as keyof typeof theme.color];

    if (themeColor) return `background-color: ${themeColor};`;

    return backgroundColor && `background-color: ${backgroundColor};`;
  }}
`;

export const StyledSVG = styled.svg<IStyledSVG>`
  width: ${({ size, width }) => size || width};
  height: ${({ size, height }) => size || height};

  svg {
    width: ${({ size, width }) => size || width};
    height: ${({ size, height }) => size || height};
  }

  path {
    stroke: ${({ theme, strokeColor }) => {
      const themeColor =
        theme.background[strokeColor as keyof typeof theme.background] ||
        theme.color[strokeColor as keyof typeof theme.color];

      if (themeColor) return themeColor;

      return strokeColor;
    }};

    ${({ strokeWidth }) => strokeWidth && `stroke-width: ${strokeWidth};`}

    fill: ${({ theme, fillColor }) => {
      const themeColor =
        theme.background[fillColor as keyof typeof theme.background] ||
        theme.color[fillColor as keyof typeof theme.color];

      if (themeColor) return themeColor;

      return fillColor;
    }};
  }

  circle {
    stroke: ${({ theme, strokeColor }) => {
      const themeColor =
        theme.background[strokeColor as keyof typeof theme.background] ||
        theme.color[strokeColor as keyof typeof theme.color];

      if (themeColor) return themeColor;

      return strokeColor;
    }};

    ${({ strokeWidth }) => strokeWidth && `stroke-width: ${strokeWidth};`}

    fill: ${({ theme, fillColor }) => {
      const themeColor =
        theme.background[fillColor as keyof typeof theme.background] ||
        theme.color[fillColor as keyof typeof theme.color];

      if (themeColor) return themeColor;

      return fillColor;
    }};
  }
`;
