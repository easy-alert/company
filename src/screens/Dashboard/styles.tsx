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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${theme.size.sm};

  @media (max-width: 1100px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

export const Card = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};

  min-height: 182px;

  width: 100%;

  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const ChartWrapperX = styled.div<{ scrollLeft: number }>`
  overflow-x: auto;
  overflow-y: hidden;

  .apexcharts-legend {
    transition: 0.2s !important;
    inset: unset !important;
    position: absolute !important;
    bottom: 0 !important;
    left: ${({ scrollLeft }) => `${scrollLeft}px !important`};
  }

  ::-webkit-scrollbar {
    width: 5px; /* Largura da scrollbar */
    height: 5px; /* Altura da scrollbar */
  }

  /* Estilizando o trilho da scrollbar */
  ::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* Cor de fundo do trilho */
  }

  /* Estilizando o thumb (a parte móvel) da scrollbar */
  ::-webkit-scrollbar-thumb {
    background-color: #888; /* Cor do thumb */
    border-radius: 5px; /* Borda arredondada do thumb */
  }

  /* Estilizando o thumb quando estiver passando o mouse */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* Cor do thumb ao passar o mouse */
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
  gap: ${theme.size.sm};

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
  padding: ${theme.size.sm} ${theme.size.sm} ${theme.size.sm} 23px;
  background-color: ${theme.color.gray0};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  border-radius: ${theme.size.xxsm};

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
