import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div<{ height: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${theme.size.xsm};
  height: ${({ height }) => height};
  color: ${theme.color.gray4};

  > h5 {
    font-weight: 400;
    text-align: center;
  }
`;
