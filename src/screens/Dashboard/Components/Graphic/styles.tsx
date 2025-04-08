import styled from 'styled-components';

export const Card = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};

  h5 {
    text-align: center;
  }
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
