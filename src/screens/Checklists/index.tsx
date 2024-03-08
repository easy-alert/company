import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { icon } from '../../assets/icons';
import { IconButton } from '../../components/Buttons/IconButton';
import { Select } from '../../components/Inputs/Select';
import { MiniCalendarComponent } from './MiniCalendarComponent';
import * as Style from './styles';
import { Button } from '../../components/Buttons/Button';
import { NoDataFound } from '../../components/NoDataFound';
import { ModalCreateChecklist } from './ModalCreateChecklist';
import { ITimeInterval } from '../../utils/types';
import { catchHandler, requestListIntervals } from '../../utils/functions';
import { Api } from '../../services/api';
import { IBuildingOptions } from '../Calendar/types';
// eslint-disable-next-line import/no-cycle
import { ChecklistRowComponent } from './ChecklistRowComponent';

export interface IChecklist {
  id: string;
  name: string;
  syndic: { name: string };
  status: 'pending' | 'completed';
}

export const Checklists = () => {
  const [date, setDate] = useState(new Date());
  const [modalCreateChecklistOpen, setModalCreateChecklistOpen] = useState(false);
  const [timeIntervals, setTimeIntervals] = useState<ITimeInterval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [buildingId, setBuildingId] = useState<string>('');
  const [buildingName, setBuildingName] = useState<string>('');
  const [buildingOptions, setBuildingOptions] = useState<IBuildingOptions[]>([]);
  const [checklists, setChecklists] = useState<IChecklist[]>([]);

  const findManyChecklists = async () => {
    setLoading(true);

    await Api.get(`/checklists/${buildingId}/${date}`)
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

  const findBuildingsForSelect = async () => {
    await Api.get('/buildings/listforselect')
      .then((res) => {
        setBuildingOptions(res.data);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    requestListIntervals({ setTimeIntervals });
    findBuildingsForSelect();
  }, []);

  useEffect(() => {
    if (buildingId) {
      findManyChecklists();
    }
  }, [buildingId, date]);

  return (
    <>
      {modalCreateChecklistOpen && (
        <ModalCreateChecklist
          setModal={setModalCreateChecklistOpen}
          timeIntervals={timeIntervals}
          onThenRequest={findManyChecklists}
          buildingId={buildingId}
          buildingName={buildingName}
        />
      )}
      <Style.Container>
        <Style.Header>
          <Style.HeaderLeftSide>
            <h2>Checklists</h2>
            <Select
              disabled={loading}
              selectPlaceholderValue=" "
              value={buildingId}
              onChange={(evt) => {
                const building = buildingOptions.find(({ id }) => id === evt.target.value);
                setBuildingName(building?.name ?? '');
                setBuildingId(evt.target.value);
              }}
            >
              <option value="" disabled hidden>
                Selecione
              </option>
              {buildingOptions.map(({ id, name }) => (
                <option value={id} key={id}>
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
              if (!buildingId) {
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
              <MiniCalendarComponent date={date} setDate={setDate} />
            </Style.CalendarDiv>
            <Style.Checklists>
              {!loading &&
                checklists.map((checklist) => (
                  <ChecklistRowComponent key={checklist.id} checklist={checklist} />
                ))}

              {!loading && checklists.length === 0 && !buildingId && (
                <NoDataFound label="Selecione uma edificação para visualizar" height="100%" />
              )}
              {!loading && checklists.length === 0 && buildingId && (
                <NoDataFound label="Nenhum checklist encontrado" height="100%" />
              )}
            </Style.Checklists>
          </Style.ContentRow>
        </Style.Content>
      </Style.Container>
    </>
  );
};
