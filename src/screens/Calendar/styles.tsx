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

  .rbc-date-cell {
    /* pointer-events: none; */
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

  .rbc-row-content {
    max-height: 599px;
    overflow-y: scroll;
    scrollbar-width: none;
    scrollbar-color: transparent;

    ::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }
  }

  .rbc-allday-cell {
    box-sizing: border-box;
    min-height: 598px;
  }

  .rbc-time-header-cell {
    border-top: 1px solid #ddd;
  }

  .rbc-header {
    pointer-events: none;
    font-weight: 400;
  }

  .rbc-time-header-content {
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }

  .rbc-event {
    padding: ${theme.size.xxsm};
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
`;
