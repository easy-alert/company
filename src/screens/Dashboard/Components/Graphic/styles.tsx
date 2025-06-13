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

export const PopoverList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 320px;
  min-width: 260px;
  max-width: 340px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #fff;
  border-radius: 10px;
`;

export const PopoverListItem = styled.li<{ $barcolor?: string }>`
  position: relative;
  padding: 14px 0 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  min-width: 220px;
  max-width: 320px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 4px;
    border-radius: 3px;
    background: ${({ $barcolor }) => $barcolor || '#FFB200'};
    display: block;
  }

  .popover-header {
    font-size: 15px;
    color: #222;
    font-weight: 700;
    margin-bottom: 2px;
  }

  .popover-title {
    font-size: 14px;
    color: #222;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .popover-desc {
    color: #444;
    font-size: 13px;
    margin-bottom: 2px;
    word-break: break-word;
  }

  .popover-due {
    color: #ffb200;
    font-size: 13px;
    font-weight: 600;
    margin-top: 2px;
  }
`;

export const NoActivities = styled.span`
  color: #888;
  font-size: 14px;
  padding: 10px 0;
  display: block;
  text-align: center;
`;
