import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  @media (max-width: 900px) {
    align-items: flex-start;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: ${theme.size.xsm};
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
  gap: ${theme.size.sm};
`;

export const BuildingCardFooterInfo = styled.div`
  .pending {
    color: ${theme.color.warning};
  }
  .expired {
    color: ${theme.color.actionDanger};
  }
  .delayed {
    margin-top: ${theme.size.xsm};
    color: ${theme.color.orange1};
  }
  .completed {
    color: ${theme.color.success};
    margin-top: ${theme.size.xsm};
  }

  > p {
    color: ${theme.color.gray4};
    font-weight: 500;
  }
`;

export const PaginationFooter = styled.footer`
  margin-top: 10px;
  padding-right: 16px;
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: flex-end;
`;
