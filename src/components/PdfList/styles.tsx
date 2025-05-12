import styled from 'styled-components';

import { theme } from '@styles/theme';

export const TableCard = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};
`;

export const NoMaintenanceCard = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  color: ${theme.color.gray4};
`;


export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 12px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;