import styled from 'styled-components';
import { theme } from '../../../../../../../../styles/theme';

export const FormContainer = styled.div`
  button {
    margin-top: ${theme.size.xsm};
  }
`;

export const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.size.xsm};
`;

export const DelayIcon = styled.div`
  position: relative;

  > :nth-child(2) {
    position: absolute;
    top: 0;
    left: 43px;
  }
`;
