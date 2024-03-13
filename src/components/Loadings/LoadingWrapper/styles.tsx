import styled from 'styled-components';

export const LoadingWrapperDiv = styled.div<{ minHeight: string }>`
  display: grid;
  place-items: center;
  min-height: ${({ minHeight }) => minHeight};
`;
