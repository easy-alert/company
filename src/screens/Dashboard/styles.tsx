import styled from 'styled-components';
import { theme as defaultTheme } from '@styles/theme';

export const Container = styled.div`
  padding-top: ${({ theme }) => theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.md};

  .spacing-select {
    margin-top: 16px;
  }
`;

export const FilterWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.size.xsm};
  margin-top: ${({ theme }) => theme.size.sm};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const Tags = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.xsm};
  flex-wrap: wrap;

  grid-area: 2 / 1 / 2 / 4;

  @media (max-width: 1100px) {
    grid-area: unset;
  }
`;

export const FilterSection = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.size.sm};
  grid-column: span 5;
  margin-top: ${({ theme }) => theme.size.xsm};

  @media (max-width: 1100px) {
    grid-column: span 2;
  }

  @media (max-width: 700px) {
    grid-column: span 1;
  }
`;

export const Wrappers = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.sm};
`;

export const ChartsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const PieWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const PanelWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 1100px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};

  min-height: 182px;

  width: 100%;

  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const ChartWrapperX = styled.div<{ scrollLeft: number }>`
  overflow-x: auto;
  overflow-y: hidden;

  .apexcharts-legend {
    transition: 0.2s !important;
    inset: unset !important;
    position: absolute !important;
    bottom: 0 !important;
    left: ${({ theme, scrollLeft }) => `${scrollLeft}px !important`};
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

export const ChartContent = styled.div`
  height: 100%;
  width: 100%;
  min-height: 280px;

  .apexcharts-toolbar {
    z-index: 0 !important;
  }

  .apexcharts-bar-series.apexcharts-plot-series path {
    clip-path: inset(0% 0% -8px 0% round 8px);
  }
`;

export const NoDataWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  opacity: 0.7;
`;

export const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.size.sm};

  > h2 {
    font-size: 32px;
    line-height: 36px;
  }

  > h6 {
    opacity: 0.7;
  }

  height: 100%;
  width: 100%;

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;

const MaintenanceCard = styled.div`
  padding: ${({ theme }) => theme.size.sm} ${({ theme }) => theme.size.sm}
    ${({ theme }) => theme.size.sm} 23px;
  background-color: ${({ theme }) => theme.color.gray0};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
  border-radius: ${({ theme }) => theme.size.xxsm};

  cursor: pointer;
  min-width: 0;
  width: 100%;

  > h6,
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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

export const MaintenancesCounts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const TicketsCounts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const CountCard = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};

  width: 100%;

  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const CountCardContent = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};

  > h2 {
    font-size: 32px;
    line-height: 36px;
  }

  > p.p4 {
    opacity: 0.7;
    text-align: center;
  }

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;
