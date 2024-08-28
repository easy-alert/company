import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
  margin-top: 12px;

  .opacity {
    opacity: 0.7;
    padding: ${theme.size.xsm} ${theme.size.sm};
    border: 1px solid ${theme.color.gray4};
    background-color: ${theme.color.gray1};
    border-radius: ${theme.size.xsm};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SupplierInfo = styled.div`
  display: flex;
  gap: ${theme.size.xsm};

  padding: ${theme.size.xsm} ${theme.size.sm};
  border: 1px solid ${theme.color.gray4};
  background-color: ${theme.color.gray1};
  border-radius: ${theme.size.xsm};

  a {
    color: ${theme.color.actionBlue};
  }
`;

export const Background = styled.div`
  position: absolute;
  z-index: 14;
  left: 50%;
  top: -48px;

  width: 100vw;
  min-height: 150%;
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

export const ColumnInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  > div {
    display: flex;
    align-items: center;
    gap: ${theme.size.xxsm};
  }
`;
