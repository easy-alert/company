import { forwardRef } from 'react';

// LIBS
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';

// TYPES
import type { ICalendarEvent } from '@customTypes/ICalendarTicket';

// GLOBAL STYLES
import * as Style from './styles';

export interface ICalendarProps {
  events: ICalendarEvent[];
  eventContent?: (arg: EventContentArg) => JSX.Element;
  eventClick?: (info: EventClickArg) => void;
  initialDate?: Date;
  initialView?: string;
  onDatesSet?: (arg: {
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;
    view: { type: string };
  }) => void;
  height?: number;
  view?: string;
  disableCalendarNextButton?: boolean;
  yearChangeloading?: boolean;
}

export const Calendar = forwardRef<FullCalendar, ICalendarProps>(
  (
    {
      events,
      eventContent,
      eventClick,
      initialDate = new Date(),
      initialView = 'dayGridMonth',
      onDatesSet,
      height = 750,
      view = 'dayGridMonth',
      disableCalendarNextButton = false,
      yearChangeloading = false,
    },
    ref,
  ) => (
    <Style.CalendarWrapper
      view={view}
      disableCalendarNextButton={disableCalendarNextButton}
      yearChangeloading={yearChangeloading}
    >
      <FullCalendar
        ref={ref}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={initialView}
        initialDate={initialDate}
        locale={ptBrLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridYear',
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          prev: 'Anterior',
          next: 'Próximo',
        }}
        views={{
          dayGridMonth: { buttonText: 'Mês' },
          dayGridWeek: { buttonText: 'Semana' },
          dayGridYear: {
            type: 'dayGrid',
            duration: { years: 1 },
            buttonText: 'Ano',
          },
        }}
        events={events}
        eventContent={eventContent}
        eventClick={eventClick}
        datesSet={onDatesSet}
        selectable
        dayMaxEvents={false}
        eventDisplay="block"
        height={height}
      />
    </Style.CalendarWrapper>
  ),
);

Calendar.displayName = 'Calendar';
