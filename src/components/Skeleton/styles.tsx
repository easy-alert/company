import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { ISkeleton } from './types';

export const Container = styled.div<ISkeleton>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: ${theme.size.xxsm};
  background: linear-gradient(-90deg, #e5e4e2 0%, #d5d5d5 50%, #e5e4e2 100%);
  background-size: 400% 400%;
  animation: pulse 1.2s ease-in-out infinite;
  @keyframes pulse {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: -135% 0%;
    }
  }
`;
