import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  position: relative;
  background-color: ${theme.color.white};
  z-index: 1;

  > :last-child {
    margin-top: ${theme.size.xsm};
    margin-left: auto;
  }
`;

export const HideQRCode = styled.div`
  position: absolute;
  z-index: -1;
`;
