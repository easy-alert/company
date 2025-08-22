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

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
