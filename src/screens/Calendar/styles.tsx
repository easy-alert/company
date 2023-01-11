import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.header`
  width: 100%;
  padding-top: ${theme.size.sm};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
  margin-bottom: ${theme.size.sm};

  > select {
    max-width: 300px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.size.xxsm};
  }
`;

export const CalendarScroll = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
`;

export const CalendarWrapper = styled.div<{ view: string }>`
  width: 100%;
  background-color: ${theme.color.white};
  padding: ${theme.size.md};
  border-radius: ${theme.size.xsm};
  min-width: 800px;
  position: relative;

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rbc-btn-group {
    :last-child {
      > button {
        :nth-child(2) {
          border-radius: 0px 4px 4px 0px;
        }

        :nth-child(3),
        :nth-child(4) {
          display: none;
        }
      }
    }
  }

  .rbc-today {
    background-color: transparent;
    > button {
      color: ${theme.color.primary};
      font-weight: 900;
    }
  }

  .rbc-now {
    > button {
      color: ${theme.color.primary};
      font-weight: 900;
    }
  }

  .rbc-time-header-gutter {
    padding: 0;
  }

  .rbc-time-view {
    border: none;
  }
  .rbc-time-content {
    display: none;
  }

  .rbc-month-view {
    border-radius: ${theme.size.xsm};
  }

  .rbc-row-content {
    height: 698px;
    overflow-y: scroll;
    scrollbar-color: transparent;
    scrollbar-width: none;
    padding-top: ${theme.size.xsm};

    ::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }
  }

  .rbc-allday-cell {
    box-sizing: border-box;
    min-height: 698px;
  }

  .rbc-time-header-cell {
    border-top: 1px solid #ddd;
    border-radius: ${theme.size.xsm};
  }

  .rbc-header {
    pointer-events: none;
    font-weight: 400;
  }

  .rbc-time-header-content {
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-radius: ${theme.size.xsm};
  }

  .rbc-event {
    padding: ${theme.size.xxsm} ${theme.size.xxsm} ${theme.size.xxsm} ${theme.size.sm};
    font-size: 12px;
    line-height: 14px;
    border-radius: 3px;

    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.08));
  }

  .rbc-row-content,
  .rbc-row-content-scroll-container {
    display: flex;
    flex-direction: column;
    gap: ${theme.size.xsm};
  }

  ${({ view }) =>
    view === 'month' &&
    css`
      .rbc-button-link {
        width: 100%;
        height: 100%;
        padding: 0;
        text-align: right;
        padding-right: 6px;
      }

      .rbc-date-cell {
        padding-right: 0;
      }
    `}

  .rbc-btn-group {
    :first-child {
      > button {
        background-color: transparent;
      }
    }
  }

  .rbc-off-range-bg {
    background-color: #ededed80;
  }
`;
