import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const Container = styled.div`
  button {
    margin-top: ${theme.size.sm};
  }

  > h6 {
    margin-top: ${theme.size.xsm};
  }
`;

export const DragAndDropZone = styled.div`
  margin-top: ${theme.size.xxsm};
  width: 100%;
  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};
  overflow: hidden;
  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }
`;

export const FileZone = styled.div`
  margin-top: ${theme.size.xxsm};
  width: 100%;
  border: 1px dashed ${theme.color.gray4};
  padding: ${theme.size.sm} ${theme.size.md};
  height: 82px;
  display: flex;
  align-items: center;
  gap: ${theme.size.md};
  justify-content: space-between;
  overflow: hidden;

  > p {
    word-break: break-all;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};

  > p {
    color: ${theme.color.gray4};
  }
`;
