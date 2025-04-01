import styled from 'styled-components';

export const Background = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => theme.size.sm} ${({ theme }) => theme.size.md};
  background-color: #3f3e3e;

  > img {
    width: 100%;
    max-width: 290px;
    height: 65px;
  }

  > p {
    margin-top: ${({ theme }) => theme.size.sm};
    color: ${({ theme }) => theme.color.white};

    > a {
      color: ${({ theme }) => theme.color.white};
      font-weight: 500;
      :hover {
        opacity: 0.7;
      }
    }
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.primary};
  border-radius: ${({ theme }) => theme.size.xxsm};
  gap: ${({ theme }) => theme.size.xsm};
  padding: ${({ theme }) => theme.size.md};

  > h2 {
    margin-bottom: ${({ theme }) => theme.size.sm};
    color: ${({ theme }) => theme.color.white};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const LoginContainer = styled.div`
  width: 100%;
  max-width: 450px;

  display: flex;
  flex-direction: column;
  margin-top: ${({ theme }) => theme.size.xxxxlg};
`;

export const ButtonContainer = styled.div<{
  loading: number;
}>`
  margin-top: ${({ theme }) => theme.size.xsm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.size.xlg};

  > div {
    > div {
      > button {
        display: flex;
        align-items: center;
        justify-content: center;

        ${({ theme }) =>
          ({ loading }) =>
            loading ? `width: fit-content;` : `width: 100px;`}
      }
    }
  }

  > a {
    transition: 0.5s;
    color: ${({ theme }) => theme.color.white};
    outline: 1px solid ${({ theme }) => theme.color.white};
    background-color: transparent;
    height: 30px;
    width: 100px;
    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: ${({ theme }) => theme.size.xxsm};
    padding: ${({ theme }) => theme.size.xsm} ${({ theme }) => theme.size.sm};
    border: none;

    :hover {
      opacity: 0.7;
    }
  }
`;

export const CompanyCardContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const CompanyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};

  border: 1px solid ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xsm};
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);

  cursor: pointer;
  transition: 0.5s;

  :hover {
    border: 1px solid ${({ theme }) => theme.color.primary};
  }
`;

export const CompanyImage = styled.img`
  width: 50px;
  height: 50px;

  object-fit: contain;

  margin-right: ${({ theme }) => theme.size.sm};
`;

export const CompanyName = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

export const SpinnerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${({ theme }) => theme.color.white};
  border-top: 3px solid ${({ theme }) => theme.color.primaryL};
  width: ${({ theme }) => theme.size.sm};
  height: ${({ theme }) => theme.size.sm};
  border-radius: 50%;
  animation: spin 0.75s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
