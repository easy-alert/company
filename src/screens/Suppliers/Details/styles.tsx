import styled from 'styled-components';
import { theme as defaultTheme } from '@styles/theme';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.size.xsm};
  padding-top: ${({ theme }) => theme.size.sm};
`;

export const CardSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xxsm};
  margin: ${({ theme }) => theme.size.sm} 0;
`;

export const Card = styled.div`
  display: grid;
  grid-template-columns: 0.3fr 0.7fr;
  gap: ${({ theme }) => theme.size.sm};
  align-items: center;

  padding: ${({ theme }) => theme.size.xsm} ${({ theme }) => theme.size.sm};
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};

  > a {
    color: ${({ theme }) => theme.color.actionBlue};
    width: fit-content;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.size.xsm};
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.size.sm};

  margin-bottom: ${({ theme }) => theme.size.xsm};
`;

export const MaintenancesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
  margin-top: ${({ theme }) => theme.size.sm};
  min-width: 1000px;
`;

export const MaintenanceCard = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.xsm} ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};

  display: grid;
  align-items: center;
  grid-template-columns: minmax(250px, 0.5fr) minmax(270px, 0.8fr) minmax(300px, 1fr) 18px;
  min-height: 96px;
  gap: ${({ theme }) => theme.size.sm};
`;

export const MaintenaceHeader = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: minmax(250px, 0.5fr) minmax(270px, 0.8fr) minmax(300px, 1fr) 18px;

  padding: 0 ${({ theme }) => theme.size.sm};

  gap: ${({ theme }) => theme.size.sm};
`;
