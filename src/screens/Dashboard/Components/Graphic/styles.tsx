import styled from 'styled-components';

export const Card = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};

  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};

  overflow-x: hidden;
`;

export const ChartContent = styled.div`
  height: 100%;
  width: 100%;
  min-height: 280px;
  position: relative;

  .apexcharts-canvas {
    width: 100%;
    min-width: fit-content;
  }

  .apexcharts-toolbar {
    display: none;
  }
`;

export const NoDataWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 280px;
  opacity: 0.7;
`;
