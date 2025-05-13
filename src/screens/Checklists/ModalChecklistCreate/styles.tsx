import styled from 'styled-components';
import { theme } from '@styles/theme';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const ChecklistButtons = styled.div`
  display: flex;
  gap: ${theme.size.sm};
  align-items: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: ${theme.size.sm};
`;

export const ChecklistItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
  font-size: 14px;
  margin-right: ${theme.size.md};
`;
