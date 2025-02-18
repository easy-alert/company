import styled from 'styled-components';
import { theme } from '@styles/theme';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const InputText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  input,
  select {
    padding: ${theme.size.sm};
    border-radius: 4px;
    font-size: 14px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.size.sm};
  justify-content: flex-end;
  margin-top: ${theme.size.md};
`;

export const Checklist = styled.div`
  display: flex;
  gap: ${theme.size.sm};
  align-items: center;
  margin-bottom: ${theme.size.md};
`;

export const ChecklistItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
  font-size: 14px;
  margin-right: ${theme.size.md};
`;
