import styled from 'styled-components';

import { theme } from '@styles/theme';

export const Content = styled.div`
  padding: ${theme.size.sm};
  background-color: #f9f9f9;
  border-radius: ${theme.size.xsm};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%; /* Ensure the content does not exceed the modal width */
  word-wrap: break-word; /* Break long words */
`;

export const ChecklistTitle = styled.div`
  margin-left: ${theme.size.xsm};
  word-wrap: break-word;

  > p {
    font-size: ${theme.size.sm};
    font-weight: 600;
    word-wrap: break-word;
  }
`;

export const ChecklistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  margin-top: ${theme.size.xsm};
  margin-left: ${theme.size.md};
`;

export const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
`;

export const ChecklistButtons = styled.div`
  display: flex;
  gap: ${theme.size.xsm};

  margin-top: ${theme.size.xsm};
`;
