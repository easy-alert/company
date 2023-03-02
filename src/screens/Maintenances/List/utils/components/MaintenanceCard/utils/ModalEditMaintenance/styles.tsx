import styled from 'styled-components';
import { theme } from '../../../../../../../../styles/theme';

export const FormContainer = styled.div``;

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

export const ButtonContainer = styled.div<{ buttonsAlign: boolean }>`
  margin-top: ${theme.size.xsm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};

  ${({ buttonsAlign }) => buttonsAlign && 'margin-left: 20px;'}
`;
