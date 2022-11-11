import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const HeaderFill = styled.header`
  padding-bottom: ${theme.size.sm};
  background-color: ${theme.color.gray1};
  height: ${theme.size.sm};
  position: fixed;
  top: 0;

  width: 89%;

  @media (max-width: 900px) {
    height: fit-content;
    align-items: flex-start;
    top: 80px;
    left: 0;
    width: 100%;
  }
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  padding-bottom: ${theme.size.sm};
  background-color: ${theme.color.gray1};

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 900px) {
    height: fit-content;
    align-items: flex-start;
  }
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
  width: 50%;

  > h2 {
    margin-right: ${theme.size.sm};
  }

  @media (max-width: 900px) {
    width: 100%;
    align-items: flex-start;
  }
`;

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.size.xsm};
  width: 50%;
  @media (max-width: 900px) {
    height: 100%;
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
  padding-bottom: ${theme.size.sm};
`;
