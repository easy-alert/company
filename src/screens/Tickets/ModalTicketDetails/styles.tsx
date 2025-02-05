import styled from 'styled-components';

import { theme } from '@styles/theme';

export const TicketDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const TicketDetailsTitle = styled.h3`
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
`;

export const TicketDetailsColumnContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: ${theme.size.xsm};

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

export const TicketDetailsDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: -${theme.size.xsm};
  gap: ${theme.size.xxsm};
`;

export const TicketDetailsColumnContent = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  gap: ${theme.size.xxsm};
`;

export const TicketDetailsImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;

  gap: ${theme.size.xsm};
`;

export const TicketDetailsImagesContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;

  gap: ${theme.size.xsm};
`;

export const TicketFinalSolutionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TicketFinalSolutionContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: ${theme.size.xsm};
`;

export const TicketSignatureContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const TicketSignatureHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: ${theme.size.xsm};
`;

export const TicketDetailsRowLabel = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
`;

export const TicketDetailsRowValue = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;

  word-break: break-all;
`;

export const TicketDetailsDismissedContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: ${theme.size.xsm};
  gap: ${theme.size.xsm};
`;

export const TicketDetailsDismissedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;

  margin-top: ${theme.size.sm};
`;

// styles for DismissTicket.tsx
export const DismissTicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const DismissTicketText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: ${theme.size.xsm};
`;
