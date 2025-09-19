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
  ticket: ITicket & { editedFields?: string[] };
  userId?: string;
  showButtons?: boolean;
  signatureLoading: boolean;
  handleSetView: (viewState: 'details' | 'dismiss') => void;
  handleUpdateOneTicket: (
    updatedTicket: ITicket,
    refresh?: boolean,
    closeModal?: boolean,
  ) => Promise<ITicket>;
  handleUploadSignature: (signature: string) => void;
  handleDeleteTicket: (ticketId: string) => void;
  handleUploadImage?: (file: File) => Promise<void>;
  handleRemoveImage?: (imageId: string) => Promise<void>;
}

type EditableField =
  | 'residentName'
  | 'residentPhone'
  | 'residentApartment'
  | 'residentEmail'
  | 'residentCPF'
  | 'description';

type EditedData = Record<EditableField, string>;

function TicketDetails({
  ticket,
  userId,
  showButtons,
  signatureLoading,
  handleSetView,
  handleUpdateOneTicket,
  handleUploadSignature,
  handleDeleteTicket,
  handleUploadImage,
  handleRemoveImage,
}: ITicketDetails) {
  const [openSignaturePad, setOpenSignaturePad] = useState<boolean>(false);
  const [localTicket, setLocalTicket] = useState(ticket);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditedData>({
    residentName: ticket.residentName || '',
    residentPhone: ticket.residentPhone || '',
    residentApartment: ticket.residentApartment || '',
    residentEmail: ticket.residentEmail || '',
    residentCPF: ticket.residentCPF || '',
    description: ticket.description || '',
  });

  const disableComment = localTicket?.statusName !== 'awaitingToFinish';

  const editedFields: string[] = localTicket.editedFields || [];

  const ticketDetailsRows = [
    {
      label: 'Edificação',
      value: localTicket?.building?.name,
      field: null,
    },
    {
      label: 'Apartamento do morador',
      value: localTicket?.residentApartment,
      field: 'residentApartment',
    },
    {
      label: 'Nome do morador',
      value: localTicket?.residentName,
      field: 'residentName',
    },
    {
      label: 'Telefone do morador',
      value: applyMask({ value: localTicket?.residentPhone || '', mask: 'TEL' }).value,
      field: 'residentPhone',
    },
    {
      label: 'E-mail do morador',
      value: localTicket?.residentEmail,
      field: 'residentEmail',
    },
    {
      label: 'CPF do morador',
      value: applyMask({ value: localTicket?.residentCPF || '', mask: 'CPF' }).value,
      field: 'residentCPF',
    },
    {
      label: 'Local da ocorrência',
      place: localTicket?.place,
      field: null,
    },
    {
      label: 'Tipo de assistência',
      types: localTicket?.types,
      field: null,
    },
    {
      label: 'Data de abertura',
      value: localTicket?.createdAt
        ? formatDateString(localTicket.createdAt, 'dd/MM/yyyy - HH:mm')
        : '',
      field: null,
    },
  ];

  const ticketDetailsDismissedRows = [
    {
      label: 'Indeferido por',
      value: localTicket.dismissedBy?.name,
    },
    {
      label: 'Data de indeferimento',
      value: localTicket?.dismissedAt
        ? formatDateString(localTicket?.dismissedAt, 'dd/MM/yyyy - HH:mm')
        : '',
    },
    {
      label: 'Justificativa',
      value: localTicket?.dismissReasons?.label,
    },
    { label: 'Observação', value: localTicket?.dismissObservation },
  ];

  const handleToggleShowToResident = () => {
    handleUpdateOneTicket({ id: localTicket.id, showToResident: !localTicket.showToResident });
  };

  const handleFieldChange = (field: EditableField, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const updated = await handleUpdateOneTicket({
      ...localTicket,
      residentName: editedData.residentName,
      residentPhone: editedData.residentPhone,
      residentApartment: editedData.residentApartment,
      residentEmail: editedData.residentEmail,
      residentCPF: editedData.residentCPF,
      description: editedData.description,
      userId,
    });

    if (updated) {
      setLocalTicket(updated);
      setIsEditing(false);
      setEditedData({
        residentName: updated.residentName || '',
        residentPhone: updated.residentPhone || '',
        residentApartment: updated.residentApartment || '',
        residentEmail: updated.residentEmail || '',
        residentCPF: updated.residentCPF || '',
        description: updated.description || '',
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && handleUploadImage) {
      await handleUploadImage(event.target.files[0]);
    }
  };

  return (
    <Style.TicketDetailsContainer>
      {localTicket.lastEditedAt && (
        <Style.TicketEditedAlert>
          Editado em{' '}
          {formatDateString(
            typeof localTicket.lastEditedAt === 'string'
              ? localTicket.lastEditedAt
              : localTicket.lastEditedAt?.toISOString() || '',
            'dd/MM/yyyy HH:mm',
          )}
        </Style.TicketEditedAlert>
      )}

      <TicketShareButton ticketId={localTicket.id} />

      <TicketShowResidentButton
        showToResident={localTicket.showToResident}
        handleToggleShowToResident={handleToggleShowToResident}
      />

      <Style.TicketDetailsColumnContainer>
        {ticketDetailsRows.map(({ label, value, place, types, field }) => {
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
              <Style.TicketDetailsRowLabel>
                {label}
                {field && editedFields.includes(field) && (
                  <span style={{ color: '#FFA500', marginLeft: 8, fontSize: 12 }}>(Editado)</span>
                )}
              </Style.TicketDetailsRowLabel>
              {isEditing && field ? (
                <input
                  style={{
                    width: '100%',
                    minHeight: 32,
                    marginTop: 4,
                    marginBottom: 4,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    padding: 8,
                    fontSize: 14,
                  }}
                  value={editedData[field as EditableField]}
                  onChange={(e) => handleFieldChange(field as EditableField, e.target.value)}
                />
              ) : (
                <Style.TicketDetailsRowValue>{value}</Style.TicketDetailsRowValue>
              )}
            </Style.TicketDetailsColumnContent>
          );
        })}
      </Style.TicketDetailsColumnContainer>

      <Style.TicketDetailsDescriptionContainer>
        <Style.TicketDetailsRowLabel>
          Descrição
          {editedFields.includes('description') && (
            <span style={{ color: '#FFA500', marginLeft: 8, fontSize: 12 }}>(Editado)</span>
          )}
        </Style.TicketDetailsRowLabel>
        {isEditing ? (
          <textarea
            style={{
              width: '100%',
              minHeight: 60,
              marginTop: 8,
              marginBottom: 8,
              borderRadius: 6,
              border: '1px solid #ccc',
              padding: 8,
              fontSize: 14,
              resize: 'vertical',
            }}
            value={editedData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />
        ) : (
          <Style.TicketDetailsRowValue>{localTicket.description}</Style.TicketDetailsRowValue>
        )}
      </Style.TicketDetailsDescriptionContainer>

      {showButtons && (
        <div
          style={{
            marginTop: 16,
            marginBottom: 8,
            display: isEditing ? 'flex' : undefined,
            gap: isEditing ? 8 : undefined,
            alignItems: 'center',
          }}
        >
          {!isEditing ? (
            <Button
              label="Editar dados"
              bgColor="primary"
              size="sm"
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <>
              <Button label="Salvar" bgColor="finished" size="sm" onClick={handleSave} />
              <Button
                label="Cancelar"
                bgColor="transparent"
                textColor="danger"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditedData({
                    residentName: localTicket.residentName || '',
                    residentPhone: localTicket.residentPhone || '',
                    residentApartment: localTicket.residentApartment || '',
                    residentEmail: localTicket.residentEmail || '',
                    residentCPF: localTicket.residentCPF || '',
                    description: localTicket.description || '',
                  });
                }}
              />
            </>
          )}
        </div>
      )}

      <Style.TicketDetailsImagesContainer>
        <Style.TicketDetailsRowLabel>
          Imagens
          {editedFields.includes('images') && (
            <span style={{ color: '#FFA500', marginLeft: 8, fontSize: 12 }}>(Editado)</span>
          )}
        </Style.TicketDetailsRowLabel>
        <Style.TicketDetailsImagesContent>
          {localTicket?.images?.map((image) => (
            <Style.TicketImageWrapper key={image.id}>
              <ImagePreview
                src={image.url}
                downloadUrl={image.url}
                imageCustomName={image.name}
                width="128px"
                height="128px"
                onTrashClick={isEditing ? () => handleRemoveImage?.(image.id) : undefined}
              />
            </Style.TicketImageWrapper>
          ))}
          {isEditing && (
            <Style.TicketImageUploadLabel htmlFor="ticket-image-upload">
              <Style.TicketImageUploadInput
                id="ticket-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Style.TicketImageUploadSpan>+</Style.TicketImageUploadSpan>
            </Style.TicketImageUploadLabel>
          )}
        </Style.TicketDetailsImagesContent>
      </Style.TicketDetailsImagesContainer>

      <TicketHistoryActivities
        ticketId={localTicket.id}
        userId={userId}
        disableComment={disableComment}
      />

      {localTicket.statusName !== 'open' && (
        <Style.TicketSignatureContainer>
          <Style.TicketSignatureHeader>
            <Typography variant="h3">
              Assinatura:
              <Typography variant="span" fontSize="sm" style={{ textDecoration: 'underline' }}>
                {localTicket.residentName}
              </Typography>
            </Typography>

            {!localTicket?.signature && (
              <IconButton
                icon={icon.signing}
                onClick={() => setOpenSignaturePad(!openSignaturePad)}
              />
            )}
          </Style.TicketSignatureHeader>

          {!localTicket?.signature ? (
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
              src={localTicket.signature}
              downloadUrl={localTicket.signature}
              imageCustomName="assinatura"
              width="128px"
              height="128px"
            />
          )}
        </Style.TicketSignatureContainer>
      )}

      {localTicket?.statusName === 'dismissed' && (
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

      {showButtons && (ticket.statusName === 'dismissed' || ticket.statusName === 'finished') ? (
        <Style.ButtonsContainer>
          {localTicket.statusName === 'open' && (
            <Button
              label="Executar"
              permToCheck="tickets:update"
              bgColor="awaitingToFinish"
              onClick={() =>
                handleUpdateOneTicket({
                  id: localTicket.id,
                  statusName: 'awaitingToFinish',
                  userId,
                })
              }
            />
          )}

          {localTicket.statusName === 'awaitingToFinish' && (
            <>
              <Button
                label="Voltar para Aberto"
                textColor="actionBlue"
                bgColor="transparent"
                permToCheck="tickets:update"
                onClick={() =>
                  handleUpdateOneTicket({
                    id: localTicket.id,
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
                    id: localTicket.id,
                    statusName: 'finished',
                    userId,
                  })
                }
              />
            </>
          )}

          {(localTicket.statusName === 'open' || localTicket.statusName === 'awaitingToFinish') && (
            <Button
              label="Reprovar"
              permToCheck="tickets:update"
              bgColor="dismissed"
              onClick={() => handleSetView('dismiss')}
            />
          )}

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
            actionButtonClick={() => handleDeleteTicket(localTicket.id)}
          />
        </Style.ButtonsContainer>
      ) : (
        showButtons && (
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
              <Button
                label="Reprovar"
                permToCheck="tickets:update"
                bgColor="dismissed"
                onClick={() => handleSetView('dismiss')}
              />
            )}

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
          </Style.ButtonsContainer>
        )
      )}
    </Style.TicketDetailsContainer>
  );
}

export default TicketDetails;
