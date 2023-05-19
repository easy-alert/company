import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.size.xsm};
  padding-top: ${theme.size.sm};
`;

export const CardSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
  margin: ${theme.size.sm} 0;
`;

export const Card = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.size.xsm} ${theme.size.sm};
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};

  > img {
    width: 80px;
    height: 80px;
  }

  > h6 {
    width: 40%;
    margin-right: ${theme.size.xsm};
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.size.xsm};

    > h6 {
      width: 100%;
    }
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.size.sm};
`;
