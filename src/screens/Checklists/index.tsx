import { useEffect, useState } from 'react';

// HOOKS
import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';
import { Select } from '@components/Inputs/Select';
import { NoDataFound } from '@components/NoDataFound';

// GLOBAL UTILS
import { catchHandler, requestListIntervals } from '@utils/functions';

// GLOBAL ASSETS
import IconPlus from '@assets/icons/IconPlus';

// GLOBAL TYPES
import type { ITimeInterval } from '@utils/types';

// COMPONENTS
import { ModalChecklistCreate } from './ModalChecklistCreate';
import { MiniCalendarComponent } from './MiniCalendarComponent';
import { ChecklistRowComponent } from './ChecklistRowComponent';
import { ModalChecklistDetails } from './ModalChecklistDetails';
import { ModalChecklistTemplate } from './ModalChecklistTemplate';

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
  inProgress: { date: string }[];
  completed: { date: string }[];
}

export type TModalNames =
  | 'modalSendMaintenanceReport'
  | 'modalMaintenanceDetails'
  | 'modalCreateOccasionalMaintenance'
  | 'modalChecklistCreate'
  | 'modalChecklistDetails'
  | 'modalChecklistTemplate';

export const Checklists = () => {
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: true });

  const [checklists, setChecklists] = useState<IChecklist[]>([]);
  const [buildingNanoId, setBuildingNanoId] = useState<string>('');

  const [calendarDates, setCalendarDates] = useState<ICalendarDates>({
    pending: [],
    inProgress: [],
    completed: [],
  });
  const [date, setDate] = useState(new Date());
  const [timeIntervals, setTimeIntervals] = useState<ITimeInterval[]>([]);

  const [checklistId, setChecklistId] = useState<string>('');

  const [modalChecklistCreate, setModalChecklistCreate] = useState(false);
  const [modalChecklistDetails, setModalChecklistDetails] = useState(false);
  const [modalChecklistTemplate, setModalChecklistTemplate] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  const handleModals = (modal: string, modalState: boolean) => {
    switch (modal) {
      case 'modalChecklistCreate':
        setModalChecklistCreate(modalState);
        break;
      case 'modalChecklistDetails':
        setModalChecklistDetails(modalState);
        break;
      case 'modalChecklistTemplate':
        setModalChecklistTemplate(modalState);
        break;

      default:
        break;
    }
  };

  const handleSelectedChecklistId = (id: string) => {
    setChecklistId(id);
  };

  const findManyChecklists = async () => {
    setLoading(true);

    await Api.get(`/checklists/list/${buildingNanoId}/${date}`)
      .then((res) => {
        setChecklists(res.data.checklists);
      })
      .catch(catchHandler)
      .finally(() => setLoading(false));
  };

  const findManyChecklistDates = async () => {
    await Api.get(`/checklists/calendar/${buildingNanoId}/dates`)
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
  }, [buildingNanoId, date, refresh]);

  useEffect(() => {
    if (buildingNanoId) {
      findManyChecklistDates();
    }
  }, [buildingNanoId, date, refresh]);

  return (
    <>
      {modalChecklistCreate && (
        <ModalChecklistCreate
          buildingsForSelect={buildingsForSelect}
          handleModals={handleModals}
          handleRefresh={handleRefresh}
        />
      )}

      {modalChecklistDetails && checklistId && (
        <ModalChecklistDetails
          checklistId={checklistId}
          handleModals={handleModals}
          handleRefresh={handleRefresh}
        />
      )}

      {modalChecklistTemplate && <ModalChecklistTemplate handleModals={handleModals} />}

      <Style.Container>
        <Style.Header>
          <Style.HeaderLeftSide>
            <h2>Checklists</h2>

            <Select
              arrowColor="primary"
              id="customFilterForChecklist"
              disabled={buildingsForSelect.length === 0}
              selectPlaceholderValue=" "
              value={buildingNanoId}
              onChange={(evt) => setBuildingNanoId(evt.target.value)}
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
            label="Modelo de checklist"
            icon={<IconPlus strokeColor="primary" />}
            onClick={() => handleModals('modalChecklistTemplate', true)}
          />

          <IconButton
            label="Checklist"
            icon={<IconPlus strokeColor="primary" />}
            onClick={() => handleModals('modalChecklistCreate', true)}
          />
        </Style.Header>

        <Style.Content>
          <Style.DateHeader>
            <Style.NavigateButtons>
              <Button disable={loading} label="Hoje" onClick={() => setDate(new Date())} />

              <Button
                disable={loading}
                label="Anterior"
                onClick={() => setDate((prev) => new Date(prev.setDate(prev.getDate() - 1)))}
              />

              <Button
                disable={loading}
                label="Próximo"
                onClick={() => setDate((prev) => new Date(prev.setDate(prev.getDate() + 1)))}
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
                checklists?.map((checklist) => (
                  <ChecklistRowComponent
                    key={checklist.id}
                    checklist={checklist}
                    buildingsForSelect={buildingsForSelect}
                    handleModals={handleModals}
                    handleSelectedChecklistId={handleSelectedChecklistId}
                    onThenRequest={async () => {
                      findManyChecklists();
                      findManyChecklistDates();
                    }}
                  />
                ))}

              {!loading && checklists.length === 0 && (
                <NoDataFound
                  label={
                    buildingNanoId
                      ? 'Nenhum checklist encontrado'
                      : 'Selecione uma edificação para visualizar'
                  }
                  height="100%"
                />
              )}
            </Style.Checklists>
          </Style.ContentRow>
        </Style.Content>
      </Style.Container>
    </>
  );
};
