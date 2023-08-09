import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  padding-top: ${theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.size.md};
`;

export const FilterWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.size.xsm};
  margin-top: ${theme.size.sm};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const Tags = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
  flex-wrap: wrap;

  grid-area: 2 / 1 / 2 / 4;

  @media (max-width: 1100px) {
    grid-area: unset;
  }
`;

export const FilterSection = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.size.sm};
  grid-area: 2 / 4;
  align-self: flex-start;

  @media (max-width: 1100px) {
    grid-area: unset;
  }
`;

export const Wrappers = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const ChartsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.size.sm};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const PanelWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.size.sm};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};

  min-height: 182px;

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const ChartContent = styled.div`
  height: 100%;
  width: 100%;
  min-height: 280px;
`;

export const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.size.sm};

  height: 100%;
  width: 100%;

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;

const MaintenanceCard = styled.div`
  padding: ${theme.size.sm} ${theme.size.sm} ${theme.size.sm} 23px;
  background-color: ${theme.color.gray0};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  border-radius: ${theme.size.xxsm};
`;

export const MostAccomplishedMaintenance = styled(MaintenanceCard)`
  background: linear-gradient(
    90deg,
    rgba(52, 181, 58, 1) 0%,
    rgba(52, 181, 58, 1) 7px,
    rgba(250, 250, 250, 1) 7px,
    rgba(250, 250, 250, 1) 100%
  );
`;

export const LeastAccomplishedMaintenance = styled(MaintenanceCard)`
  background: linear-gradient(
    90deg,
    rgba(255, 53, 8, 1) 0%,
    rgba(255, 53, 8, 1) 7px,
    rgba(250, 250, 250, 1) 7px,
    rgba(250, 250, 250, 1) 100%
  );
`;
