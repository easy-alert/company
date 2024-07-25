import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Body = styled.div<{ bodyWidth?: string; zIndex: number }>`
  width: ${({ bodyWidth }) => bodyWidth ?? '460px'};
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  top: 0;
  animation: fade-in-scale 0.25s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  @keyframes fade-in-scale {
    0% {
      scale: 0;
    }
    100% {
      scale: 1;
    }
  }

  padding: ${theme.size.md};
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  z-index: ${({ zIndex }) => zIndex};

  @media (max-width: 900px) {
    width: 100vw;
    min-height: 160%;
    border-radius: 0px;
    overflow-y: scroll;
    margin: 0px;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.size.sm};
`;

export const Background = styled.div<{ zIndex: number }>`
  position: absolute;
  z-index: ${({ zIndex }) => zIndex};
  left: 50%;
  top: -48px;

  width: 100vw;
  min-height: 200%;
  overflow: hidden;

  transform: translateX(-50%);
  background: rgba(128, 128, 128, 0.6);

  display: flex;
  flex-direction: column;
  align-items: center;

  animation: fade-in 0.1s ease-in both;
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  scrollbar-width: none;
  scrollbar-color: transparent;
  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;
