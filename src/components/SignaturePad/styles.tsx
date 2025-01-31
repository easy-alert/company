import styled from 'styled-components';

import { theme } from '@styles/theme';

export const SignaturePad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: ${theme.size.md};
  padding: ${theme.size.md};

  > canvas {
    min-width: 100%;
    max-width: 100%;
    min-height: 200px;
    max-height: 200px;

    border: 1px solid ${theme.color.gray3};
    border-radius: ${theme.size.xsm};

    @media (max-width: 900px) {
      min-height: 300px;
      max-height: 300px;
    }
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: ${theme.size.md};
`;
