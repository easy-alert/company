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

export const Row = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
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
