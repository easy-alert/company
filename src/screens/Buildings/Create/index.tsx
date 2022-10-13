/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// COMPONENTS
import { ReturnButton } from '../../../components/Buttons/ReturnButton';

// STYLES
import * as Style from './styles';

export const BuildingCreate = () => {
  const locales = {
    'pt-BR': ptBR,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const events = [
    {
      id: 0,
      title: 'Board meeting',
      start: new Date('Tue Oct 11 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
      end: new Date('Tue Oct 11 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
    },
    {
      id: 1,
      title: 'Board meeting',
      start: new Date('Tue Oct 12 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
      end: new Date('Tue Oct 12 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
    },
    {
      id: 2,
      title: 'Board meeting',
      start: new Date('Tue Oct 13 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
      end: new Date('Tue Oct 13 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
    },
    {
      id: 3,
      title: 'Board meeting',
      start: new Date('Tue Oct 14 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
      end: new Date('Tue Oct 14 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
    },
    {
      id: 4,
      title: 'Board meeting',
      start: new Date('Tue Oct 15 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
      end: new Date('Tue Oct 15 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
    },
    {
      id: 5,
      title: 'Board meeting',
      start: new Date('Tue Oct 16 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
      end: new Date('Tue Oct 16 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
    },
    {
      id: 6,
      title: 'Board meeting',
      start: new Date('Tue Oct 17 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
      end: new Date('Tue Oct 17 2022 13:31:46 GMT-0300 (Horário Padrão de Brasília)'),
    },
    {
      id: 7,
      title: 'Board meeting aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      start: new Date('Tue Oct 18 2022 19:31:46 GMT-0300 (Horário Padrão de Brasília)'),
      end: new Date('Tue Oct 18 2022 19:31:46 GMT-0300 (Horário Padrão de Brasília)'),
    },
  ];

  const messages = {
    date: 'Data',
    time: 'Tempo',
    event: 'Evento',
    allDay: 'Dia todo',
    week: 'Semana',
    work_week: 'Semana de trabalho',
    day: 'Dia',
    month: 'Mês',
    previous: 'Anterior',
    next: 'Próximo',
    yesterday: 'Ontem',
    tomorrow: 'Amanhã',
    today: 'Hoje',
    agenda: 'Agenda',
    noEventsInRange: 'Nenhum evento encontrado.',

    showMore: (total: any) => `+${total}`,
  };

  const onSelectEvent = useCallback((calEvent: any) => {
    // eslint-disable-next-line no-console
    console.log(calEvent.id);
  }, []);

  return (
    <Style.Container>
      <Style.Header>
        <h2>Cadastrar edificação</h2>
      </Style.Header>
      <ReturnButton path="/buildings" />
      <Style.CalendarWrapper>
        <Calendar
          culture="pt-BR"
          messages={messages}
          localizer={localizer}
          events={events}
          style={{ height: 660 }}
          showAllEvents
          onSelectEvent={onSelectEvent}
        />
      </Style.CalendarWrapper>
    </Style.Container>
  );
};
