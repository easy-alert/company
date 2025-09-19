import styled from 'styled-components';

export const TicketDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
`;

export const TicketDetailsTitle = styled.h3`
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
`;

export const TicketDetailsColumnContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: ${({ theme }) => theme.size.xsm};

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

export const TicketDetailsDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: -${({ theme }) => theme.size.xsm};
  gap: ${({ theme }) => theme.size.xxsm};
`;

export const TicketDetailsColumnContent = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  gap: ${({ theme }) => theme.size.xxsm};
`;

export const TicketDetailsImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const TicketDetailsImagesContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const TicketFinalSolutionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TicketFinalSolutionContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const TicketSignatureContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const TicketSignatureHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: ${({ theme }) => theme.size.xsm};
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

  margin-top: ${({ theme }) => theme.size.xsm};
  gap: ${({ theme }) => theme.size.xsm};
`;

export const TicketDetailsDismissedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;

  margin-top: ${({ theme }) => theme.size.sm};
`;

// styles for DismissTicket.tsx
export const DismissTicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const DismissTicketText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: ${({ theme }) => theme.size.xsm};
`;

export const TicketEditedAlert = styled.div`
  background: #fff3cd;
  color: #856404;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.size.xxsm};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const TicketImageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const TicketImageUploadLabel = styled.label`
  margin-left: 8px;
  cursor: pointer;
  display: inline-block;
`;

export const TicketImageUploadInput = styled.input`
  display: none;
`;

export const TicketImageUploadSpan = styled.span`
  width: 128px;
  height: 128px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
  font-size: 32px;
  color: #888;
  cursor: pointer;
`;
