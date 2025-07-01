import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: ${({ theme }) => `${theme.size.lg} ${theme.size.md}`};

  @media (max-width: 768px) {
    height: auto;
    padding: ${({ theme }) => `${theme.size.md} ${theme.size.sm}`};
  }
`;

export const ImageContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.sm};

  margin-bottom: ${({ theme }) => theme.size.lg};

  img {
    width: auto;
    height: auto;
    max-height: 128px;
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
  height: 100%;

  display: flex;
  justify-content: center;

  gap: ${({ theme }) => theme.size.xlg};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InfoSection = styled.div`
  width: 65%;

  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.sm};

  background: ${({ theme }) => theme.color.white};

  border-radius: ${({ theme }) => theme.size.sm};
  padding: ${({ theme }) => `${theme.size.sm} ${theme.size.md}`};
  box-shadow: 0 2px 8px #0001;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 768px) {
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
    color: #333;
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
  background: #fff;

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
    color: #444;
  }

  p {
    font-style: italic;
    font-size: ${({ theme }) => theme.size.sm};
    color: #666;
  }
`;

export const VideoHighlight = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-size: ${({ theme }) => theme.size.sm};
    font-weight: 500;
    text-align: center;
    color: #666;
  }
`;

export const VideoFrame = styled.iframe`
  width: 100%;
  height: 100%;

  aspect-ratio: 16 / 9;

  border-radius: ${({ theme }) => theme.size.sm};
  background: #000;
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
  background: #fff;
  border-radius: ${({ theme }) => theme.size.sm};
`;

export const LoadingText = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: #333;
  font-weight: 500;
  text-align: center;
`;
