import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Header = styled.header`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  padding: ${theme.size.sm} 0;
  background-color: ${theme.color.gray1};
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    height: fit-content;
    align-items: flex-start;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${theme.size.xsm};
`;

export const HeaderTitle = styled.div`
  display: flex;
  width: 100%;
  gap: ${theme.size.sm};

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  > h2 {
    margin-right: ${theme.size.sm};
  }

  @media (max-width: 900px) {
    align-items: flex-start;
  }
`;

export const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xxsm};
  width: 50%;
  > input {
    height: 24px;
    width: 100%;
    padding: 0;
    background-color: transparent;
    border: none !important;
    outline: none;
  }
`;

export const CreateMaintenancesContainer = styled.div`
  width: 100%;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const CreateMaintenancesContainerContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.size.xsm};
`;

export const NoMaintenancesContainer = styled.div`
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

export const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.md};
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  scrollbar-width: none;
  scrollbar-color: transparent;
  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;
