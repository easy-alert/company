import styled from 'styled-components';
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
    background-color: transparent;
    max-width: 300px;
  }
`;

export const CalendarWrapper = styled.div`
  min-width: 700px;
  width: 100%;

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
  }

  .rbc-current {
    > button {
      color: ${theme.color.primary};
      font-weight: 700;
    }
  }

  .rbc-date-cell {
    pointer-events: none;
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
    min-height: 599px;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;

    box-sizing: border-box;
  }

  .rbc-header {
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    pointer-events: none;
  }

  .rbc-row-bg {
    border-bottom: 1px solid #ddd;
  }
`;
