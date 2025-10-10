import { useState, useContext } from 'react';
import { AuthContext } from '@contexts/Auth/AuthContext';
// import { Button } from '@components/Buttons/Button';
// import { MaintenancesCalendar } from '@screens/Calendar/CalendarMaintenance';
// import { CalendarTickets } from './CalendarTickets';
import { EventCalendar } from './EventCalendar';

import * as Style from './styles';

export const Calendar = () => {
  const { account } = useContext(AuthContext);

  // const userPermissions = account?.User?.Permissions?.map((p) => p.Permission.name) || [];
  // const isAdmin = userPermissions.includes('admin:company');

  // const hasCalendarMaintenances = userPermissions.includes('access:calendarMaintenances');
  // const hasTickets = userPermissions.includes('access:tickets');

  // // Determina qual aba mostrar por padrão baseado nas permissões
  // const getDefaultCalendarType = (): 'maintenance' | 'ticket' => {
  //   if (hasCalendarMaintenances) return 'maintenance';
  //   if (hasTickets) return 'ticket';
  //   return 'maintenance'; // fallback
  // };

  // const [calendarType, setCalendarType] = useState<'maintenance' | 'ticket' | 'checklist'>(
  //   getDefaultCalendarType(),
  // );

  return (
    <Style.Container>
      {/* <Style.ButtonGroup>
        {(hasCalendarMaintenances || isAdmin) && (
          <Style.ButtonWrapper
            active={calendarType === 'maintenance'}
            onClick={() => setCalendarType('maintenance')}
          >
            <Button label="Manutenção" />
          </Style.ButtonWrapper>
        )}

        {(hasTickets || isAdmin) && (
          <Style.ButtonWrapper
            active={calendarType === 'ticket'}
            onClick={() => setCalendarType('ticket')}
          >
            <Button label="Chamados" />
          </Style.ButtonWrapper>
        )}
      </Style.ButtonGroup> */}

      <Style.Container>
        <EventCalendar />
      </Style.Container>

      {/* {calendarType === 'maintenance' && (hasCalendarMaintenances || isAdmin) && (
        <MaintenancesCalendar />
      )}
      {calendarType === 'ticket' && (hasTickets || isAdmin) && <CalendarTickets />} */}
    </Style.Container>
  );
};
