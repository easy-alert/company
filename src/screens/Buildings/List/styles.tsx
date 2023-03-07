import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${theme.size.sm};
  margin-bottom: ${theme.size.sm};

  @media (max-width: 900px) {
    align-items: flex-start;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  > h2 {
    margin-right: ${theme.size.sm};
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
  gap: ${theme.size.xxsm};
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
  grid-gap: ${theme.size.xsm};

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

export const BuildingCard = styled.div`
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm};

  :hover {
    cursor: pointer;
    background-color: ${`${theme.color.white}B3`};
  }
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
    color: ${theme.color.gray4};
    margin-top: ${theme.size.xxsm};
    display: -webkit-box;
    max-width: 500px;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const BuildingCardFooter = styled.div`
  margin-top: ${theme.size.sm};
  display: flex;
  align-items: flex-start;
  gap: ${theme.size.sm};
`;

export const BuildingCardFooterInfo = styled.div`
  .pending {
    color: ${theme.color.warning};
  }

  .expired {
    color: ${theme.color.actionDanger};
  }

  .completed {
    color: ${theme.color.success};
  }

  > p {
    color: ${theme.color.gray4};
    font-weight: 500;
  }
`;

export const PaginationFooter = styled.footer`
  margin-top: 8px;
  padding-right: 16px;
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
  gap: ${theme.size.xxsm};
  > h3 {
    color: ${theme.color.gray4};
    text-align: center;
  }
`;

export const Content = styled.div`
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 900px) {
    height: calc(100vh - 184px);
  }
`;
