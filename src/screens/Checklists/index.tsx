// REACT
import { useEffect, useState } from 'react';

// LIBS
import { toast } from 'react-toastify';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Select } from '@components/Inputs/Select';
import { Button } from '@components/Buttons/Button';
import { NoDataFound } from '@components/NoDataFound';

// GLOBAL UTILS
import { catchHandler, requestListIntervals } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import type { ITimeInterval } from '@utils/types';

// COMPONENTS
import { MiniCalendarComponent } from './MiniCalendarComponent';
import { ModalCreateChecklist } from './ModalCreateChecklist';
import { ChecklistRowComponent } from './ChecklistRowComponent';

// STYLES
import * as Style from './styles';

export interface IChecklist {
  id: string;
  name: string;
  buildingId: string;
  syndic: { name: string } | null;
  status: 'pending' | 'completed';
}

export interface ICalendarDates {
  pending: { date: string }[];
  completed: { date: string }[];
}

export const Checklists = () => {
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });

  const [date, setDate] = useState(new Date());
  const [modalCreateChecklistOpen, setModalCreateChecklistOpen] = useState(false);
  const [timeIntervals, setTimeIntervals] = useState<ITimeInterval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [buildingNanoId, setBuildingNanoId] = useState<string>('');
  const [buildingName, setBuildingName] = useState<string>('');
  const [checklists, setChecklists] = useState<IChecklist[]>([]);
  const [calendarDates, setCalendarDates] = useState<ICalendarDates>({
    completed: [],
    pending: [],
  });

  const findManyChecklists = async () => {
    setLoading(true);

    await Api.get(`/checklists/${buildingNanoId}/${date}`)
      .then((res) => {
        setChecklists(res.data.checklists);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const findManyChecklistDates = async () => {
    await Api.get(`/checklists/${buildingNanoId}/calendar/dates`)
      .then((res) => {
        setCalendarDates(res.data.calendarDates);
      })
      .catch((err) => {
        // Pra não dar toast duplo
        if (err.response.status !== 403) {
          catchHandler(err);
        }
      });
  };

  useEffect(() => {
    requestListIntervals({ setTimeIntervals });
  }, []);

  useEffect(() => {
    if (buildingNanoId) {
      findManyChecklists();
    }
  }, [buildingNanoId, date]);

  useEffect(() => {
    if (buildingNanoId) {
      findManyChecklistDates();
    }
  }, [buildingNanoId]);

  return (
    <>
      {modalCreateChecklistOpen && (
        <ModalCreateChecklist
          setModal={setModalCreateChecklistOpen}
          timeIntervals={timeIntervals}
          onThenRequest={async () => {
            findManyChecklists();
            findManyChecklistDates();
          }}
          buildingNanoId={buildingNanoId}
          buildingName={buildingName}
        />
      )}

      <Style.Container>
        <Style.Header>
          <Style.HeaderLeftSide>
            <h2>Checklists</h2>

            <Select
              id="customFilterForChecklist"
              disabled={buildingsForSelect.length === 0}
              selectPlaceholderValue=" "
              value={buildingNanoId}
              onChange={(evt) => {
                const building = buildingsForSelect.find(
                  ({ nanoId }) => nanoId === evt.target.value,
                );

                setBuildingName(building?.name ?? '');
                setBuildingNanoId(evt.target.value);
              }}
            >
              <option value="" disabled hidden>
                Selecione
              </option>

              {buildingsForSelect.map(({ nanoId, name }) => (
                <option value={nanoId} key={nanoId}>
                  {name}
                </option>
              ))}
            </Select>
          </Style.HeaderLeftSide>

          <IconButton
            disabled={loading}
            icon={icon.plusWithBg}
            label="Cadastrar"
            onClick={() => {
              if (!buildingNanoId) {
                toast.error('Selecione uma edificação.');
                return;
              }

              setModalCreateChecklistOpen(true);
            }}
          />
        </Style.Header>

        <Style.Content>
          <Style.DateHeader>
            <Style.NavigateButtons>
              <Button
                disable={loading}
                label="Hoje"
                onClick={() => {
                  setDate(new Date());
                }}
              />

              <Button
                disable={loading}
                label="Anterior"
                onClick={() => {
                  setDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
                }}
              />

              <Button
                disable={loading}
                label="Próximo"
                onClick={() => {
                  setDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
                }}
              />
            </Style.NavigateButtons>

            <p className="p1">
              {date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </Style.DateHeader>

          <Style.ContentRow>
            <Style.CalendarDiv style={{ pointerEvents: loading ? 'none' : 'auto' }}>
              <MiniCalendarComponent date={date} setDate={setDate} calendarDates={calendarDates} />
            </Style.CalendarDiv>

            <Style.Checklists>
              {!loading &&
                checklists.map((checklist) => (
                  <ChecklistRowComponent
                    key={checklist.id}
                    checklist={checklist}
                    timeIntervals={timeIntervals}
                    onThenRequest={async () => {
                      findManyChecklists();
                      findManyChecklistDates();
                    }}
                  />
                ))}

              {!loading && checklists.length === 0 && !buildingNanoId && (
                <NoDataFound label="Selecione uma edificação para visualizar" height="100%" />
              )}
              {!loading && checklists.length === 0 && buildingNanoId && (
                <NoDataFound label="Nenhum checklist encontrado" height="100%" />
              )}
            </Style.Checklists>
          </Style.ContentRow>
        </Style.Content>
      </Style.Container>
    </>
  );
};
