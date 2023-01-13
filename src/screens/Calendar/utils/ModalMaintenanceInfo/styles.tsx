import styled, { css } from 'styled-components';
import { theme } from '../../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};

  > :last-child {
    margin-top: ${theme.size.xsm};
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const TagWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
`;

export const DragAndDropZone = styled.div<{ onFileQuery: boolean }>`
  margin-top: ${theme.size.xxsm};
  width: 100%;
  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};

  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }

  ${({ onFileQuery }) =>
    onFileQuery &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;
export const DragAndDropContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};

  > p {
    color: ${theme.color.gray4};
  }
`;

export const FileRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.size.xsm};
  margin-top: ${theme.size.xxsm};
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
    max-width: 154px;
  }
`;

export const LoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: ${theme.color.primaryL};
  width: 125px;
  border-radius: ${theme.size.xxsm};
`;
