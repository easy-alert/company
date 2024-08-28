import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};

  > :last-child {
    margin-top: ${theme.size.xsm};
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const CountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.md};
`;

export const Count = styled.div`
  display: flex;
  flex-direction: column;

  .total {
    color: ${theme.color.gray4};
  }

  > p {
    color: ${theme.color.gray4};
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
`;

export const DragAndDropZoneFile = styled.div`
  width: 100%;
  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};

  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }
`;
export const DragAndDropFileContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};

  > p {
    color: ${theme.color.gray4};
  }
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${theme.size.xsm};

  > .p2 {
    opacity: 0.7;
  }
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

  > a {
    display: flex;
    align-items: center;
    gap: ${theme.size.xxsm};
    color: ${theme.color.black};

    > p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 400;
      max-width: 185px;
    }

    transition: 0.25s;
    :hover {
      opacity: 0.7;
    }
  }
`;

export const FileLoadingTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: ${theme.color.primaryL};
  border-radius: ${theme.size.xxsm};
  width: 130px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;
