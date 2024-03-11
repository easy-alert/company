/* eslint-disable no-nested-ternary */
import { addDays, differenceInCalendarDays } from 'date-fns';
import { useEffect, useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface IMiniCalendar {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

type IValuePiece = Date | null;
type IValue = IValuePiece | [IValuePiece, IValuePiece];

export const MiniCalendarComponent = ({ date, setDate }: IMiniCalendar) => {
  const [value, onChange] = useState<IValue>(date);

  useEffect(() => {
    onChange(date);
  }, [date]);

  const now = new Date();
  const tomorrow = addDays(now, 1);
  const in3Days = addDays(now, 3);
  const in5Days = addDays(now, 5);

  const in2Days = addDays(now, 2);
  const in4Days = addDays(now, 4);
  const in6Days = addDays(now, 6);

  const completedDates = [in2Days, in4Days, in6Days];
  const pendingDates = [tomorrow, in3Days, in5Days];

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
        if (view === 'month' && pendingDates.find((dDate) => isSameDay(dDate, date))) {
          return 'somePending';
        }
        if (view === 'month' && completedDates.find((dDate) => isSameDay(dDate, date))) {
          return 'allCompleted';
        }
        return null;
      }}
    />
  );
};
