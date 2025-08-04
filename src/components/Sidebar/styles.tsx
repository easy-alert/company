import styled from 'styled-components';

export const Background = styled.div`
  display: flex;
  height: 100vh;

  @media (max-width: 900px) {
    flex-direction: column;
    min-width: 280px;
  }
`;

export const MobileBackground = styled.div<{ animate: boolean }>`
  background-color: rgba(128, 128, 128, 0.5);
  height: 100vh;
  width: 100%;
  position: absolute;
  z-index: 5;

  ${({ animate }) =>
    animate
      ? `animation: fade-in 0.125s cubic-bezier(0.39, 0.575, 0.565, 1) both; @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }`
      : `animation: fade-out 0.125s cubic-bezier(0.39, 0.575, 0.565, 1) both; @keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }`};
`;

export const SidebarBody = styled.div<{ openSidebar: boolean }>`
  min-width: 80px;
  max-width: 80px;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.size.csm2};

  padding: ${({ theme }) => theme.size.sm} ${({ theme }) => theme.size.xsm};

  border-radius: 0 12px 12px 0;
  background-color: ${({ theme }) => theme.color.primary};

  text-align: center;

  overflow-y: auto;
  overflow-x: hidden;

  .sidebarButton {
    color: white;
    font-size: 10px;
  }

  @media (max-width: 900px) {
    position: absolute;
    transform: ${({ openSidebar }) => (openSidebar ? 'translateX(0)' : 'translateX(-80px)')};
    transition: 0.25s;
    z-index: 6;
  }
`;

export const Icons = styled.div`
  height: 100%;
`;

export const SidebarBodyMobile = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.size.xsm} 28px;
  width: 100%;
  min-height: 80px;
  border-radius: 0rem 0rem 12px 12px;
  background-color: ${({ theme }) => theme.color.primary};
  overflow: hidden;

  @media (min-width: 900px) {
    display: none;
  }
`;

export const ImageMobile = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-right: 24px;
`;

export const ImageContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;

  cursor: pointer;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const CloseButtonMobile = styled.div`
  margin: 12px 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;

  @media (min-width: 900px) {
    display: none;
  }
`;

export const Spacer = styled.div`
  height: 100%;
`;

export const Hr = styled.div`
  height: 1px;
  width: 100%;

  margin-top: ${({ theme }) => theme.size.csm2};

  background-color: ${({ theme }) => theme.color.white};
`;

export const AppContent = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow: auto;
  max-width: 1920px;
  padding: ${({ theme }) => `0 ${theme.size.md} ${theme.size.sm} ${theme.size.md}`};

  @media (max-width: 900px) {
    padding: ${({ theme }) => `0 ${theme.size.sm} ${theme.size.sm} ${theme.size.sm}`};
  }
`;

export const ReportIcons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;
