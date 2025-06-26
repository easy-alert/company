import styled from 'styled-components';
import { theme } from '@styles/theme';
import bannerLogin from '@assets/images/bannerLogin.jpg';

export const Background = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: url(${bannerLogin});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: 100vh;
    height: auto;
    padding: 0;
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

  button {
    margin-top: ${theme.size.xsm};
  }
`;

export const LeftSide = styled.div`
  flex: 0.6;
`;

export const RightSide = styled.div`
  flex: 0.4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
  gap: ${theme.size.md};
  background-color: ${theme.color.primary};
  padding: ${theme.size.xlg} ${theme.size.lg};
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;

  h2 {
    font-size: 18px;
    color: ${theme.color.white};
    text-align: center;
    margin-bottom: ${theme.size.md};
  }

  > img {
    width: 80%;
    max-width: 300px;
    margin-bottom: ${theme.size.md};
  }

  form {
    display: flex;
    flex-direction: column;
    gap: ${theme.size.md};
  }

  button {
    margin-top: ${theme.size.sm};
    background-color: white;
    color: ${theme.color.primary};
  }

  @media (max-width: 768px) {
    border-radius: 0;
    flex: none;
    width: 100%;
    height: 100%;
    padding: ${theme.size.md};
  }
`;
