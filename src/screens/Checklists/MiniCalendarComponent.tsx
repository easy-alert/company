/* eslint-disable no-nested-ternary */
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
    />
  );
};
