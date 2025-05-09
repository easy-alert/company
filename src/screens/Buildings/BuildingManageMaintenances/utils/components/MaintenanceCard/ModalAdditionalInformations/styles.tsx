import styled, { css } from 'styled-components';
import { theme } from '../../../../../../../styles/theme';

export const Wrapper = styled.div<{ decreaseOpacity?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
  ${({ decreaseOpacity: hasHistory }) => hasHistory && 'opacity: 0.7;'};
`;

export const Row = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
      pointer-events: none;

      :hover {
        opacity: 1;
      }
    `}
`;

export const FileRow = styled.div`
  display: flex;
  gap: ${theme.size.xsm};
  justify-content: flex-start;
  align-items: flex-start;
`;

export const DragAndDropZoneFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 97px;
  min-width: 97px;
  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};

  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }
`;

export const ReportWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  margin-top: ${theme.size.xxsm};
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.size.xsm};
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${theme.color.primaryL};
  width: fit-content;
  height: fit-content;
  border-radius: ${theme.size.xxsm};
  gap: ${theme.size.xsm};

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    max-width: 120px;
  }
`;

export const FileLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.color.primaryL};
  border-radius: ${theme.size.xxsm};
  width: 130px;
  height: 24px;
`;

export const ImageLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: ${theme.color.primaryL};
  border-radius: ${theme.size.xxsm};
  height: 97px;
  min-width: 97px;
`;

export const DragAndDropZoneImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};
  height: 97px;
  min-width: 97px;
  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }
`;
