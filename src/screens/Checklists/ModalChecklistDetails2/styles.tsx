import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
`;

export const ChecklistContainer = styled.div`
  padding: ${({ theme }) => theme.size.sm};
  background-color: ${({ theme }) => theme.color.gray0};
  border-radius: ${({ theme }) => theme.size.xsm};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%; /* Ensure the content does not exceed the modal width */
  word-wrap: break-word; /* Break long words */
`;

export const ChecklistTitle = styled.h3`
  font-size: ${({ theme }) => theme.size.sm};
  font-weight: 500;

  margin-bottom: ${({ theme }) => theme.size.sm};
`;

export const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
  margin-bottom: ${({ theme }) => theme.size.sm};
`;

export const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: ${({ theme }) => theme.size.sm};
  height: ${({ theme }) => theme.size.sm};
`;

export const Progress = styled.div`
  background-color: ${({ theme }) => theme.color.primary};
  border-radius: ${({ theme }) => theme.size.xsm};
  height: 100%;
`;

export const ProgressPercentageText = styled.p`
  margin-left: ${({ theme }) => theme.size.xsm};
  margin-right: ${({ theme }) => theme.size.xsm};
  font-size: 0.75rem;
  font-weight: 500;
`;

export const ProgressText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.gray4};
  font-weight: 500;
`;

export const ChecklistItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
  margin-left: ${({ theme }) => theme.size.xsm};
`;

export const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};
`;

export const UserResponsibleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
`;

export const UserResponsibleContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xsm};

  padding: ${({ theme }) => theme.size.sm};
  background-color: ${({ theme }) => theme.color.gray0};
  border-radius: ${({ theme }) => theme.size.xsm};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%; /* Ensure the content does not exceed the modal width */
  word-wrap: break-word; /* Break long words */
`;

export const UserResponsibleData = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const UserResponsibleImageContent = styled.div`
  display: flex;
  align-items: center;

  height: 50%;

  border-right: 1px solid ${({ theme }) => theme.color.primary};
  padding-right: ${({ theme }) => theme.size.xsm};
`;

export const UserResponsibleDataRow = styled.div`
  height: fit-content;
  overflow: auto;

  > p {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.color.gray5};
  }

  > span {
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

export const InputText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const ContainerBtn = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.size.sm};

  div {
    display: flex;
    gap: ${({ theme }) => theme.size.xxxxlg};
    align-items: center;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.size.sm};
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.size.sm};
`;

export const ImageLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  background-color: ${({ theme }) => theme.color.gray0};
  border-radius: ${({ theme }) => theme.size.xsm};
`;

export const DeleteCheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
  margin-top: ${({ theme }) => theme.size.sm};
`;
