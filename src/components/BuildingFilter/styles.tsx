import styled from 'styled-components';

export const FiltersContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};

  margin-bottom: ${({ theme }) => theme.size.sm};
`;

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  align-items: end;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const FilterWrapperFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 500px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export const FilterTags = styled.div`
  margin-top: ${({ theme }) => theme.size.xsm};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.size.xsm};

  @media (max-width: 500px) {
    justify-content: center;
  }
`;
