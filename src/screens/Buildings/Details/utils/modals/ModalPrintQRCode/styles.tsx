import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
  position: relative;
  background-color: ${({ theme }) => theme.color.white};
  z-index: 1;

  > :last-child {
    margin-top: ${({ theme }) => theme.size.xsm};
    margin-left: auto;
  }
`;

export const HideQRCode = styled.div`
  position: absolute;
  z-index: -1;
  overflow: hidden;
`;

export const SmallLoading = styled.div`
  position: absolute;
  left: 125px;
  top: 24px;

  border: 4px solid ${({ theme }) => theme.color.primaryL};
  border-top: 4px solid ${({ theme }) => theme.color.primary};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Selects = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xsm};

  > :first-child {
    max-width: 150px;
  }

  > :nth-child(2) {
    max-width: 250px;
  }
`;
