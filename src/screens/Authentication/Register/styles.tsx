import styled from 'styled-components';
import { theme } from '@styles/theme';
import bannerLogin from '@assets/images/bannerLogin.jpg';

export const Background = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;

  background-image: url(${bannerLogin});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .p2 {
    color: ${theme.color.white};
    margin-top: 16px;
  }
  .p2 a {
    color: ${theme.color.white};
    text-decoration: underline;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    padding: ${theme.size.sm} ${theme.size.md};
  }
`;

export const LeftSide = styled.div`
  flex: 0.6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${theme.size.lg};
  color: ${theme.color.black};

  @media (max-width: 768px) {
    border-radius: 12px 12px 0 0;
    flex: none;
    width: 100%;
  }
`;

export const RightSide = styled.div`
  flex: 0.4;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${theme.color.primary};

  > img {
    width: 70%;
    max-width: 220px;
    margin-bottom: ${theme.size.sm};
  }

  form {
    display: flex;
    flex-direction: column;
    gap: ${theme.size.sm};
  }

  button {
    background-color: white;
    color: ${theme.color.primary};
  }

  @media (max-width: 900px) {
    border-radius: 0 0 12px 12px;
    flex: none;
    width: 100%;
    height: auto;
    padding: 16px 16px;
  }
`;

export const LoginContainer = styled.div`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  margin-top: 0;

  @media (max-width: 900px) {
    margin-top: 0;
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
  border-radius: ${theme.size.xxsm};
  gap: 6px;
  padding: ${theme.size.xsm};

  a {
    color: ${theme.color.white};
    font-weight: 700;
    font-size: 12px;
  }

  > h2 {
    margin-bottom: ${theme.size.xsm};
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

export const PasswordDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  > :nth-child(2) {
    position: absolute;
    top: 26px;
    right: 16px;
  }
`;
