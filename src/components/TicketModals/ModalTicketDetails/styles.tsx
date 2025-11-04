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
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

export const TicketDetailsRowLabel = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
`;

export const TicketDetailsRowValue = styled.span`
  font-weight: 400;
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
  gap: ${({ theme }) => theme.size.sm};
  align-items: center;
  justify-content: center;
`;

// styles for DismissTicket.tsx
export const DismissTicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const DismissTicketText = styled.span`
  font-weight: 500;
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

export const DetailsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DetailItemWrapper = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgb(153, 153, 153);
  background-color: rgb(237, 237, 237);
  border-radius: 0.5rem;
`;

export const DetailItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
`;

export const DetailItemContentVertical = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BuildingName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
`;

export const DetailItemVertical = styled.span`
  display: flex;
  gap: 20px;
  width: 100%;
`;

export const SignatureImageContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 8px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SignatureImage = styled.img`
  max-width: 100%;
  max-height: 80px;
  height: auto;
  object-fit: contain;
`;

export const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`;

export const TicketDate = styled.span`
  font-size: 12px;
  color: #555;
  font-weight: 500;
`;

export const PopoverContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 100%;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  width: 300px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PopoverHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PopoverMessage = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;

  p {
    color: ${({ theme }) => theme.color.danger};
  }
`;

export const PopoverActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;
