import styled from 'styled-components';

export const Card = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
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
  background-color: ${({ theme }) => theme.color.gray1};
  padding: 4px 8px;
  border-radius: 5px;
  margin-right: 16px;
  margin-bottom: 6px;

  h2 {
    margin: 0;
    line-height: 16px;
    word-break: break-word;
    white-space: normal;
  }
`;

export const NameScrollContainer = styled.div`
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  overflow-x: auto;

  gap: 4px;

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color.primary} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
`;

export const CategoryScrollContainer = styled.div`
  width: 100%;
  max-height: 260px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color.primary} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
`;

export const EmptyMessage = styled.p`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 280px;
  opacity: 0.7;
`;

export const NameItem = styled(CategoryItem)``;
