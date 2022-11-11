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
