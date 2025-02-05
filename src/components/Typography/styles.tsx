import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

import { theme } from '@styles/theme';

export interface IStyledTypography {
  color?: keyof typeof theme.color;
  fontSize?: keyof typeof theme.size;

  marginTop?: keyof typeof theme.size;
  marginBottom?: keyof typeof theme.size;
  marginLeft?: keyof typeof theme.size;
  marginRight?: keyof typeof theme.size;
  // Add more props as needed
}

const baseStyles = css<IStyledTypography>`
  margin: 0;
  padding: 0;

  color: ${({ color }) => theme.color[color as keyof typeof theme.color] || color};
  font-size: ${({ fontSize }) => theme.size[fontSize as keyof typeof theme.size] || fontSize};

  margin-top: ${({ marginTop }) => theme.size[marginTop as keyof typeof theme.size] || marginTop};
  margin-bottom: ${({ marginBottom }) =>
    theme.size[marginBottom as keyof typeof theme.size] || marginBottom};
  margin-left: ${({ marginLeft }) =>
    theme.size[marginLeft as keyof typeof theme.size] || marginLeft};
  margin-right: ${({ marginRight }) =>
    theme.size[marginRight as keyof typeof theme.size] || marginRight};
  // Add more default styles if needed
`;

const createStyledComponent = (
  tag: keyof JSX.IntrinsicElements,
  additionalStyles?: FlattenSimpleInterpolation,
) => styled(tag)<IStyledTypography>`
  ${baseStyles}
  ${additionalStyles}
`;

export const StyledTypography = {
  h1: createStyledComponent(
    'h1',
    css`
      line-height: 1.5;
      // Add more specific styles for h1
    `,
  ),
  h2: createStyledComponent(
    'h2',
    css`
      line-height: 1.4;
      // Add more specific styles for h2
    `,
  ),
  h3: createStyledComponent(
    'h3',
    css`
      line-height: 1.3;
      // Add more specific styles for h3
    `,
  ),
  h4: createStyledComponent(
    'h4',
    css`
      line-height: 1.2;
      // Add more specific styles for h4
    `,
  ),
  h5: createStyledComponent(
    'h5',
    css`
      line-height: 1.1;
      // Add more specific styles for h5
    `,
  ),
  h6: createStyledComponent(
    'h6',
    css`
      line-height: 1;
      // Add more specific styles for h6
    `,
  ),
  p: createStyledComponent(
    'p',
    css`
      line-height: 1.8;
      // Add more specific styles for p
    `,
  ),
  span: createStyledComponent(
    'span',
    css`
      line-height: 1.6;
      // Add more specific styles for span
    `,
  ),
};
