import styled from 'styled-components';

import { theme } from '@styles/theme';

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-bottom: ${theme.size.md};
`;

export const ModalText = styled.p`
  font-size: ${theme.size.sm};
  text-align: justify;

  margin-bottom: ${theme.size.xsm};
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;

  margin-top: ${theme.size.sm};
`;
