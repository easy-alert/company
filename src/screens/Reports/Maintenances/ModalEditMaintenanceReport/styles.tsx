import styled, { css } from 'styled-components';
import { theme } from '../../../../styles/theme';

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
  gap: ${theme.size.xxsm};
`;

export const StatusTagWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
`;

export const Row = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.size.xxsm};
  padding: ${theme.size.xsm} ${theme.size.sm};
  border: 1px solid ${theme.color.gray4};
  background-color: ${theme.color.gray1};
  border-radius: ${theme.size.xsm};

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
      pointer-events: none;

      :hover {
        opacity: 1;
      }
    `}

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FileStyleRow = styled.div<{ disabled?: boolean }>`
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

export const DragAndDropZoneFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 97px;
  width: 97px;

  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};

  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }
`;

export const FileRow = styled.div`
  display: flex;
  gap: ${theme.size.xsm};
  justify-content: flex-start;
  align-items: flex-start;
`;

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
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
  width: 97px;
`;

export const DragAndDropZoneImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};
  height: 97px;
  width: 97px;
  cursor: pointer;
  transition: 0.25s;
  :hover {
    opacity: 0.7;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.size.sm};
`;
