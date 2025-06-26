import styled from 'styled-components';
import { theme } from '@styles/theme';
import bannerLogin from '@assets/images/bannerLogin.jpg';

export const Background = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2e2e2e;

  background-image: url(${bannerLogin});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
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

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};

  > div {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
      color: ${theme.color.white};
      font-size: 0.95rem;
      font-weight: 500;
    }

    input {
      padding: 14px 12px;
      border-radius: 8px;
      border: 1px solid transparent;
      background-color: #ffffff10;
      color: ${theme.color.white};
      outline: none;
      transition: all 0.2s ease;

      &::placeholder {
        color: #cccccc;
      }

      &:focus {
        border-color: ${theme.color.white};
        background-color: #ffffff20;
      }
    }

    span {
      font-size: 0.85rem;
    }
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

export const AccordionContainer = styled.div`
  margin-top: ${theme.size.sm};
  padding: ${theme.size.xsm};

  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
`;

export const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

export const AccordionHeaderTitle = styled.div`
  font-weight: 600;

  color: ${theme.color.primary};
`;

export const AccordionContent = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '150px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;

  padding: ${({ isOpen }) => (isOpen ? theme.size.xsm : '0')};
`;

export const AccordionContentText = styled.p`
  font-weight: 600;
  font-size: 14px;

  color: ${theme.color.primary};

  margin-bottom: ${theme.size.xsm};
`;

export const AccordionContentObservation = styled.p`
  font-size: 12px;
  font-weight: 600;
  font-style: italic;
  color: ${theme.color.primary};
`;

export const RecoverPassword = styled.div`
  margin-top: 24px;
  text-align: center;

  span,
  a {
    color: #fff;
    font-size: 1rem;
  }

  a {
    text-decoration: underline;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  @media (max-width: 600px) {
    font-size: 0.95rem;
    margin-top: 18px;
    padding: 0 8px;
  }
`;
