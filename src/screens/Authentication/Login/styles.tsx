import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Background = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: ${theme.size.sm} ${theme.size.md};
  background-color: #3f3e3e;

  > img {
    width: 100%;
    max-width: 290px;
    height: 65px;
  }

  > p {
    margin-top: ${theme.size.sm};
    color: ${theme.color.white};

    > a {
      color: ${theme.color.white};
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
  background-color: ${theme.color.primary};
  border-radius: ${theme.size.xxsm};
  gap: ${theme.size.xsm};
  padding: ${theme.size.md};

  > h2 {
    margin-bottom: ${theme.size.sm};
    color: ${theme.color.white};
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
  margin-top: ${theme.size.xxxxlg};
`;

export const ButtonContainer = styled.div<{
  loading: number;
}>`
  margin-top: ${theme.size.xsm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.xlg};

  > div {
    > div {
      > button {
        display: flex;
        align-items: center;
        justify-content: center;

        ${({ loading }) => (loading ? `width: fit-content;` : `width: 100px;`)}
      }
    }
  }

  > a {
    transition: 0.5s;
    color: ${theme.color.white};
    outline: 1px solid ${theme.color.white};
    background-color: transparent;
    height: 30px;
    width: 100px;
    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: ${theme.size.xxsm};
    padding: ${theme.size.xsm} ${theme.size.sm};
    border: none;

    :hover {
      opacity: 0.7;
    }
  }
`;
