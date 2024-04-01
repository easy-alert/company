import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  padding-top: ${theme.size.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.size.sm};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.size.xsm};

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderLeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};
  width: 100%;

  > :nth-child(2) {
    max-width: 300px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
`;

export const DateHeader = styled.div`
  position: relative;
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};

  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const ContentRow = styled.div`
  display: grid;
  grid-template-columns: 226px 1fr;
  gap: ${theme.size.xsm};
  min-height: 240px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  .react-calendar {
    border-radius: ${theme.size.xxsm};
    border: none;
    position: relative;
    width: 100%;
    max-width: 210px;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: ${theme.color.gray4} !important;
  }

  .react-calendar__century-view__decades__decade,
  .react-calendar__decade-view__years__year,
  .react-calendar__year-view__months__month {
    color: ${theme.color.black} !important;
  }

  .react-calendar__month-view__days {
    abbr {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 23px !important;
      height: 23px !important;
    }
  }

  .react-calendar__month-view__days__day {
    color: ${theme.color.black};
    height: 30px !important;

    :hover {
      background-color: ${theme.color.primaryL};
    }
  }

  .react-calendar__navigation {
    display: flex;
    align-items: center;
    margin-bottom: 0;
  }

  .react-calendar__navigation__label__labelText {
    color: ${theme.color.black} !important;
    height: 48px !important;
  }

  .react-calendar__navigation__arrow {
    color: ${theme.color.black} !important;
    font-size: 32px;
    position: relative;
  }

  .react-calendar__navigation__prev-button {
    left: -16px;
    position: absolute;
  }

  .react-calendar__navigation__next-button {
    right: -16px;
    position: absolute;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: capitalize;
    font-weight: 400;
    font-size: 12px;
  }

  .react-calendar__month-view__weekdays__weekday {
    padding: 0 !important;
  }

  .react-calendar__month-view__weekdays__weekday {
    padding: 4px;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }

  .react-calendar__month-view__weekNumbers,
  .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 400;
  }

  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }

  .react-calendar__tile {
    max-width: 100%;
    padding: 8px 4px;
    background: none;
    text-align: center;
    line-height: 14px;
    font-size: 12px;
    font-weight: 400;
  }

  .react-calendar__tile:enabled:hover {
    opacity: 0.4;
    border-radius: 100%;
  }

  .react-calendar__tile--now {
    color: ${theme.color.primary} !important;
    font-weight: 700;
  }

  .react-calendar__tile--now:hover {
    background-color: ${theme.color.primaryL};
  }

  .react-calendar__tile--active {
    background: ${theme.color.primary} !important;
    color: ${theme.color.white} !important;
    border-radius: 100%;
    font-weight: 700;
  }

  .react-calendar__navigation__next-button:hover {
    opacity: 0.6;
  }

  .react-calendar__navigation__prev-button:hover {
    opacity: 0.6;
  }

  .react-calendar__navigation__prev2-button,
  .react-calendar__navigation__next2-button {
    display: none;
  }

  .react-calendar__navigation__arrow,
  .react-calendar__navigation__label {
    background-color: transparent !important;
  }

  .somePending {
    padding: 0 !important;
    > abbr {
      border: 2px solid #ffb200cc !important;
      border-radius: 100%;
      padding: 4px 6px;
    }
  }

  .allCompleted {
    padding: 0 !important;
    > abbr {
      border: 2px solid #34b53acc !important;
      border-radius: 100%;
      padding: 4px 6px;
    }
  }
`;

export const Checklists = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};

  max-height: 600px;
  overflow-y: auto;
`;

export const NavigateButtons = styled.div`
  position: absolute;
  left: ${theme.size.sm};
  transform: translateY(-50%);
  top: 50%;

  display: flex;
  align-items: center;
  gap: 0;

  @media (max-width: 900px) {
    position: static;
    transform: translateY(0);
    justify-content: center;
    width: 100%;
    margin-bottom: ${theme.size.xxsm};
  }

  button {
    padding: 0;
    background-color: ${theme.color.white};
    color: ${theme.color.black};
    padding: 6px 16px;

    > h6 {
      color: #373a3c;
      font-weight: 400 !important;
    }
  }

  > :first-child {
    button {
      border: 1px solid #ccc;
      border-radius: ${theme.size.xxsm} 0 0 ${theme.size.xxsm};
    }
  }

  > :nth-child(2) {
    button {
      border: 1px solid #ccc;
      border-radius: 0;
      border-left: 0;
      border-right: 0;
    }
  }

  > :last-child {
    button {
      border: 1px solid #ccc;
      border-radius: 0 ${theme.size.xxsm} ${theme.size.xxsm} 0;
    }
  }
`;

export const CalendarDiv = styled.div`
  padding: 2px ${theme.size.xsm} ${theme.size.xsm} ${theme.size.xsm};
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChecklistRow = styled.button<{ status: 'pending' | 'completed' }>`
  all: unset;
  width: 100%;
  padding: ${theme.size.xsm} ${theme.size.xsm} ${theme.size.xsm} ${theme.size.sm};
  border-radius: ${theme.size.xxsm} 0 0 ${theme.size.xxsm};
  background-color: ${({ status }) => (status === 'pending' ? '#FFB200CC' : '#34B53ACC')};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.size.sm};
`;

export const ChecklistRowLeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
`;

export const ChecklistContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const Dropdown = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.xsm};
  border-radius: ${theme.size.xxsm};
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};

  position: absolute;
  right: 8px;
  top: -8px;
  z-index: 9;
`;

export const ChecklistBackground = styled.div`
  position: relative;
  display: flex;
`;

export const ChecklistWrapper = styled.div`
  display: flex;
  width: 100%;

  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
`;

export const DotsButton = styled.div<{ status: 'pending' | 'completed' }>`
  padding: ${theme.size.xsm} ${theme.size.xsm} ${theme.size.xsm} ${theme.size.sm};
  border-radius: 0 ${theme.size.xxsm} ${theme.size.xxsm} 0;
  background-color: ${({ status }) => (status === 'pending' ? '#FFB200CC' : '#34B53ACC')};
`;
