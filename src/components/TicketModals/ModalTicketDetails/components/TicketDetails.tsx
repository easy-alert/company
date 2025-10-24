// REACT
import { useState } from 'react';

// GLOBAL COMPONENTS
import { ListTag } from '@components/ListTag';
import { TicketHistoryActivities } from '@components/TicketHistoryActivities';
import { ImagePreview } from '@components/ImagePreview';
import { Button } from '@components/Buttons/Button';
import { IconButton } from '@components/Buttons/IconButton';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import { TicketShareButton } from '@components/TicketShareButton';
import { TicketShowResidentButton } from '@components/TicketShowResidentButton';
import SignaturePad from '@components/SignaturePad';
import Typography from '@components/Typography';

// GLOBAL UTILS
import { formatDateString } from '@utils/dateFunctions';
import { applyMask } from '@utils/functions';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import { icon } from '@assets/icons';
import IconX from '@assets/icons/IconX';
import IconEdit from '@assets/icons/IconEdit';

// GLOBAL TYPES
import type { ITicket } from '@customTypes/ITicket';

// COMPONENTS
import { defaultConfig } from '@components/TicketModals/ModalEditTicketForm/domain/defaultConfig.constant';

// TYPES
import { TicketFieldKey } from '@components/TicketModals/ModalEditTicketForm/domain/ticketFieldKey.type';
import { ETicketFieldKey } from '@components/TicketModals/ModalEditTicketForm/domain/ticketFieldKey.enum';

// STYLES
import * as Style from '../styles';

