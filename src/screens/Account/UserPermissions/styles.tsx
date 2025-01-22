import styled from 'styled-components';

import { theme } from '@styles/theme';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.size.xsm};
  padding-top: ${theme.size.sm};
`;

export const HeaderTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: ${theme.size.xsm};
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

  .terms {
    color: ${theme.color.primary};
    font-weight: 500;
    text-decoration: underline;
  }

  .link {
    word-break: break-all;
  }

  > img {
    width: 80px;
    height: 80px;
  }

  > h6 {
    width: 40%;
    margin-right: ${theme.size.xsm};
  }

  > p {
    width: 60%;

    > a {
      color: ${theme.color.black};
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.size.xsm};

    > h6 {
      width: 100%;
    }

    > p {
      width: 100%;
    }
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.size.sm};
`;

export const PermissionsContainer = styled.div`
  margin-top: ${theme.size.xsm};
`;

export const PermissionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.size.sm};
`;

export const PermissionsCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.size.sm};
  margin-bottom: ${theme.size.sm};

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const PermissionsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  padding: ${theme.size.sm};
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
`;

export const PermissionsCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PermissionsCardHeaderTitle = styled.h2`
  font-size: ${theme.size.sm};
  font-weight: 700;
`;

export const PermissionsCardItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.color.gray3};
`;

export const PermissionsCardItemTitle = styled.p`
  font-size: ${theme.size.sm};
  font-weight: 400;
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin-left: auto;
`;

export const BuildingsCardsContainer = styled.div`
  display: flex;
  gap: ${theme.size.sm};
`;

export const BuildingsCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  padding: ${theme.size.sm};
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
`;

export const BuildingsPermissionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(440px, max-content));
  justify-content: space-between;
  gap: ${theme.size.xsm};

  @media (max-width: 1100px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, max-content));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;
