import styled, { css } from 'styled-components';
import { theme } from '../../../../styles/theme';
import { IEventTag } from './types';

export const TagContainer = styled.div<IEventTag>`
  width: fit-content;
  padding: 2px ${theme.size.xxsm};
  border-radius: ${theme.size.xxsm};

  > p {
    color: ${theme.color.white};
    font-weight: 500;
  }

  ${({ status }) =>
    status === 'Concluída' &&
    css`
      background-color: ${theme.color.success};
    `}
  ${({ status }) =>
    status === 'Feita em atraso' &&
    css`
      background-color: ${theme.color.primaryM};
    `}
    ${({ status }) =>
    status === 'Pendente' &&
    css`
      background-color: ${theme.color.warning};
    `}
    ${({ status }) =>
    status === 'Vencida' &&
    css`
      background-color: ${theme.color.actionDanger};
    `};
`;
