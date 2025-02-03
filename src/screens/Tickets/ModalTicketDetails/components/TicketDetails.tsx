// REACT
import { useState } from 'react';

// COMPONENTS
import { ListTag } from '@components/ListTag';
import { TicketHistoryActivities } from '@components/TicketHistoryActivities';
import { ImagePreview } from '@components/ImagePreview';
import { Button } from '@components/Buttons/Button';
import { TicketShareButton } from '@components/TicketShareButton';
import { TicketShowResidentButton } from '@components/TicketShowResidentButton';
import { Input } from '@components/Inputs/Input';
import { IconButton } from '@components/Buttons/IconButton';
import SignaturePad from '@components/SignaturePad';
import Typography from '@components/Typography';

// GLOBAL THEMES
import { theme } from '@styles/theme';

// GLOBAL UTILS
import { formatDateString } from '@utils/dateFunctions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import type { ITicket } from '@customTypes/ITicket';

// STYLES
import * as Style from '../styles';

interface ITicketDetails {
  ticket: ITicket;
  userId?: string;
  showButtons?: boolean;
  signatureLoading: boolean;
  handleSetView: (viewState: 'details' | 'dismiss') => void;
  handleUpdateOneTicket: (updatedTicket: ITicket, refresh?: boolean, closeModal?: boolean) => void;
  handleUploadSignature: (signature: string) => void;
}

function TicketDetails({
  ticket,
  userId,
  showButtons,
  signatureLoading,
  handleSetView,
  handleUpdateOneTicket,
  handleUploadSignature,
}: ITicketDetails) {
  const [collaborator, setCollaborator] = useState<string>('');
  const [openSignaturePad, setOpenSignaturePad] = useState<boolean>(false);

  const disableComment = ticket?.statusName !== 'awaitingToFinish';

  const ticketDetailsRows = {
    leftColumn: [
      {
        label: 'Edificação',
        value: ticket?.building?.name,
      },
      {
        label: 'Nome do morador',
        value: ticket?.residentName,
      },
      {
        label: 'Apartamento do morador',
        value: ticket?.residentApartment,
      },
      {
        label: 'E-mail do morador',
        value: ticket?.residentEmail,
      },
    ],
    rightColumn: [
      {
        label: 'Descrição',
        value: ticket?.description,
      },
      {
        label: 'Local da ocorrência',
        place: ticket?.place,
      },
      {
        label: 'Tipo da manutenção',
        types: ticket?.types,
      },
      {
        label: 'Data de abertura',
        value: ticket?.createdAt ? formatDateString(ticket.createdAt, 'dd/MM/yyyy - HH:mm') : '',
      },
    ],
  };

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
        <Style.TicketDetailsLeftColumn>
          {ticketDetailsRows.leftColumn.map(({ label, value }) => (
            <Style.TicketDetailsColumnContent key={label}>
              <Style.TicketDetailsRowLabel>{label}</Style.TicketDetailsRowLabel>
              <Style.TicketDetailsRowValue>{value}</Style.TicketDetailsRowValue>
            </Style.TicketDetailsColumnContent>
          ))}
        </Style.TicketDetailsLeftColumn>

        <Style.TicketDetailsRightColumn>
          {ticketDetailsRows.rightColumn.map(({ label, value, place, types }) => {
            if (label === 'Local da ocorrência') {
              return (
                <Style.TicketDetailsColumnContent key={label}>
                  <Style.TicketDetailsRowLabel>{label}</Style.TicketDetailsRowLabel>
                  <ListTag
                    label={place?.label || ''}
                    color="white"
                    backgroundColor={theme.color.gray4}
                  />
                </Style.TicketDetailsColumnContent>
              );
            }

            if (label === 'Tipo da manutenção') {
              return (
                <Style.TicketDetailsColumnContent key={label}>
                  <Style.TicketDetailsRowLabel>{label}</Style.TicketDetailsRowLabel>
                  {Array.isArray(types) &&
                    types.map(({ type }) => (
                      <ListTag
                        key={type.id}
                        label={type.label}
                        color={type.color}
                        backgroundColor={type.backgroundColor}
                      />
                    ))}
                </Style.TicketDetailsColumnContent>
              );
            }

            return (
              <Style.TicketDetailsColumnContent key={label}>
                <Style.TicketDetailsRowLabel>{label}</Style.TicketDetailsRowLabel>
                <Style.TicketDetailsRowValue>
                  {!Array.isArray(value) && value}
                </Style.TicketDetailsRowValue>
              </Style.TicketDetailsColumnContent>
            );
          })}
        </Style.TicketDetailsRightColumn>
      </Style.TicketDetailsColumnContainer>

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
        <Style.TicketFinalSolutionContainer>
          <Typography variant="h3" marginBottom="sm">
            Colaborador
          </Typography>

          <Style.TicketFinalSolutionContent>
            {!ticket?.collaborator ? (
              <>
                <Input
                  label=""
                  typeDatePlaceholderValue="Finalizar solução"
                  value={collaborator}
                  onChange={(e) => setCollaborator(e.target.value)}
                />

                <Button
                  label="Salvar"
                  bgColor="transparent"
                  textColor="finished"
                  onClick={() =>
                    handleUpdateOneTicket({ id: ticket.id, collaborator }, false, false)
                  }
                />
              </>
            ) : (
              <Style.TicketDetailsRowValue>{ticket.collaborator}</Style.TicketDetailsRowValue>
            )}
          </Style.TicketFinalSolutionContent>
        </Style.TicketFinalSolutionContainer>
      )}

      {ticket.statusName !== 'open' && (
        <Style.TicketSignatureContainer>
          <Style.TicketSignatureHeader>
            <Typography variant="h3">
              Assinatura:{' '}
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
              bgColor={theme.background.awaitingToFinish}
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
                permToCheck="tickets:update"
                bgColor="white"
                textColor={theme.color.actionBlue}
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
                bgColor={theme.background.finished}
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
            <Button
              label="Reprovar"
              permToCheck="tickets:update"
              bgColor={theme.background.dismissed}
              onClick={() => handleSetView('dismiss')}
            />
          )}
        </Style.ButtonsContainer>
      )}
    </Style.TicketDetailsContainer>
  );
}

export default TicketDetails;
