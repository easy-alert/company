import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  button {
    margin-top: ${theme.size.xsm};
  }

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const FrequencyWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.size.xsm};
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;
