import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  .opacity {
    opacity: 0.7;
  }
`;

export const ButtonContainer = styled.div`
  margin: ${theme.size.xsm} 0;
`;
