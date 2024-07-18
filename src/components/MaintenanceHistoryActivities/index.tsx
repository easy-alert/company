import { useRef, useState } from 'react';
import { ModalCreateAndViewActivities } from './ModalCreateAndViewActivities';
import { CustomBackground } from '../CustomModal/CustomBackground';
import { Button } from '../Buttons/Button';
import { ButtonContainer } from './styles';

interface IMaintenanceHistoryActivities {
  maintenanceHistoryId: string;
}

export const MaintenanceHistoryActivities = ({
  maintenanceHistoryId,
}: IMaintenanceHistoryActivities) => {
  const [modalCreateAndViewActivitiesOpen, setModalCreateAndViewActivitiesOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* PRA SCROLLAR A TELA PRA CIMA QUANDO ABRIR A MODAL, PORQUE SE NAO APARECE FORA DA TELA */}
      <div ref={ref} style={{ position: 'absolute', top: '-10000px' }} />
      {modalCreateAndViewActivitiesOpen && (
        <ModalCreateAndViewActivities
          setModal={setModalCreateAndViewActivitiesOpen}
          maintenanceHistoryId={maintenanceHistoryId}
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
