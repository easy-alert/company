import styled from 'styled-components';

import { theme } from '@styles/theme';

import type { IEventTag } from './types';

export const TagContainer = styled.div<IEventTag>`
  width: fit-content;
  padding: 2px ${theme.size.xxsm};
  border-radius: ${theme.size.xxsm};

  background-color: ${({ status, backgroundColor }) => {
    if (!status) return backgroundColor;

    switch (status) {
      case 'completed':
        return theme.color.success;
      case 'overdue':
        return theme.color.primaryM;
      case 'pending':
        return theme.color.warning;
      case 'expired':
        return theme.color.actionDanger;
      case 'occasional':
        return theme.color.purple;
      case 'common':
        return theme.color.common;

      default:
        return backgroundColor || theme.color.white;
    }
  }};

  > p {
    color: ${({ color }) => color || theme.color.white};
    font-weight: 500;
    white-space: nowrap;
  }
`;
