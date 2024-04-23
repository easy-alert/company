import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Counts = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: ${theme.size.sm};
`;

export const CountsInfo = styled.div`
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

export const Container = styled.div`
  padding-top: ${theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const FiltersContainer = styled.div`
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm};
`;

export const FiltersGrid = styled.div`
  margin-top: ${theme.size.sm};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${theme.size.xsm};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;

  @media (max-width: 900px) {
    margin-top: 8px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
`;

export const CountContainer = styled.div`
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  padding: ${theme.size.sm};

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NoMaintenanceCard = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  color: ${theme.color.gray4};
`;

export const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.size.xsm};
  grid-area: 2 / 1 / 2 / 4;

  @media (max-width: 900px) {
    grid-area: 6 / 1 / 6 / 2;
  }
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${theme.color.primaryL};
  width: fit-content;
  height: fit-content;
  border-radius: ${theme.size.xxsm};
  gap: ${theme.size.xsm};
`;

export const TagContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  gap: ${theme.size.xxsm};
  flex-direction: column;
`;
