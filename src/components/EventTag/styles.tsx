import styled, { css } from 'styled-components';

import { theme } from '../../styles/theme';

import type { IEventTag } from './types';

export const TagContainer = styled.div<IEventTag>`
  width: fit-content;
  padding: 2px ${theme.size.xxsm};
  border-radius: ${theme.size.xxsm};

  background-color: ${({ bgColor }) => bgColor || theme.color.gray4};

  > p {
    color: ${({ color }) => color || theme.color.white};
    font-weight: ${({ fontWeight }) => fontWeight || 500} !important;
    white-space: nowrap;
  }

  ${({ status }) =>
    status === 'completed' &&
    css`
      background-color: ${theme.color.success};
    `}
  ${({ status }) =>
    status === 'overdue' &&
    css`
      background-color: ${theme.color.primaryM};
    `}
    ${({ status }) =>
    status === 'pending' &&
    css`
      background-color: ${theme.color.warning};
    `}
    ${({ status }) =>
    status === 'expired' &&
    css`
      background-color: ${theme.color.actionDanger};
    `};

  ${({ status }) =>
    status === 'occasional' &&
    css`
      background-color: ${theme.color.purple};
    `};

  ${({ status }) =>
    status === 'common' &&
    css`
      background-color: ${theme.color.common};
    `};

  ${({ status }) =>
    status === 'checklist' &&
    css`
      background-color: ${theme.color.black};
    `};
`;
