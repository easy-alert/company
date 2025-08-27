// REACT
import { useState } from 'react';

// GLOBALS COMPONENTS
import { TextArea } from '@components/Inputs/TextArea';
import { Button } from '@components/Buttons/Button';
import { Select } from '@components/Inputs/Select';

// GLOBALS UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBALS STYLES
import { theme } from '@styles/theme';

// GLOBALS TYPES
import type { ITicket } from '@customTypes/ITicket';
import type { ITicketDismissReason } from '@customTypes/ITicketDismissReason';

// STYLES
import * as Style from '../styles';

interface IDismissTicket {
  ticketId: string;
  userId?: string;
  dismissReasons: ITicketDismissReason[];
  handleSetView: (viewState: 'details' | 'dismiss') => void;
  handleUpdateOneTicket: (updatedTicket: ITicket) => void;
}

function TicketDismiss({
  ticketId,
  userId,
  dismissReasons,
  handleSetView,
  handleUpdateOneTicket,
}: IDismissTicket) {
  const [dismissReasonName, setDismissReasonName] = useState<string>('');
  const [dismissObservation, setDismissObservation] = useState<string>('');

  const handleSubmitDismissTicket = () => {
    if (!dismissReasonName) {
      handleToastify({
        status: 400,
        data: {
          ServerMessage: {
            message: 'Por favor, selecione um motivo para a reprovação.',
          },
        },
      });

      return;
    }

    if (dismissReasonName === 'other' && !dismissObservation) {
      handleToastify({
        status: 400,
        data: {
          ServerMessage: {
            message: 'Por favor, especifique o motivo da reprovação.',
          },
        },
      });

      return;
    }

    handleUpdateOneTicket({
      id: ticketId,
      statusName: 'dismissed',
      dismissReasonName,
      dismissObservation,
      dismissedById: userId,
      dismissedAt: new Date().toISOString(),
    });
  };

  return (
    <Style.DismissTicketContainer>
      <Style.DismissTicketText>
        Para indeferir esse chamado você deve informar o motivo do mesmo, favor preencha o campo
        abaixo:
      </Style.DismissTicketText>

      <Select onChange={(evt) => setDismissReasonName(evt.target.value)}>
        <option value="">Selecione um motivo...</option>

        {dismissReasons.map((reason) => (
          <option key={reason.name} value={reason.name}>
            {reason.label}
          </option>
        ))}
      </Select>

      <TextArea
        name="activity"
        placeholder="Observações sobre o motivo da reprovação"
        value={dismissObservation}
        onChange={(evt) => setDismissObservation(evt.target.value)}
      />

      <Style.ButtonsContainer>
        <Button
          label="Cancelar"
          bgColor="white"
          textColor={theme.color.actionBlue}
          onClick={() => {
            setDismissReasonName('');
            setDismissObservation('');
            handleSetView('details');
          }}
        />
        <Button
          label="Reprovar"
          bgColor={theme.background.dismissed}
          onClick={() => handleSubmitDismissTicket()}
        />
      </Style.ButtonsContainer>
    </Style.DismissTicketContainer>
  );
}

export default TicketDismiss;
