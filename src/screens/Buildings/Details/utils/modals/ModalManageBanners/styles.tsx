import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const Container = styled.div`
  button {
    margin-top: ${theme.size.xsm};
  }

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const DragAndDropGrid = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  gap: ${theme.size.xsm};

  @media (max-width: 900px) {
    grid-template-columns: 100%;
  }
`;

export const DragAndDropWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
`;

export const ImagePreviewWrapper = styled.div``;

export const DragAndDropZone = styled.div`
  width: 100%;
  height: 202px;
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

export const Content = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: ${theme.size.xxsm};
  text-align: center;

  > p {
    color: ${theme.color.gray4};
  }
`;

export const ImageLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: ${theme.color.primaryL};
  border-radius: ${theme.size.xxsm};
  height: 202px;
  width: 100%;
`;
