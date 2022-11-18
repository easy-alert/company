import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const DragAndDropZone = styled.div`
  margin-top: ${theme.size.xxsm};
  margin-bottom: ${theme.size.xsm};
  width: 100%;
  border: 1px dashed ${theme.color.gray4};
  padding: ${theme.size.sm} ${theme.size.md};

  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
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

export const MatrixTagWrapper = styled.div`
  margin-top: ${theme.size.xsm};
  display: flex;
  gap: ${theme.size.xsm};
  flex-wrap: wrap;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
  padding: 6px 12px;
  background-color: ${theme.color.primaryL};
  width: fit-content;
  height: fit-content;
  border-radius: ${theme.size.xxsm};
  > p {
    font-weight: 400;
  }
`;
