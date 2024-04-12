import styled, { css } from 'styled-components';
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

export const FileAndImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${theme.size.xsm};

  > .p2 {
    opacity: 0.7;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;
