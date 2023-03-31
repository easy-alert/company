import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Background = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #3f3e3e;
  padding: ${theme.size.xxlg} ${theme.size.md} ${theme.size.sm} ${theme.size.md};

  @media (max-width: 900px) {
    padding: ${theme.size.sm} ${theme.size.md};
  }

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

export const LoginContainer = styled.div`
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  margin-top: ${theme.size.xxlg};

  @media (max-width: 900px) {
    margin-top: ${theme.size.md};
  }

  > form {
    > :last-child {
      margin-top: ${theme.size.xsm};
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

  :first-child {
    color: ${theme.color.white};

    p {
      color: ${theme.color.white};
    }
  }
`;

export const SwitchWrapper = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
  margin-bottom: -4px;
  color: ${theme.color.white};
`;
