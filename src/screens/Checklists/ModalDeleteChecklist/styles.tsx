import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  button {
    margin-top: ${theme.size.xsm};
  }

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.size.sm};
  align-items: center;
  justify-content: center;
`;
