import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const TagContainer = styled.div<{
  backgroundColor: string;
  color: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  padding: string;
  maxWidth: string;
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ backgroundColor }) => {
    const colorValue = theme.color[backgroundColor as keyof typeof theme.color];
    return colorValue || backgroundColor;
  }};
  padding: ${({ padding }) => padding};
  width: fit-content;
  height: fit-content;
  border-radius: ${theme.size.xxsm};

  > button {
    padding: 0;
    background-color: unset;
    display: flex;
    align-items: center;
    justify-content: center;

    :hover {
      opacity: 0.7;
    }
  }

  > p {
    color: ${({ color }) => {
      const colorValue = theme.color[color as keyof typeof theme.color];
      return colorValue || color;
    }};
    font-weight: ${({ fontWeight }) => fontWeight};
    font-size: ${({ fontSize }) => fontSize};
    line-height: ${({ lineHeight }) => lineHeight};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: ${({ maxWidth }) => maxWidth};

    text-align: center;
  }
`;
