import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Header = styled.header`
  margin-bottom: ${theme.size.xsm};
`;

export const CalendarWrapper = styled.div`
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

  .rbc-event {
    background-color: red;
  }

  .rbc-show-more {
    color: red;
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

  .rbc-allday-cell {
    height: 600px;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    box-sizing: border-box;
  }

  .rbc-header {
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
`;
