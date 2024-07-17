import { useEffect, useRef, useState } from 'react';
import { ModalCreateAndViewActivities } from './ModalCreateAndViewActivities';
import { Api } from '../../services/api';
import { CustomBackground } from '../CustomModal/CustomBackground';
import { Button } from '../Buttons/Button';
import { catchHandler } from '../../utils/functions';
import { IActivity } from './types';
import { ButtonContainer } from './styles';

interface IMaintenanceHistoryActivities {
  maintenanceHistoryId: string;
}

export const MaintenanceHistoryActivities = ({
  maintenanceHistoryId,
}: IMaintenanceHistoryActivities) => {
  const [modalCreateAndViewActivitiesOpen, setModalCreateAndViewActivitiesOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [activities, setActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const findMaintenanceHistoryActivities = async () => {
    await Api.get(`/suppliers/selected/${maintenanceHistoryId}`)
      .then((res) => {
        setActivities([]);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    findMaintenanceHistoryActivities();
  }, []);

  return (
    <>
      {/* PRA SCROLLAR A TELA PRA CIMA QUANDO ABRIR A MODAL, PORQUE SE NAO APARECE FORA DA TELA */}
      <div ref={ref} style={{ position: 'absolute', top: '-10000px' }} />
      {modalCreateAndViewActivitiesOpen && (
        <ModalCreateAndViewActivities
          setModal={setModalCreateAndViewActivitiesOpen}
          maintenanceHistoryId={maintenanceHistoryId}
          loading={loading}
          activities={activities}
          findMaintenanceHistoryActivitiesCall={findMaintenanceHistoryActivities}
        />
      )}

      {modalCreateAndViewActivitiesOpen && (
        <CustomBackground
          zIndex={19}
          onClick={() => {
            setModalCreateAndViewActivitiesOpen(false);
          }}
        />
      )}

      <ButtonContainer>
        <Button
          center
          label="Verificar atividades"
          outlined
          onClick={() => {
            ref.current?.scrollIntoView();
            setModalCreateAndViewActivitiesOpen(true);
          }}
        />
      </ButtonContainer>
    </>
  );
};
