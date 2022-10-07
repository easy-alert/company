import styled from 'styled-components';
import { theme } from '../../../../../../../../styles/theme';

export const FormContainer = styled.div`
  button {
    margin-top: ${theme.size.xsm};
  }
`;

export const SelectWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${theme.size.xsm};
`;
