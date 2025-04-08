import styled from 'styled-components';

export const Card = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const Subtitles = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    margin-top: 10px;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    opacity: 0.7;
  }
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 4px 0;
  padding: 4px;
`;

export const NameScrollContainer = styled.div`
  width: 100%;
  max-height: 80px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color.primary} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
`;

export const CategoryScrollContainer = styled.div`
  width: 100%;

  max-height: 120px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color.primary} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
`;
