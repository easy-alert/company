import styled from 'styled-components';

export const Container = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.color.gray1};
  padding: ${({ theme }) => theme.size.md} 0;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.size.sm};
  gap: ${({ theme }) => theme.size.sm};

  > select {
    max-width: 300px;
    min-width: 220px;
    padding: ${({ theme }) => `${theme.size.xsm} ${theme.size.md}`};
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.color.gray3};
    background: ${({ theme }) => theme.color.white};
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

export const EventInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
`;

export const EventBuilding = styled.span`
  font-weight: 700;
`;

export const EventTicketNumber = styled.span`
  color: ${({ theme }) => theme.color.gray4};
  font-size: 12px;
  font-weight: 600;
  margin-left: 16px;

  @media (max-width: 500px) {
    font-size: 10px;
    margin-left: 0;
    margin-top: 2px;
  }
`;
export const CalendarWrapper = styled.div<{
  view: string;
  disableCalendarNextButton: boolean;
  yearChangeloading: boolean;
  backgroundColor?: string;
}>`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.size.md};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.gray2};

  .custom-event {
    margin: 8px;
    background-color: ${({ theme }) => theme.color.gray0};
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    color: ${({ theme }) => theme.color.gray6};
    cursor: pointer;
    padding: 12px;
    word-break: break-word;
    white-space: normal;
    max-width: 220px;
    width: 100%;
    box-sizing: border-box;
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

  .custom-event.status-em-execucao {
    border-left: 8px solid ${({ theme }) => theme.color.warning};
  }

  .custom-event.status-concluidas {
    border-left: 8px solid ${({ theme }) => theme.color.success};
  }

  .custom-event.status-indeferido {
    border-left: 8px solid ${({ theme }) => theme.color.danger};
  }
`;
