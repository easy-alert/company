/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
import { differenceInCalendarDays } from 'date-fns';
import { useEffect, useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ICalendarDates } from '.';

interface IMiniCalendar {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  calendarDates: ICalendarDates;
}

type IValuePiece = Date | null;
type IValue = IValuePiece | [IValuePiece, IValuePiece];

export const MiniCalendarComponent = ({ date, setDate, calendarDates }: IMiniCalendar) => {
  const [value, onChange] = useState<IValue>(date);

  useEffect(() => {
    onChange(date);
  }, [date]);

  function isSameDay(a: Date, b: Date) {
    return differenceInCalendarDays(a, b) === 0;
  }

  return (
    <ReactCalendar
      key={date.toISOString()}
      onChange={onChange}
      value={value}
      calendarType="gregory"
      locale="pt-BR"
      onClickDay={(dateChange) => {
        setDate(dateChange);
      }}
      // eslint-disable-next-line no-shadow
      tileClassName={({ date, view }) => {
        if (
          view === 'month' &&
          calendarDates.pending.find((dDate) => isSameDay(new Date(dDate.date), date))
        ) {
          return 'somePending';
        }

        if (
          view === 'month' &&
          calendarDates.completed.find((dDate) => isSameDay(new Date(dDate.date), date))
        ) {
          return 'allCompleted';
        }
        return null;
      }}
    />
  );
};
