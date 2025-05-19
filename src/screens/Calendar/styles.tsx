import styled, { css } from 'styled-components';

export const Container = styled.header`
  width: 100%;
  padding-top: ${({ theme }) => theme.size.sm};
`;

export const Header = styled.header<{ arrowColor?: string }>`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.size.sm};
  gap: ${({ theme }) => theme.size.sm};

  > :nth-child(3) {
    margin-left: auto;
  }

  > select {
    max-width: 300px;
    cursor: pointer;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    font-size: 14px;
    outline: none;
    width: 100%;
    background-color: ${({ theme }) => theme.color.white};
    border-radius: ${({ theme }) => theme.size.xxsm};
    padding: 0 ${({ theme }) => theme.size.sm};
    padding-right: 40px;

    background-image: ${({ arrowColor = 'black', theme }) => {
      const color = theme.color[arrowColor as keyof typeof theme.color] || arrowColor;
      return `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
          <polyline points='6 9 12 15 18 9'/>
        </svg>`,
      )}")`;
    }};
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.size.xxsm};
    > :last-child {
      margin-left: 0;
    }
  }
`;

export const CalendarScroll = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
`;

export const CalendarWrapper = styled.div<{
  view: string;
  disableCalendarNextButton: boolean;
  yearChangeloading: boolean;
}>`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};
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

  .rbc-btn-group {
    ${({ yearChangeloading }) =>
      yearChangeloading &&
      css`
        opacity: 0.7;
        pointer-events: none;
      `}
  }

  .rbc-btn-group {
    > :nth-child(3) {
      ${({ disableCalendarNextButton }) =>
        disableCalendarNextButton &&
        css`
          opacity: 0.7;
          pointer-events: none;
        `}
    }
  }

  .rbc-today {
    background-color: transparent;
    > button {
      color: ${({ theme }) => theme.color.primary};
      font-weight: 900;
    }
  }

  .rbc-now {
    > button {
      color: ${({ theme }) => theme.color.primary};
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
    border-radius: ${({ theme }) => theme.size.xxsm};
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
    border-radius: ${({ theme }) => theme.size.xxsm};
  }

  .rbc-header {
    pointer-events: none;
    font-weight: 400;
  }

  .rbc-time-header-content {
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-radius: ${({ theme }) => theme.size.xxsm};
  }

  .rbc-event {
    margin-top: ${({ theme }) => theme.size.xsm};
    padding: ${({ theme }) => theme.size.xxsm} ${({ theme }) => theme.size.xxsm}
      ${({ theme }) => theme.size.xxsm} ${({ theme }) => theme.size.sm};
    font-size: 12px;
    line-height: 14px;
    border-radius: ${({ theme }) => theme.size.xxsm};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);

    :hover {
      opacity: 0.8;
    }

    :focus {
      outline: none;
    }
  }

  .rbc-row-segment {
    padding: 0 ${({ theme }) => theme.size.xxsm};
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

  /* nao lembro o que era esse */
  /* .rbc-selected {
    background-color: red;
  } */

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
    border-top-right-radius: ${({ theme }) => theme.size.xsm};
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

export const YearLoading = styled.div`
  position: absolute;
  left: 260px;
  top: 19px;

  border: 4px solid ${({ theme }) => theme.color.primaryL};
  border-top: 4px solid ${({ theme }) => theme.color.primary};
  border-radius: 50%;
  width: 25px;
  height: 25px;
  animation: spin 0.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
