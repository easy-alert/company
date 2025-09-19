import { useState } from 'react';
import { Button } from '@components/Buttons/Button';
import { MaintenancesCalendar } from '@screens/Calendar/CalendarMaintenance';
import { CalendarTickets } from './CalendarTickets';
import * as Style from './styles';

export const Calendar = () => {
  const [calendarType, setCalendarType] = useState<'maintenance' | 'ticket' | 'checklist'>(
    'maintenance',
  );

  return (
    <Style.Container>
      <Style.ButtonGroup>
        <Style.ButtonWrapper
          active={calendarType === 'maintenance'}
          onClick={() => setCalendarType('maintenance')}
        >
          <Button label="Manutenção" />
        </Style.ButtonWrapper>

        <Style.ButtonWrapper
          active={calendarType === 'ticket'}
          onClick={() => setCalendarType('ticket')}
        >
          <Button label="Chamados" />
        </Style.ButtonWrapper>
      </Style.ButtonGroup>

      {calendarType === 'maintenance' && <MaintenancesCalendar />}
      {calendarType === 'ticket' && <CalendarTickets />}
    </Style.Container>
  );
};
