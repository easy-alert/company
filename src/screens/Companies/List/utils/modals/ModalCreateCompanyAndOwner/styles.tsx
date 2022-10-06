import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const FormContainer = styled.div`
  button {
    margin-top: ${theme.size.xsm};
  }
`;

export const SwitchWrapper = styled.div`
  width: fit-content;
  height: fit-content;

  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
  margin-bottom: -4px;
`;
