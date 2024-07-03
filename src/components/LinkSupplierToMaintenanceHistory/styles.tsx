import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SupplierInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  > .opacity {
    opacity: 0.7;
  }

  > div {
    display: flex;
    align-items: center;
    gap: ${theme.size.xxsm};
  }

  a {
    color: ${theme.color.actionBlue};
  }
`;

export const Background = styled.div`
  position: fixed;
  z-index: 14;
  left: 50%;
  top: -48px;

  width: 100vw;
  min-height: calc(100% + 96px);

  transform: translateX(-50%);
  background: rgba(128, 128, 128, 0.6);

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;

  animation: fade-in 0.1s ease-in both;
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 900px) {
    padding: 0;
  }

  scrollbar-width: none;
  scrollbar-color: transparent;
  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;
