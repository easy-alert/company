import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
  height: 75vh;

  > :last-child {
    margin-left: auto;
  }

  @media (max-width: 900px) {
    min-height: 90vh;
  }
`;
