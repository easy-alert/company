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
