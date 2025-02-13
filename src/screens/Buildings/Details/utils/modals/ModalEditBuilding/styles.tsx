import styled from 'styled-components';
import { theme } from '@styles/theme';

export const FormContainer = styled.div`
  input[type='checkbox'] {
    width: 16px;
    height: 16px;
  }
`;

export const ButtonContainer = styled.div`
  margin-top: ${theme.size.xsm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};
`;