interface ITicketDetails {
  ticket: ITicket & { editedFields?: string[] };
  fieldsConfig?: Record<string, { hidden: boolean; required: boolean }>;
  userId?: string;
  showButtons?: boolean;
  signatureLoading: boolean;
  handleSetView: (viewState: 'details' | 'dismiss') => void;
  handleUpdateOneTicket: (
    updatedTicket: Partial<ITicket>,
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
  | 'description'
  | 'images';

type EditedData = Record<Exclude<EditableField, 'images'>, string>;

function TicketDetails({
  ticket,
  fieldsConfig,
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
  const [editingField, setEditingField] = useState<EditableField | null>(null);
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
  const config = fieldsConfig ?? defaultConfig;
  const isHidden = (key: TicketFieldKey) => !!config[key]?.hidden;
  const withPlaceholder = (val?: string | null) => (val && val !== '' ? val : 'Não definido');

  const ticketDetailsRows = [
    {
      label: 'Apartamento do morador',
      value: withPlaceholder(localTicket?.residentApartment),
      field: 'residentApartment',
    },
    {
      label: 'Nome do morador',
      value: withPlaceholder(localTicket?.residentName),
      field: 'residentName',
    },
    {
      label: 'Telefone do morador',
      value: withPlaceholder(
        applyMask({ value: localTicket?.residentPhone || '', mask: 'TEL' }).value,
      ),
      field: 'residentPhone',
    },
    {
      label: 'E-mail do morador',
      value: withPlaceholder(localTicket?.residentEmail),
      field: 'residentEmail',
    },
    {
      label: 'CPF do morador',
      value: withPlaceholder(
        applyMask({ value: localTicket?.residentCPF || '', mask: 'CPF' }).value,
      ),
      field: 'residentCPF',
    },
    { label: 'Local da ocorrência', place: localTicket?.place, field: null },
    { label: 'Tipo de assistência', types: localTicket?.types, field: null },
    {
      label: 'Data de abertura',
      value: localTicket?.createdAt
        ? formatDateString(localTicket.createdAt, 'dd/MM/yyyy - HH:mm')
        : '',
      field: null,
    },
  ];

  const ticketDetailsDismissedRows = [
    { label: 'Indeferido por', value: localTicket.dismissedBy?.name },
    {
      label: 'Data de indeferimento',
      value: localTicket?.dismissedAt
        ? formatDateString(localTicket?.dismissedAt, 'dd/MM/yyyy - HH:mm')
        : '',
    },
    { label: 'Justificativa', value: localTicket?.dismissReasons?.label },
    { label: 'Observação', value: localTicket?.dismissObservation },
  ];

  const handleToggleShowToResident = () => {
    handleUpdateOneTicket({ id: localTicket.id, showToResident: !localTicket.showToResident });
  };

  const handleFieldChange = (field: Exclude<EditableField, 'images'>, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveField = async () => {
    if (!editingField || editingField === 'images') {
      setEditingField(null);
      return;
    }
    const updatedFromApi = await handleUpdateOneTicket({
      id: localTicket.id,
      [editingField]: editedData[editingField],
      userId,
    });

    if (updatedFromApi) {
      setLocalTicket((prevState) => {
        const previousFields = prevState.editedFields || [];
        const newEditedFields = [...new Set([...previousFields, editingField])];
        return {
          ...prevState,
          ...updatedFromApi,
          editedFields: newEditedFields,
        };
      });
      setEditingField(null);
    }
  };

  const handleCancelEdit = () => {
    if (!editingField || editingField === 'images') {
      setEditingField(null);
      return;
    }
    setEditedData((prev) => ({
      ...prev,
      [editingField]: (localTicket[editingField as keyof ITicket] as string) || '',
    }));
    setEditingField(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && handleUploadImage) {
      await handleUploadImage(event.target.files[0]);
    }
  };

  return (
    <Style.TicketDetailsContainer>
      <TicketShareButton ticketId={localTicket.id} />
      <TicketShowResidentButton
        showToResident={localTicket.showToResident}
        handleToggleShowToResident={handleToggleShowToResident}
      />
      <Typography variant="h3" style={{ fontWeight: 500, marginBottom: '8px' }}>
        {localTicket.building?.name}
      </Typography>
      <Style.DetailsListContainer>
        {ticketDetailsRows
          .filter(({ field }) => (!field ? true : !isHidden(field as TicketFieldKey)))
          .map(({ label, value, place, types, field }) => (
            <Style.DetailItemWrapper key={label}>
              {field ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '2px' }}
                  >
                    <Style.DetailItemContent>
                      <Style.TicketDetailsRowLabel>{label}:</Style.TicketDetailsRowLabel>
                      {editingField === field ? (
                        <input
                          style={{
                            flex: 1,
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '6px 8px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                          }}
                          value={editedData[field as Exclude<EditableField, 'images'>]}
                          onChange={(e) =>
                            handleFieldChange(
                              field as Exclude<EditableField, 'images'>,
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        <Style.TicketDetailsRowValue>{value}</Style.TicketDetailsRowValue>
                      )}
                    </Style.DetailItemContent>
                    {editedFields.includes(field) &&
                      localTicket.lastEditedAt &&
                      editingField !== field && (
                        <span style={{ fontSize: '11px', color: '#888' }}>
                          editado{' '}
                          {formatDateString(
                            typeof localTicket.lastEditedAt === 'string'
                              ? localTicket.lastEditedAt
                              : localTicket.lastEditedAt?.toISOString(),
                            'dd/MM/yyyy',
                          )}
                        </span>
                      )}
                  </div>
                  {showButtons &&
                    (editingField === field ? (
                      <div style={{ display: 'flex' }}>
                        <IconButton icon={icon.save} onClick={handleSaveField} />
                        <IconButton icon={<IconX />} onClick={handleCancelEdit} />
                      </div>
                    ) : (
                      <IconButton
                        icon={<IconEdit strokeColor="primary" />}
                        onClick={() => setEditingField(field as EditableField)}
                        disabled={!!editingField}
                      />
                    ))}
                </>
              ) : (
                <Style.DetailItemContentVertical>
                  <Style.TicketDetailsRowLabel>{label}</Style.TicketDetailsRowLabel>
                  {value && <Style.TicketDetailsRowValue>{value}</Style.TicketDetailsRowValue>}
                  {place && (
                    <ListTag label={place?.label || ''} color="white" backgroundColor="gray4" />
                  )}
                  {Array.isArray(types) &&
                    types.map(({ type: ticketType }) => (
                      <ListTag
                        key={ticketType.id}
                        label={ticketType.label}
                        color={ticketType.color}
                        backgroundColor={ticketType.backgroundColor}
                      />
                    ))}
                </Style.DetailItemContentVertical>
              )}
            </Style.DetailItemWrapper>
          ))}
        {!isHidden(ETicketFieldKey.description) && (
          <Style.DetailItemWrapper>
            <Style.DetailItemContentVertical>
              <Style.TicketDetailsRowLabel>Descrição</Style.TicketDetailsRowLabel>
              {editingField === 'description' ? (
                <textarea
                  style={{
                    width: '100%',
                    minHeight: 60,
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    fontSize: 14,
                    resize: 'vertical',
                    backgroundColor: 'white',
                  }}
                  value={editedData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                />
              ) : (
                <>
                  <Style.TicketDetailsRowValue>
                    {localTicket.description}
                  </Style.TicketDetailsRowValue>
                  {editedFields.includes('description') && localTicket.lastEditedAt && (
                    <span style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                      editado{' '}
                      {formatDateString(
                        typeof localTicket.lastEditedAt === 'string'
                          ? localTicket.lastEditedAt
                          : localTicket.lastEditedAt?.toISOString(),
                        'dd/MM/yyyy',
                      )}
                    </span>
                  )}
                </>
              )}
            </Style.DetailItemContentVertical>
            {showButtons &&
              (editingField === 'description' ? (
                <div style={{ display: 'flex' }}>
                  <IconButton icon={icon.save} onClick={handleSaveField} />
                  <IconButton icon={<IconX />} onClick={handleCancelEdit} />
                </div>
              ) : (
                <IconButton
                  icon={<IconEdit strokeColor="primary" />}
                  onClick={() => setEditingField('description')}
                  disabled={!!editingField}
                />
              ))}
          </Style.DetailItemWrapper>
        )}
      </Style.DetailsListContainer>

      <Style.DetailItemWrapper>
        <Style.DetailItemVertical>
          <Style.TicketDetailsRowLabel>
            Imagens
            {editedFields.includes('images') && (
              <span style={{ fontWeight: 'normal', color: '#888', marginLeft: 8, fontSize: 12 }}>
                (editado{' '}
                {formatDateString(
                  typeof localTicket.lastEditedAt === 'string'
                    ? localTicket.lastEditedAt
                    : localTicket.lastEditedAt?.toISOString(),
                  'dd/MM/yyyy',
                )}
                )
              </span>
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
                  onTrashClick={
                    editingField === 'images' ? () => handleRemoveImage?.(image.id) : undefined
                  }
                />
              </Style.TicketImageWrapper>
            ))}
            {editingField === 'images' && (
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
        </Style.DetailItemVertical>
        {showButtons &&
          (editingField === 'images' ? (
            <div style={{ display: 'flex' }}>
              <IconButton
                icon={icon.save}
                onClick={() => setEditingField(null)}
                title="Concluir edição de imagens"
              />
            </div>
          ) : (
            <IconButton
              icon={<IconEdit strokeColor="primary" />}
              onClick={() => setEditingField('images')}
              disabled={!!editingField}
            />
          ))}
      </Style.DetailItemWrapper>

      {/* <Style.ButtonContainer>
    <IconButton
     label="Adicionar prestador de serviço"
     icon={<IconPlus strokeColor="white" backgroundColor="primary" padding="2px" />}
     onClick={() => console.log('Adicionar prestador')}
    />
    <IconButton
     label="Adicionar checklist de tarefas"
     icon={<IconPlus strokeColor="white" backgroundColor="primary" padding="2px" />}
     onClick={() => console.log('Adicionar checklist')}
    />
   </Style.ButtonContainer>  */}

      <TicketHistoryActivities
        ticketId={localTicket.id}
        userId={userId}
        disableComment={disableComment}
      />

      {localTicket.statusName !== 'open' && (
        <Style.TicketSignatureContainer>
          <Style.TicketSignatureHeader>
            <Typography variant="h3">Assinatura {localTicket.residentName}</Typography>
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
                  setOpenSignaturePad(false);
                }}
              />
            )
          ) : (
            <Style.SignatureImageContainer>
              <Style.SignatureImage
                src={localTicket.signature}
                alt={`Assinatura de ${localTicket.residentName}`}
              />
            </Style.SignatureImageContainer>
          )}
        </Style.TicketSignatureContainer>
      )}

      {localTicket?.statusName === 'dismissed' && (
        <>
          <Style.TicketDetailsTitle style={{ marginTop: '24px', marginBottom: '8px' }}>
            Detalhes do indeferimento
          </Style.TicketDetailsTitle>
          <Style.DetailsListContainer>
            {ticketDetailsDismissedRows.map(({ label, value }) => (
              <Style.DetailItemWrapper key={label}>
                <Style.DetailItemContent>
                  <Style.TicketDetailsRowLabel>{label}:</Style.TicketDetailsRowLabel>
                  <Style.TicketDetailsRowValue>
                    {withPlaceholder(value)}
                  </Style.TicketDetailsRowValue>
                </Style.DetailItemContent>
              </Style.DetailItemWrapper>
            ))}
          </Style.DetailsListContainer>
        </>
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
              <IconButton
                icon={icon.callBack}
                title="Voltar para Aberto"
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
            {ticket.statusName === 'awaitingToFinish' && (
              <>
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
                <IconButton
                  icon={icon.callBack}
                  title="Voltar para Aberto"
                  permToCheck="tickets:update"
                  onClick={() =>
                    handleUpdateOneTicket({
                      id: localTicket.id,
                      statusName: 'open',
                      userId,
                    })
                  }
                />
              </>
            )}
          </Style.ButtonsContainer>
        )
      )}
    </Style.TicketDetailsContainer>
  );
}

export default TicketDetails;
