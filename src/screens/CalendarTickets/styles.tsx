import styled from 'styled-components';

export const Container = styled.header`
  width: 100%;
  padding-top: ${({ theme }) => theme.size.sm};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: ${({ theme }) => theme.size.sm};

  margin-bottom: ${({ theme }) => theme.size.sm};

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.size.xxsm};
  }
`;

export const EventBuilding = styled.span`
  font-weight: 700;
`;

export const CalendarWrapper = styled.div<{
  view: string;
  disableCalendarNextButton: boolean;
  yearChangeloading: boolean;
  backgroundColor?: string;
}>`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.md};
  border-radius: ${({ theme }) => theme.size.xsm};
  border: 1px solid ${({ theme }) => theme.color.gray2};

  ${({ view }) =>
    (view === 'dayGridWeek' || view === 'dayGridMonth' || view === 'dayGridYear') &&
    `
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    .fc-toolbar {
      min-width: 900px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      gap: 0;
    }

    .fc-scrollgrid {
      min-width: 900px;
    }
  `}

  .custom-event {
    margin: ${({ theme }) => theme.size.sm};
    background-color: ${({ theme }) => theme.color.gray0};
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    word-break: break-word;
    white-space: normal;
    max-width: 220px;
    width: 100%;
    box-sizing: border-box;
  }

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.size.sm};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.size.xsm};
  }

  @media (max-width: 500px) {
    .fc-toolbar-title {
      font-size: ${({ theme }) => theme.size.sm};
    }

    .custom-event {
      max-width: 180px;
    }
  }

  .fc-toolbar-title {
    font-size: ${({ theme }) => theme.size.csm2};
    font-weight: 500;
    text-align: center;
  }

  .fc-button,
  .fc-button-primary,
  .fc-prev-button,
  .fc-next-button,
  .fc-today-button {
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gray2};
    color: ${({ theme }) => theme.color.gray6};
    border-radius: 6px;

    padding: 6px 18px;
    transition: background 0.2s, color 0.2s;
    box-shadow: none;
    font-size: ${({ theme }) => theme.size.csm2};
  }

  .fc-button:focus,
  .fc-button-primary:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  .fc-button:hover,
  .fc-button-primary:hover,
  .fc-prev-button:hover,
  .fc-next-button:hover,
  .fc-today-button:hover,
  .fc-button:active,
  .fc-button.fc-button-active,
  .fc-button-primary:active,
  .fc-button-primary.fc-button-active,
  .fc-prev-button:active,
  .fc-next-button:active,
  .fc-today-button:active,
  .fc-prev-button.fc-button-active,
  .fc-next-button.fc-button-active,
  .fc-today-button.fc-button-active {
    background: ${({ theme }) => theme.color.gray1} !important;
    color: ${({ theme }) => theme.color.gray6} !important;
    border-color: ${({ theme }) => theme.color.gray2} !important;
    box-shadow: none;
  }

  .fc-day-other {
    background: ${({ theme }) => theme.color.gray1};
    color: ${({ theme }) => theme.color.gray4};
  }

  .fc-event {
    background: transparent !important;
    color: inherit !important;
    border: none !important;
  }

  .fc-today-button,
  .fc-today-button.fc-button-primary,
  .fc-today-button.fc-button-active,
  .fc-today-button.fc-button-primary.fc-button-active {
    background: ${({ theme }) => theme.color.white} !important;
    border-color: ${({ theme }) => theme.color.gray2} !important;
  }

  .fc-today-button:hover,
  .fc-today-button:active,
  .fc-today-button.fc-button-active,
  .fc-today-button.fc-button-primary.fc-button-active {
    background: ${({ theme }) => theme.color.gray1} !important;
    color: ${({ theme }) => theme.color.black};
    border-color: ${({ theme }) => theme.color.gray2} !important;
    box-shadow: none !important;
  }

  .fc-prev-button,
  .fc-next-button,
  .fc-today-button,
  .fc-prev-button.fc-button-primary,
  .fc-next-button.fc-button-primary,
  .fc-today-button.fc-button-primary,
  .fc-prev-button.fc-button-active,
  .fc-next-button.fc-button-active,
  .fc-today-button.fc-button-active,
  .fc-prev-button.fc-button-primary.fc-button-active,
  .fc-next-button.fc-button-primary.fc-button-active,
  .fc-today-button.fc-button-primary.fc-button-active,
  .fc-prev-button:active,
  .fc-next-button:active,
  .fc-today-button:active {
    color: ${({ theme }) => theme.color.gray6} !important;
    box-shadow: none !important;
    transition: background 0.2s, color 0.2s;
  }

  .fc-col-header-cell-cushion,
  .fc-col-header-cell,
  .fc-daygrid-day-number {
    color: ${({ theme }) => theme.color.gray6} !important;
  }

  .fc-day-today,
  .fc-timegrid-col.fc-day-today {
    background: ${({ theme }) => theme.color.white} !important;
  }

  .fc-day-today .fc-daygrid-day-number,
  .fc-timegrid-col.fc-day-today .fc-col-header-cell-cushion {
    color: ${({ theme }) => theme.color.primary} !important;
    font-weight: bold;
  }

  .fc-daygrid-event-harness {
    padding: 4px 4px;
  }
`;

export const CustomEventBar = styled.div`
  height: ${({ theme }) => theme.size.xxsm};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.size.xxsm};
  border-radius: ${({ theme }) => theme.size.xxsm};
  background: ${({ theme }) => theme.color.gray2};
`;

export const FiltersContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.size.xxsm};

  margin-bottom: ${({ theme }) => theme.size.sm};
`;

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  align-items: end;

  gap: ${({ theme }) => theme.size.xsm};
`;

export const FilterWrapperFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.sm};

  @media (max-width: 500px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export const FilterTags = styled.div`
  margin-top: ${({ theme }) => theme.size.xsm};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.size.xsm};

  @media (max-width: 500px) {
    justify-content: center;
  }
`;
