import styled from 'styled-components';
import { theme } from '../../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};

  > :last-child {
    margin-top: ${theme.size.xsm};
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
`;
