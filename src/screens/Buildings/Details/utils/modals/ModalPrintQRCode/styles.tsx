import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
  height: 75vh;

  > :last-child {
    margin-left: auto;
  }

  @media (max-width: 900px) {
    min-height: 90vh;
  }
`;

export const LoadingContainer = styled.div`
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PDFContainer = styled.div`
  width: 100%;
  height: 100%;

  > iframe {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    max-height: 850px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};
`;
