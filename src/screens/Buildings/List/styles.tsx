import styled from 'styled-components';
import { theme as defaultTheme } from '@styles/theme';

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.size.sm};
  margin-bottom: ${({ theme }) => theme.size.sm};

  @media (max-width: 900px) {
    align-items: flex-start;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  > h2 {
    margin-right: ${({ theme }) => theme.size.sm};
  }

  @media (max-width: 900px) {
    width: 60%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xxsm};
  width: 100%;
  > input {
    height: 24px;
    width: 100%;
    padding: 0;
    background-color: transparent;
    border: none !important;
    outline: none;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: ${({ theme }) => theme.size.xsm};

  @media (max-width: 950px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 450px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const BuildingCard = styled.div<{ disabled: boolean }>`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
  padding: ${({ theme }) => theme.size.sm};

  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  transition: all 0.2s ease;

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  ${({ disabled, theme }) =>
    !disabled &&
    `
    :hover {
      background-color: ${`${theme.color.white}B3`};
    }
  `}
`;

export const BuildingCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 36px;
`;

export const BuildingCardHeaderInfo = styled.div`
  > h5 {
    display: -webkit-box;
    max-width: 500px;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  > p {
    font-weight: 500;
    color: ${({ theme }) => theme.color.gray4};
    margin-top: ${({ theme }) => theme.size.xxsm};
    display: -webkit-box;
    max-width: 500px;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const BuildingCardFooter = styled.div`
  margin-top: ${({ theme }) => theme.size.sm};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.size.sm};
`;

export const BuildingCardFooterInfo = styled.div`
  .pending {
    color: ${({ theme }) => theme.color.warning};
  }

  .expired {
    color: ${({ theme }) => theme.color.actionDanger};
  }

  .completed {
    color: ${({ theme }) => theme.color.success};
  }

  > p {
    color: ${({ theme }) => theme.color.gray4};
    font-weight: 500;
  }
`;

export const PaginationFooter = styled.footer`
  margin-top: 8px;
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: flex-end;
`;

export const NoDataContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 80%;
  gap: ${({ theme }) => theme.size.xxsm};
  > h3 {
    color: ${({ theme }) => theme.color.gray4};
    text-align: center;
  }
`;

export const Content = styled.div`
  min-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
