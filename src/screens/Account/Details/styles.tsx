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

export const UsersCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.size.sm};
  margin-bottom: ${theme.size.sm};
`;

export const UsersCard = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};
  margin-top: ${theme.size.md};

  > h5 {
    color: ${theme.color.gray4};
    font-weight: 500;
    text-align: center;
    margin-bottom: 40px;
  }
`;

export const TableButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.size.sm};
`;
