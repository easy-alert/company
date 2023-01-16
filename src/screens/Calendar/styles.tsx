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
  min-width: 850px;
  position: relative;

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rbc-btn-group {
    :last-child {
      > button {
        :nth-child(6) {
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

  /* .rbc-header::first-letter {
    text-transform: uppercase;
  } */

  .rbc-row-content {
    height: 706px;
    overflow-y: scroll;
    scrollbar-color: transparent;
    scrollbar-width: none;

    ::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }
  }

  .rbc-allday-cell {
    box-sizing: border-box;
    min-height: 706px;
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
    margin-top: ${theme.size.xsm};
    padding: ${theme.size.xxsm} ${theme.size.xxsm} ${theme.size.xxsm} ${theme.size.sm};
    font-size: 12px;
    line-height: 14px;
    border-radius: 3px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.08));

    :focus {
      outline: none;
    }

    transition: 0.25s;
    :hover {
      opacity: 0.8;
    }
  }

  .rbc-row-segment {
    padding: 0 ${theme.size.xxsm};
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

  .rbc-selected {
    background-color: red;
  }

  .rbc-off-range-bg {
    background-color: #ededed80;
  }

  /* change weekends background */
  /* .rbc-time-header-cell > :nth-child(6),
  .rbc-time-header-cell > :last-child,
  .rbc-month-header > :nth-child(6),
  .rbc-month-header > :last-child {
    background-color: #ededed !important;
  }

  .rbc-time-header-cell > :last-child,
  .rbc-month-header > :last-child {
    border-top-right-radius: ${theme.size.xsm};
  }

  .rbc-row-bg > :nth-child(6),
  .rbc-row-bg > :last-child {
    background-color: #ededed !important;
  } */

  /* ***********************************************************************  */

  /* hide weekend */
  /* .rbc-time-header-cell > :nth-child(6),
  .rbc-time-header-cell > :last-child,
  .rbc-month-header > :nth-child(6),
  .rbc-month-header > :last-child {
    display: none;
  }

  .rbc-row-bg > :nth-child(6),
  .rbc-row-bg > :last-child {
    display: none;
  }

  .rbc-row > .rbc-date-cell:nth-child(6),
  .rbc-row > .rbc-date-cell:last-child {
    display: none;
  }

  .rbc-row-segment {
    flex-basis: 20% !important;
    max-width: 20% !important;
  } */
`;
