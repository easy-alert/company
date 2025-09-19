import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: ${({ theme }) => theme.size.sm};

  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 1100px) {
    height: auto;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.size.xxsm};

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;

  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

export const IconReportWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 24px;
  z-index: 2;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const FilterWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.size.xsm};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const FiltersContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};
`;

export const FilterWrapperFooter = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;

  gap: ${({ theme }) => theme.size.sm};

  margin-top: ${({ theme }) => theme.size.xsm};
`;

export const FilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const NoDataContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 84%;
  gap: ${({ theme }) => theme.size.xxsm};

  > h3 {
    color: ${({ theme }) => theme.color.gray4};
    text-align: center;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const Print = styled.div`
  overflow-x: auto;

  @media print {
    margin-top: 40px;
    overflow: visible !important;

    * {
      overflow: visible !important;
      scrollbar-width: none !important;
    }
    *::-webkit-scrollbar {
      display: none !important;
    }
  }
`;
