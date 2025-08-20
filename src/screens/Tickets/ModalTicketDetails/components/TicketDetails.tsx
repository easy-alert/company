// REACT
import { useState } from 'react';

// COMPONENTS
import { ListTag } from '@components/ListTag';
import { TicketHistoryActivities } from '@components/TicketHistoryActivities';
import { ImagePreview } from '@components/ImagePreview';
import { Button } from '@components/Buttons/Button';
import { TicketShareButton } from '@components/TicketShareButton';
import { TicketShowResidentButton } from '@components/TicketShowResidentButton';
import { IconButton } from '@components/Buttons/IconButton';
import SignaturePad from '@components/SignaturePad';
import Typography from '@components/Typography';
import { PopoverButton } from '@components/Buttons/PopoverButton';

// GLOBAL UTILS
import { formatDateString } from '@utils/dateFunctions';
import { applyMask } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import type { ITicket } from '@customTypes/ITicket';

// STYLES
import { theme } from '@styles/theme';
import * as Style from '../styles';

interface ITicketDetails {
  ticket: ITicket;
  userId?: string;
  showButtons?: boolean;
  signatureLoading: boolean;
  handleSetView: (viewState: 'details' | 'dismiss') => void;
  handleUpdateOneTicket: (updatedTicket: ITicket, refresh?: boolean, closeModal?: boolean) => void;
  handleUploadSignature: (signature: string) => void;
  handleDeleteTicket: (ticketId: string) => void;
}

