import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow: auto;
  max-width: 1920px;
  padding: ${theme.size.sm} ${theme.size.md};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    padding: ${theme.size.sm};
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 450px;
  z-index: 2;

  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.xlg};

  > img {
    width: 100%;
    max-width: 150px;
  }
`;

export const ContentText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  > :nth-child(3) {
    margin-top: ${theme.size.sm};
  }

  p {
    color: #3f3e3e;
  }

  > span {
    color: ${theme.color.primary};
    word-break: break-all;
  }
`;

export const ImageContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;

  z-index: 1;

  > img {
    width: 100%;
    max-width: 150px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

export const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${theme.size.sm};
  margin-top: ${theme.size.md};

  span {
    font-size: 14px;
    line-height: 16px;
    color: #3f3e3e;
  }

  a {
    color: ${theme.color.primary};
    font-weight: 700;

    :hover {
      opacity: 0.7;
    }
  }
`;
