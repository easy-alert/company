import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;

  h2 {
    font-size: ${({ theme }) => theme.size.lg};
    color: #b22222;
    font-weight: 700;
    text-align: center;
    margin-top: -24px;
    margin-bottom: 20px;
  }
`;

export const MainContent = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  gap: 32px;
  padding: 0 16px;
  box-sizing: border-box;
  margin-top: 20px;
`;

export const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: space-between;
`;

export const InfoCard = styled.div<{ highlight?: boolean }>`
  background: ${({ highlight }) => (highlight ? '#fef6f6' : '#fff')};
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    font-size: 16px;
    color: #b22222;
  }

  span {
    font-size: 14px;
    color: #333;
  }
`;

export const RankingCard = styled.div`
  background: #fff;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }

  strong {
    font-size: 18px;
    color: #b22222;
  }

  span {
    font-size: 15px;
    font-weight: 600;
    color: #444;
  }

  p {
    font-style: italic;
    font-size: 13px;
    color: #666;
  }
`;

export const VideoHighlight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  h3 {
    font-weight: 600;
    font-size: 15px;
    text-align: center;
    margin-bottom: 6px;
  }
`;

export const VideoFrame = styled.iframe`
  width: 100%;
  aspect-ratio: 16 / 7;
  border-radius: 8px;
  border: none;
  background: #000;
  max-width: 100%;
`;
