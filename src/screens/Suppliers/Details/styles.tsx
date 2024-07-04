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
  display: grid;
  grid-template-columns: 0.3fr 0.7fr;
  gap: ${theme.size.sm};
  align-items: center;

  padding: ${theme.size.xsm} ${theme.size.sm};
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};

  > a {
    color: ${theme.color.actionBlue};
    width: fit-content;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: ${theme.size.xsm};
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.size.sm};
`;
