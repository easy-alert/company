import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const DragAndDropZone = styled.div<{ width?: string; height?: string }>`
  border: 1px dashed ${theme.color.gray4};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm} ${theme.size.md};
  overflow: hidden;
  cursor: pointer;
  transition: 0.25s;

  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '100px'};

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};

  p {
    color: ${theme.color.gray4};
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;

  color: ${theme.color.danger};
  margin-top: -6px;

  > p {
    animation: scale-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    @keyframes scale-in-left {
      0% {
        transform: scale(0);
        transform-origin: 0% 50%;
        opacity: 1;
      }
      100% {
        transform: scale(1);
        transform-origin: 0% 50%;
        opacity: 1;
      }
    }
  }
`;

export const Background = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
