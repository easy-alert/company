import styled from 'styled-components';
import { theme } from '@styles/theme';

export const UserResponsibleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const UserResponsibleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
`;

export const UserResponsibleContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};

  padding: ${theme.size.sm};
  background-color: ${theme.color.gray0};
  border-radius: ${theme.size.xsm};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%; /* Ensure the content does not exceed the modal width */
  word-wrap: break-word; /* Break long words */
`;

export const UserResponsibleData = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: ${theme.size.xsm};
`;

export const UserResponsibleImageContent = styled.div`
  display: flex;
  align-items: center;

  height: 50%;

  border-right: 1px solid ${theme.color.primary};
  padding-right: ${theme.size.xsm};
`;

export const UserResponsibleDataRow = styled.div`
  height: fit-content;
  overflow: auto;

  > p {
    font-size: 0.75rem;
    color: ${theme.color.gray5};
  }

  > span {
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.size.xsm};
  margin-top: ${theme.size.sm};
`;
