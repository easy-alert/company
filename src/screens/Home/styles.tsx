import styled from 'styled-components';
import { theme as defaultTheme } from '@styles/theme';

export const Container = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.size.lg};

  > div {
    margin-top: ${({ theme }) => theme.size.xxlg};

    @media (max-width: 900px) {
      min-width: 240px;
      width: 240px;
      min-height: 240px;
      height: 240px;
    }

    @media (max-width: 540px) {
      min-width: 160px;
      width: 160px;
      min-height: 160px;
      height: 160px;
    }

    > img {
      @media (max-width: 900px) {
        min-width: 240px;
        width: 240px;
        min-height: 240px;
        height: 240px;
      }

      @media (max-width: 540px) {
        min-width: 160px;
        width: 160px;
        min-height: 160px;
        height: 160px;
      }
    }
  }
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.size.xlg};
  color: ${({ theme }) => theme.color.primary};
  font-weight: 700;
  text-align: center;

  padding: ${({ theme }) => theme.size.md};
  margin-bottom: ${({ theme }) => theme.size.md};

  @media (max-width: 900px) {
    font-size: ${({ theme }) => theme.size.lg};
  }
`;
