import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.size.xsm};
  padding-top: ${({ theme }) => theme.size.sm};
`;

export const CardSection = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xxsm};
  margin: ${({ theme }) => theme.size.sm} 0;
`;

export const CardContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;

  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xsm};

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

  padding: ${({ theme }) => theme.size.sm};

  border-right: 1px solid ${({ theme }) => theme.color.gray2};

  @media (max-width: 900px) {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.color.gray2};
  }
`;

export const CardTextContainer = styled.div`
  width: 85%;

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};

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
  padding: ${({ theme }) => theme.size.xsm} ${({ theme }) => theme.size.sm};

  border-bottom: 1px solid ${({ theme }) => theme.color.gray2};

  .terms {
    color: ${({ theme }) => theme.color.primary};
    font-weight: 500;
    text-decoration: underline;
  }

  .link {
    word-break: break-all;
  }

  > h6 {
    width: 40%;
    margin-right: ${({ theme }) => theme.size.xsm};
  }

  > p {
    width: 60%;

    > a {
      color: ${({ theme }) => theme.color.black};
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.size.xsm};

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
  gap: ${({ theme }) => theme.size.sm};
`;

export const UsersCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.size.sm};
  margin-bottom: ${({ theme }) => theme.size.sm};
`;

export const UsersCard = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};
  margin-top: ${({ theme }) => theme.size.md};

  > h5 {
    color: ${({ theme }) => theme.color.gray4};
    font-weight: 500;
    text-align: center;
    margin-bottom: 40px;
  }
`;

export const TableDataWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xxsm};
`;

export const TableButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.size.sm};
`;
