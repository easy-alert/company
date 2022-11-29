import styled from 'styled-components';
import { theme } from '../../../../../../../../styles/theme';

export const FormContainer = styled.div``;

export const SelectWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${theme.size.xsm};
`;

export const ButtonContainer = styled.div<{ buttonsAlign: boolean }>`
  margin-top: ${theme.size.xsm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};

  ${({ buttonsAlign }) => buttonsAlign && 'margin-left: 20px;'}
`;
