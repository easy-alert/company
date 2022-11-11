import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow: auto;
  max-width: 1920px;
  padding: ${theme.size.sm} ${theme.size.md};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.xxlg};

  > img {
    width: 100%;
    height: 87px;
    max-width: 400px;
  }

  @media (max-width: 900px) {
    padding: ${theme.size.sm};
  }
`;
