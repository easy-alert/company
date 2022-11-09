import styled from 'styled-components';
import { theme } from '../../../../../styles/theme';

export const FormContainer = styled.div`
  button {
    margin-top: ${theme.size.xsm};
  }

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
  }
`;
