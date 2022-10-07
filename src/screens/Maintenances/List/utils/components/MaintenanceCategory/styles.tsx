import styled from 'styled-components';
import { theme } from '../../../../../../styles/theme';

export const Background = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  @media (max-width: 1100px) {
    min-width: 960px;
  }
`;

export const HeaderCategory = styled.div`
  display: flex;
  margin-bottom: ${theme.size.xsm};
`;

export const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
`;

export const FormContainer = styled.div`
  display: flex;
  align-items: flex-start;

  gap: ${theme.size.xsm};
  width: 100%;
  max-width: 400px;
`;

export const ButtonsHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.size.xsm};
`;

export const MaintenancesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const MaintenancesHeader = styled.div`
  display: flex;
  padding: 0 ${theme.size.sm};
`;

export const MaintenancesGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: 1fr;
  align-items: center;
  grid-gap: ${theme.size.sm};
  grid-template-columns: 250px minmax(250px, 1fr) 0.5fr 0.7fr 0.6fr 0.1fr;
`;

export const SortHeader = styled.div<{ highlighted: boolean }>`
  cursor: pointer;
  width: fit-content;
  transition: 0.25s;

  display: flex;
  align-items: center;
  gap: ${theme.size.xxsm};

  :hover {
    opacity: 0.8;
  }

  ${({ highlighted }) => (highlighted ? `opacity: 1` : `opacity: 0.4`)}
`;
