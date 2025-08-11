import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: auto;
    padding: ${({ theme }) => `${theme.size.md} ${theme.size.sm}`};
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.sm};

  margin-top: ${({ theme }) => theme.size.sm};
  margin-bottom: ${({ theme }) => theme.size.sm};

  img {
    width: auto;
    height: auto;
    max-height: 64px;
    object-fit: contain;
  }

  h2 {
    font-size: ${({ theme }) => theme.size.lg};
    color: ${({ theme }) => theme.color.primary};
    font-weight: 700;

    text-align: center;
  }
`;

export const MainContent = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;

  gap: ${({ theme }) => theme.size.md};

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const InfoSection = styled.div`
  width: 65%;
  height: 100%;

  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.sm};

  background: ${({ theme }) => theme.color.white};

  border-radius: ${({ theme }) => theme.size.sm};
  padding: ${({ theme }) => `${theme.size.sm} ${theme.size.md}`};
  box-shadow: 0 2px 8px #0001;

  overflow-y: auto;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 1024px) {
    gap: ${({ theme }) => theme.size.xlg};
  }
`;

export const InfoCard = styled.div<{ highlight?: boolean }>`
  display: flex;
  align-items: flex-start;

  background: ${({ highlight }) => (highlight ? '#fef6f6' : '#fff')};
  border-radius: ${({ theme }) => theme.size.sm};
  padding: ${({ theme }) => `${theme.size.sm} ${theme.size.md}`};
  box-shadow: 0 2px 8px #0001;
  gap: ${({ theme }) => theme.size.sm};

  div {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.size.xsm};
  }

  strong {
    font-size: ${({ theme }) => theme.size.sm};
    color: #b22222;
  }

  span {
    font-size: ${({ theme }) => theme.size.sm};
    color: ${({ theme }) => theme.color.gray4};
  }
`;

export const RankingCard = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  gap: ${({ theme }) => theme.size.md};

  padding: ${({ theme }) => `${theme.size.sm} ${theme.size.md}`};
  border-radius: ${({ theme }) => theme.size.sm};
  box-shadow: 0 2px 8px #0001;
  background: ${({ theme }) => theme.color.white};

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${({ theme }) => theme.size.xxsm};
  }

  strong {
    font-size: ${({ theme }) => theme.size.md};
    color: #b22222;
  }

  span {
    font-size: ${({ theme }) => theme.size.sm};
    font-weight: 600;
    color: ${({ theme }) => theme.color.gray5};
  }

  p {
    font-style: italic;
    font-size: ${({ theme }) => theme.size.sm};
    color: ${({ theme }) => theme.color.gray4};
  }
`;

export const VideoHighlight = styled.div`
  width: 100%;
  height: 100%;
  max-width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  h3 {
    font-size: ${({ theme }) => theme.size.sm};
    font-weight: 500;
    text-align: center;
    color: ${({ theme }) => theme.color.gray4};
    margin-bottom: ${({ theme }) => theme.size.sm};
  }
`;

export const VideoFrame = styled.iframe`
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16/9;

  border: none;
  border-radius: ${({ theme }) => theme.size.sm};
  background: ${({ theme }) => theme.color.black};
  overflow: hidden;
`;

export const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: ${({ theme }) => theme.size.sm};
  padding: ${({ theme }) => theme.size.md};
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.sm};
`;

export const LoadingText = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.gray3};
  font-weight: 500;
  text-align: center;
`;
