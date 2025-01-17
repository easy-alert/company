import styled from 'styled-components';

import { theme } from '../../styles/theme';

export const ForbiddenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

export const ForbiddenContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
  align-items: center;
  justify-content: center;
`;

export const ForbiddenTitle = styled.h1`
  font-size: ${theme.size.lg};
`;

export const ForbiddenText = styled.p`
  font-size: ${theme.size.md};
`;
