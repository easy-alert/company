import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Body = styled.div<{ bodyWidth?: string }>`
  width: ${({ bodyWidth }) => bodyWidth ?? '460px'};
  position: fixed;
  left: 0;
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
  z-index: 15;

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
