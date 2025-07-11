import styled from 'styled-components';

export const Card = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};
  display: flex;
  flex-direction: column;
  height: 230px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
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
`;

export const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;

  gap: ${({ theme }) => theme.size.xsm};

  background-color: ${({ theme }) => theme.color.gray1};
  padding: ${({ theme }) => `${theme.size.xxsm} ${theme.size.xsm}`};
  border-radius: 5px;
  margin-right: 16px;
  margin-bottom: 6px;

  h2 {
    line-height: 16px;
    overflow-wrap: anywhere;
    hyphens: auto;
    white-space: normal;
  }
`;

export const NameScrollContainer = styled.div`
  width: 100%;
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color.primary} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
`;

export const CategoryScrollContainer = styled.div`
  width: 100%;
  max-height: 160px;
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
  min-height: 240px;
  opacity: 0.7;
`;

export const NameItem = styled(CategoryItem)``;
