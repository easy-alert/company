import styled from 'styled-components';

export const Counts = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.size.sm};
`;

export const CountsInfo = styled.div<{ color?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.size.xsm};

  > h5 {
    color: ${({ color, theme }) => color || theme.color.black};
  }

  > p {
    color: ${({ theme }) => theme.color.gray4};
    font-weight: 500;
  }
`;

export const Container = styled.div`
  padding-top: ${({ theme }) => theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
`;

export const FiltersContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};
`;

export const FilterWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: ${({ theme }) => theme.size.xsm};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const FilterWrapperFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: ${({ theme }) => theme.size.sm};
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.size.sm};
  grid-area: 2 / 4;
  align-self: flex-start;
`;

export const FilterTags = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xsm};
  flex-wrap: wrap;

  grid-area: 2 / 1 / 2 / 4;
`;

export const FiltersGrid = styled.div`
  margin-top: ${({ theme }) => theme.size.sm};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.size.xsm};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  white-space: nowrap;

  @media (max-width: 900px) {
    margin-top: 8px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};
`;

export const ViewButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};
`;

export const CustomButton = styled.button<{ active: boolean }>`
  padding: 0;
  background-color: unset;

  font-weight: 500;
  border-radius: 0;
  padding-bottom: ${({ theme }) => theme.size.xsm};
  font-size: 14px;
  line-height: 16px;

  color: ${({ active, theme }) => (active ? theme.color.primary : theme.color.gray4)};
  border-bottom: 1px solid ${({ active, theme }) => (active ? theme.color.primary : 'transparent')};
`;

export const CountContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
  padding: ${({ theme }) => theme.size.sm};

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NoMaintenanceCard = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  color: ${({ theme }) => theme.color.gray4};
`;

export const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.size.xsm};
  grid-area: 2 / 1 / 2 / 4;

  @media (max-width: 900px) {
    grid-area: 6 / 1 / 6 / 2;
  }
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${({ theme }) => theme.color.primaryL};
  width: fit-content;
  height: fit-content;
  border-radius: ${({ theme }) => theme.size.xxsm};
  gap: ${({ theme }) => theme.size.xsm};
`;
