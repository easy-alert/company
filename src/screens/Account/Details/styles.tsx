import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.size.xsm};
  padding-top: ${theme.size.sm};
`;

export const CardSection = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: ${theme.size.xxsm};
  margin: ${theme.size.sm} 0;
`;

export const CardContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;

  background-color: ${theme.color.white};
  border-radius: ${theme.size.xsm};

  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const CardImageContainer = styled.div`
  width: 15%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: ${theme.size.sm};

  border-right: 1px solid ${theme.color.gray2};

  @media (max-width: 900px) {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid ${theme.color.gray2};
  }
`;

export const CardTextContainer = styled.div`
  width: 85%;

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};

  > :last-child {
    border-bottom: none;
  }

  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const CardText = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  padding: ${theme.size.csm} ${theme.size.csm};

  border-bottom: 1px solid ${theme.color.gray2};

  .terms {
    color: ${theme.color.primary};
    font-weight: 500;
    text-decoration: underline;
  }

  .link {
    word-break: break-all;
  }

  > h6 {
    width: 35%;
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

export const TableDataWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xxsm};
`;

export const TableButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.size.sm};
`;
