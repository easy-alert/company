/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface IMiniCalendar {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

type IValuePiece = Date | null;
type IValue = IValuePiece | [IValuePiece, IValuePiece];

export const MiniCalendar = ({ currentDate, setCurrentDate }: IMiniCalendar) => {
  const [value, onChange] = useState<IValue>(currentDate);

  useEffect(() => {
    onChange(currentDate);
  }, [currentDate]);

  return (
    <ReactCalendar
      key={currentDate.toISOString()}
      onChange={onChange}
      value={value}
      calendarType="gregory"
      locale="pt-BR"
      onClickDay={(dateChange) => {
        setCurrentDate(dateChange);
      }}
    />
  );
};
