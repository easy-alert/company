import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  button[type='submit'] {
    margin-top: ${theme.size.xsm};
  }
`;

export const FrequencyWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.size.xsm};
`;
