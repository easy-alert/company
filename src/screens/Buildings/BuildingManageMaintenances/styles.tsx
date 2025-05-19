import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Header = styled.header`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  padding: ${theme.size.sm} 0;
  background-color: ${theme.color.gray1};
  z-index: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    height: fit-content;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${theme.size.xxsm};
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;

  > h2 {
    margin-right: ${theme.size.sm};
  }

  @media (max-width: 900px) {
    align-items: flex-start;
    gap: ${theme.size.xsm};
    flex-direction: column;
  }
`;

export const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xxsm};
  margin-bottom: ${theme.size.xsm};

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

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.md};
`;

export const SelectWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: ${theme.size.md};

  > label {
    margin-top: ${theme.size.xsm};

    display: flex;
    align-items: center;
    gap: ${theme.size.xxsm};
    cursor: pointer;
    color: ${theme.color.gray4};
    font-size: 14px;
    line-height: 16px;
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

export const TableLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70%;
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

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  p {
    font-size: 16px;
    color: #333;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;

  button {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    border: none;
  }
`;