function TicketDetails({
  ticket,
  userId,
  showButtons,
  signatureLoading,
  handleSetView,
  handleUpdateOneTicket,
  handleUploadSignature,
  handleDeleteTicket,
}: ITicketDetails) {
  const [openSignaturePad, setOpenSignaturePad] = useState<boolean>(false);

  const disableComment = ticket?.statusName !== 'awaitingToFinish';

  const ticketDetailsRows = [
    {
      label: 'Edificação',
      value: ticket?.building?.name,
    },
    {
      label: 'Apartamento do morador',
      value: ticket?.residentApartment,
    },
    {
      label: 'Nome do morador',
      value: ticket?.residentName,
    },
    {
      label: 'Telefone do morador',
      value: applyMask({ value: ticket?.residentPhone || '', mask: 'TEL' }).value,
    },
    {
      label: 'E-mail do morador',
      value: ticket?.residentEmail,
    },
    {
      label: 'CPF do morador',
      value: applyMask({ value: ticket?.residentCPF || '', mask: 'CPF' }).value,
    },
    {
      label: 'Local da ocorrência',
      place: ticket?.place,
    },
    {
      label: 'Tipo de assistência',
      types: ticket?.types,
    },
    {
      label: 'Data de abertura',
      value: ticket?.createdAt ? formatDateString(ticket.createdAt, 'dd/MM/yyyy - HH:mm') : '',
    },
  ];

  const ticketDetailsDismissedRows = [
    {
      label: 'Indeferido por',
      value: ticket.dismissedBy?.name,
    },
    {
      label: 'Data de indeferimento',
      value: ticket?.dismissedAt ? formatDateString(ticket?.dismissedAt, 'dd/MM/yyyy - HH:mm') : '',
    },
    {
      label: 'Justificativa',
      value: ticket?.dismissReasons?.label,
    },
    { label: 'Observação', value: ticket?.dismissObservation },
  ];

  const handleToggleShowToResident = () => {
    handleUpdateOneTicket({ id: ticket.id, showToResident: !ticket.showToResident });
  };

  return (
    <Style.TicketDetailsContainer>
      <TicketShareButton ticketId={ticket.id} />

      <TicketShowResidentButton
        showToResident={ticket.showToResident}
        handleToggleShowToResident={handleToggleShowToResident}
      />

      <Style.TicketDetailsColumnContainer>
        {ticketDetailsRows.map(({ label, value, place, types }) => {
          if (label === 'Local da ocorrência') {
            return (
              <Style.TicketDetailsColumnContent key={label}>
                <Style.TicketDetailsRowLabel>{label}</Style.TicketDetailsRowLabel>
                <ListTag label={place?.label || ''} color="white" backgroundColor="gray4" />
              </Style.TicketDetailsColumnContent>
            );
          }

          if (label === 'Tipo de assistência') {
            return (
              <Style.TicketDetailsColumnContent key={label}>
                <Style.TicketDetailsRowLabel>{label}</Style.TicketDetailsRowLabel>

                {Array.isArray(types) &&
                  types.map(({ type: ticketType }) => (
                    <ListTag
                      key={ticketType.id}
                      label={ticketType.label}
                      color={ticketType.color}
                      backgroundColor={ticketType.backgroundColor}
                    />
                  ))}
              </Style.TicketDetailsColumnContent>
            );
          }

          return (
            <Style.TicketDetailsColumnContent key={label}>
              <Style.TicketDetailsRowLabel>{label}</Style.TicketDetailsRowLabel>
              <Style.TicketDetailsRowValue>{value}</Style.TicketDetailsRowValue>
            </Style.TicketDetailsColumnContent>
          );
        })}
      </Style.TicketDetailsColumnContainer>

      <Style.TicketDetailsDescriptionContainer>
        <Style.TicketDetailsRowLabel>Descrição</Style.TicketDetailsRowLabel>
        <Style.TicketDetailsRowValue>{ticket.description}</Style.TicketDetailsRowValue>
      </Style.TicketDetailsDescriptionContainer>

      <Style.TicketDetailsImagesContainer>
        <Style.TicketDetailsRowLabel>Imagens</Style.TicketDetailsRowLabel>

        <Style.TicketDetailsImagesContent>
          {ticket?.images?.map((image) => (
            <ImagePreview
              key={image.id}
              src={image.url}
              downloadUrl={image.url}
              imageCustomName={image.name}
              width="128px"
              height="128px"
            />
          ))}
        </Style.TicketDetailsImagesContent>
      </Style.TicketDetailsImagesContainer>

      <TicketHistoryActivities
        ticketId={ticket.id}
        userId={userId}
        disableComment={disableComment}
      />

      {ticket.statusName !== 'open' && (
        <Style.TicketSignatureContainer>
          <Style.TicketSignatureHeader>
            <Typography variant="h3">
              Assinatura:
              <Typography variant="span" fontSize="sm" style={{ textDecoration: 'underline' }}>
                {ticket.residentName}
              </Typography>
            </Typography>

            {!ticket?.signature && (
              <IconButton
                icon={icon.signing}
                onClick={() => setOpenSignaturePad(!openSignaturePad)}
              />
            )}
          </Style.TicketSignatureHeader>

          {!ticket?.signature ? (
            openSignaturePad && (
              <SignaturePad
                loading={signatureLoading}
                onSave={(signature: string) => {
                  handleUploadSignature(signature);
                }}
              />
            )
          ) : (
            <ImagePreview
              src={ticket.signature}
              downloadUrl={ticket.signature}
              imageCustomName="assinatura"
              width="128px"
              height="128px"
            />
          )}
        </Style.TicketSignatureContainer>
      )}

      {ticket?.statusName === 'dismissed' && (
        <Style.TicketDetailsColumnContent>
          <Style.TicketDetailsTitle>Detalhes do indeferimento</Style.TicketDetailsTitle>

          <Style.TicketDetailsDismissedContainer>
            <Style.TicketDetailsDismissedContent>
              {ticketDetailsDismissedRows.map(({ label, value }) => (
                <Style.TicketDetailsColumnContent key={label}>
                  <Style.TicketDetailsRowLabel>{label}</Style.TicketDetailsRowLabel>
                  <Style.TicketDetailsRowValue>{value}</Style.TicketDetailsRowValue>
                </Style.TicketDetailsColumnContent>
              ))}
            </Style.TicketDetailsDismissedContent>
          </Style.TicketDetailsDismissedContainer>
        </Style.TicketDetailsColumnContent>
      )}

      {showButtons && (
        <Style.ButtonsContainer>
          {ticket.statusName === 'open' && (
            <Button
              label="Executar"
              permToCheck="tickets:update"
              bgColor="awaitingToFinish"
              onClick={() =>
                handleUpdateOneTicket({
                  id: ticket.id,
                  statusName: 'awaitingToFinish',
                  userId,
                })
              }
            />
          )}

          {ticket.statusName === 'awaitingToFinish' && (
            <>
              <Button
                label="Voltar para Aberto"
                textColor="actionBlue"
                bgColor="transparent"
                permToCheck="tickets:update"
                onClick={() =>
                  handleUpdateOneTicket({
                    id: ticket.id,
                    statusName: 'open',
                    userId,
                  })
                }
              />

              <Button
                label="Finalizar"
                permToCheck="tickets:update"
                bgColor="finished"
                onClick={() =>
                  handleUpdateOneTicket({
                    id: ticket.id,
                    statusName: 'finished',
                    userId,
                  })
                }
              />
            </>
          )}

          {(ticket.statusName === 'open' || ticket.statusName === 'awaitingToFinish') && (
            <>
              <Button
                label="Reprovar"
                permToCheck="tickets:update"
                bgColor="dismissed"
                onClick={() => handleSetView('dismiss')}
              />
              <PopoverButton
                type="Button"
                label="Excluir"
                permToCheck="tickets:delete"
                actionButtonBgColor={theme.background.dismissed}
                fontWeight="700"
                message={{
                  title: 'Deseja excluir este chamado?',
                  content: 'Atenção, essa ação é irreversível.',
                  contentColor: theme.color.danger,
                }}
                actionButtonClick={() => handleDeleteTicket(ticket.id)}
              />
            </>
          )}
        </Style.ButtonsContainer>
      )}
    </Style.TicketDetailsContainer>
  );
}

export default TicketDetails;
