import { theme } from '@styles/theme';
import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const ChecklistContainer = styled.div`
  padding: ${theme.size.sm};
  background-color: ${theme.color.gray0};
  border-radius: ${theme.size.xsm};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%; /* Ensure the content does not exceed the modal width */
  word-wrap: break-word; /* Break long words */
`;

export const ChecklistTitle = styled.h3`
  font-size: ${theme.size.md};
  font-weight: 500;

  margin-bottom: ${theme.size.sm};
`;

export const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};

  margin-bottom: ${theme.size.sm};
`;

export const ProgressBar = styled.div`
  display: flex;

  background-color: #f0f0f0;
  border-radius: ${theme.size.xsm};
  height: ${theme.size.xsm};
`;

export const Progress = styled.div`
  background-color: ${theme.color.actionBlue};
  border-radius: ${theme.size.xsm};
  height: 100%;
`;

export const ProgressText = styled.p`
  font-size: ${theme.size.xsm};
  font-weight: 500;
`;

export const ChecklistItemContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${theme.size.sm};
  margin-left: ${theme.size.xsm};
`;

export const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
`;

export const UserResponsibleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
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

export const InputText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const ContainerBtn = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.size.sm};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.size.sm};
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.size.sm};
`;

export const ImageLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  background-color: ${theme.color.gray0};
  border-radius: ${theme.size.xsm};
`;

export const DeleteCheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};

  margin-top: ${theme.size.sm};
`;
