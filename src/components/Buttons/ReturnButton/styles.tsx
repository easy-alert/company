import styled from 'styled-components';
import { theme as defaultTheme } from '@styles/theme';

export const Background = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xxsm};
  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }
  > h6 {
    color: ${({ theme }) => theme.color.gray4};
  }
`;
