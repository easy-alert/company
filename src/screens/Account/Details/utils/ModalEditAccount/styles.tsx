import styled from 'styled-components';
import { theme } from '../../../../../styles/theme';

export const FormContainer = styled.div`
  button {
    margin-top: ${theme.size.xsm};
  }
`;

export const PasswordDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  > :nth-child(2) {
    position: absolute;
    top: 26px;
    right: 16px;
  }
`;
