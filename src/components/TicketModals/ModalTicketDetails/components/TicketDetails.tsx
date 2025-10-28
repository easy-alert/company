import { useEffect, useRef, useState } from 'react';

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
import { ReactSelectCreatableComponent } from '@components/ReactSelectCreatableComponent';

// HOOKS
import { useTicketPlacesForSelect } from '@hooks/useTicketPlacesForSelect';
import { useTicketServiceTypesForSelect } from '@hooks/useTicketServiceTypesForSelect';

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
  | 'images'
  | 'place'
  | 'types';

type EditedData = Record<Exclude<EditableField, 'images' | 'place' | 'types'>, string>;

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
  const [isConfirmPopoverOpen, setConfirmPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [editedData, setEditedData] = useState<EditedData>({
    residentName: ticket.residentName || '',
    residentPhone: ticket.residentPhone || '',
    residentApartment: ticket.residentApartment || '',
    residentEmail: ticket.residentEmail || '',
    residentCPF: ticket.residentCPF || '',
    description: ticket.description || '',
  });

  const { ticketPlacesForSelect } = useTicketPlacesForSelect();
  const { ticketServiceTypesForSelect } = useTicketServiceTypesForSelect();

  const [editedPlaceId, setEditedPlaceId] = useState<string | null>(null);
  const [editedTypes, setEditedTypes] = useState<{ serviceTypeId: string }[]>([]);

  useEffect(() => {
    setLocalTicket(ticket);
  }, [ticket]);

  const disableComment = localTicket?.statusName !== 'awaitingToFinish';
  const editedFields: string[] = localTicket.editedFields || [];
  const config = fieldsConfig ?? defaultConfig;
  const isHidden = (key: TicketFieldKey) => !!config[key]?.hidden;
  const withPlaceholder = (val?: string | null) => (val && val !== '' ? val : 'Não definido');

  const ticketDetailsRows = [
    {
      label: 'Apartamento do morador',
      value: withPlaceholder(localTicket?.residentApartment),
      field: 'residentApartment' as EditableField,
    },
    {
      label: 'Nome do morador',
      value: withPlaceholder(localTicket?.residentName),
      field: 'residentName' as EditableField,
    },
    {
      label: 'Telefone do morador',
      value: withPlaceholder(
        applyMask({ value: localTicket?.residentPhone || '', mask: 'TEL' }).value,
      ),
      field: 'residentPhone' as EditableField,
    },
    {
      label: 'E-mail do morador',
      value: withPlaceholder(localTicket?.residentEmail),
      field: 'residentEmail' as EditableField,
    },
    {
      label: 'CPF do morador',
      value: withPlaceholder(
        applyMask({ value: localTicket?.residentCPF || '', mask: 'CPF' }).value,
      ),
      field: 'residentCPF' as EditableField,
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

  const handleFieldChange = (
    field: Exclude<EditableField, 'images' | 'place' | 'types'>,
    value: string,
  ) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveField = async () => {
    if (!editingField || editingField === 'images') {
      setEditingField(null);
      return;
    }

    const updatePayload: Partial<ITicket> = { id: localTicket.id, userId };

    switch (editingField) {
      case 'place':
        updatePayload.placeId = editedPlaceId || undefined;
        break;
      case 'types':
        updatePayload.types = editedTypes as any;
        break;
      default:
        if (editingField in editedData) {
          updatePayload[editingField] = editedData[editingField as keyof EditedData];
        }
        break;
    }

    try {
      const updatedFromApi = await handleUpdateOneTicket(updatePayload, true, false);
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
      }
    } catch (error) {
      console.error('Erro ao atualizar o chamado:', error);
    } finally {
      setEditingField(null);
    }
  };

  const handleCancelEdit = () => {
    if (!editingField) return;

    if (editingField !== 'place' && editingField !== 'types' && editingField !== 'images') {
      setEditedData((prev) => ({
        ...prev,
        [editingField]: (localTicket[editingField as keyof ITicket] as string) || '',
      }));
    }
    setEditingField(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && handleUploadImage) {
      await handleUploadImage(event.target.files[0]);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setConfirmPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const popoverContent = (
    <Style.PopoverContainer>
      <Style.PopoverHeader>
        <h2>O que deseja fazer?</h2>
        <IconButton icon={<IconX />} onClick={() => setConfirmPopoverOpen(false)} />
      </Style.PopoverHeader>
      <div>
        <Style.PopoverMessage>
          Você pode reabrir o chamado ou excluí-lo permanentemente.
          <p>Atenção: a exclusão é uma ação irreversível.</p>
        </Style.PopoverMessage>
      </div>
      <Style.PopoverActions>
        <Button
          label="Voltar para Aberto"
          bgColor="#007bff"
          onClick={async () => {
            const updated = await handleUpdateOneTicket({
              id: localTicket.id,
              statusName: 'open',
              userId,
            });
            if (updated) setLocalTicket(updated);
            setConfirmPopoverOpen(false);
          }}
        />
        <Button
          label="Excluir"
          bgColor="dismissed"
          onClick={() => {
            handleDeleteTicket(localTicket.id);
            setConfirmPopoverOpen(false);
          }}
        />
      </Style.PopoverActions>
    </Style.PopoverContainer>
  );

  const renderPlaceField = () => {
    if (editingField === 'place') {
      return (
        <div style={{ width: '100%' }}>
          <ReactSelectCreatableComponent
            id="place"
            name="place"
            selectPlaceholderValue={editedPlaceId}
            options={ticketPlacesForSelect.map((p) => ({ label: p.label, value: p.id }))}
            value={
              editedPlaceId
                ? {
                    label:
                      ticketPlacesForSelect.find((p) => p.id === editedPlaceId)?.label ||
                      localTicket.place?.label ||
                      '',
                    value: editedPlaceId,
                  }
                : null
            }
            onChange={(option: any) => setEditedPlaceId(option?.value || null)}
            placeholder=""
            isClearable
          />
        </div>
      );
    }

    if (localTicket.place) {
      return <ListTag label={localTicket.place.label} color="white" backgroundColor="gray4" />;
    }

    return <Style.TicketDetailsRowValue>Não definido</Style.TicketDetailsRowValue>;
  };

  const renderTypesField = () => {
    if (editingField === 'types') {
      return (
        <div style={{ width: '100%' }}>
          <ReactSelectCreatableComponent
            id="types"
            name="types"
            selectPlaceholderValue={editedTypes.length > 0}
            isMulti
            options={ticketServiceTypesForSelect.map((t) => ({
              label: t.singularLabel,
              value: t.id,
            }))}
            value={editedTypes.map((et) => {
              const typeInfo = ticketServiceTypesForSelect.find((t) => t.id === et.serviceTypeId);
              return { label: typeInfo?.singularLabel || '', value: et.serviceTypeId };
            })}
            onChange={(options: any) => {
              const newTypes = options
                ? options.map((opt: any) => ({ serviceTypeId: opt.value }))
                : [];
              setEditedTypes(newTypes);
            }}
            placeholder=""
          />
        </div>
      );
    }

    if (Array.isArray(localTicket.types) && localTicket.types.length > 0) {
      return localTicket.types.map(({ type: ticketType }) => (
        <ListTag
          key={ticketType.id}
          label={ticketType.label}
          color={ticketType.color}
          backgroundColor={ticketType.backgroundColor}
        />
      ));
    }

    return <Style.TicketDetailsRowValue>Não definido</Style.TicketDetailsRowValue>;
  };

  return (
    <Style.TicketDetailsContainer>
      <TicketShareButton ticketId={localTicket.id} />
      <TicketShowResidentButton
        showToResident={localTicket.showToResident}
        handleToggleShowToResident={handleToggleShowToResident}
      />
      <Style.TicketHeader>
        <Style.BuildingName>{localTicket.building?.name}</Style.BuildingName>

        <Style.TicketDate>
          Data de Abertura:{' '}
          {localTicket?.createdAt
            ? formatDateString(localTicket.createdAt, 'dd/MM/yyyy')
            : 'Não definida'}
        </Style.TicketDate>
      </Style.TicketHeader>

      <Style.DetailsListContainer>
        {ticketDetailsRows.map(({ label, field, value }) => (
          <Style.DetailItemWrapper key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '2px' }}>
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
                    value={editedData[field as keyof EditedData]}
                    onChange={(e) => handleFieldChange(field as keyof EditedData, e.target.value)}
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
                  onClick={() => setEditingField(field)}
                  disabled={!!editingField}
                />
              ))}
          </Style.DetailItemWrapper>
        ))}

        <Style.DetailItemWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '2px' }}>
            <Style.DetailItemContent>
              <Style.TicketDetailsRowLabel>Local da ocorrência:</Style.TicketDetailsRowLabel>
              {renderPlaceField()}
            </Style.DetailItemContent>
            {editedFields.includes('place') &&
              localTicket.lastEditedAt &&
              editingField !== 'place' && (
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
            (editingField === 'place' ? (
              <div style={{ display: 'flex' }}>
                <IconButton icon={icon.save} onClick={handleSaveField} />
                <IconButton icon={<IconX />} onClick={handleCancelEdit} />
              </div>
            ) : (
              <IconButton
                icon={<IconEdit strokeColor="primary" />}
                onClick={() => {
                  setEditingField('place');
                  setEditedPlaceId(localTicket.place?.id || null);
                }}
                disabled={!!editingField}
              />
            ))}
        </Style.DetailItemWrapper>

        <Style.DetailItemWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '2px' }}>
            <Style.DetailItemContent>
              <Style.TicketDetailsRowLabel>Tipo de assistência:</Style.TicketDetailsRowLabel>
              {renderTypesField()}
            </Style.DetailItemContent>
            {editedFields.includes('types') &&
              localTicket.lastEditedAt &&
              editingField !== 'types' && (
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
            (editingField === 'types' ? (
              <div style={{ display: 'flex' }}>
                <IconButton icon={icon.save} onClick={handleSaveField} />
                <IconButton icon={<IconX />} onClick={handleCancelEdit} />
              </div>
            ) : (
              <IconButton
                icon={<IconEdit strokeColor="primary" />}
                onClick={() => {
                  setEditingField('types');
                  setEditedTypes(
                    localTicket.types?.map((t) => ({ serviceTypeId: t.type.id })) || [],
                  );
                }}
                disabled={!!editingField}
              />
            ))}
        </Style.DetailItemWrapper>

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
                    {withPlaceholder(localTicket.description)}
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
            {editedFields.includes('images') && localTicket.lastEditedAt && (
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
            <Typography variant="h5">Assinatura: {localTicket.residentName}</Typography>
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

      {showButtons &&
      (localTicket.statusName === 'dismissed' || localTicket.statusName === 'finished') ? (
        <Style.ButtonsContainer>
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
            {localTicket.statusName === 'open' && (
              <Button
                label="Executar"
                permToCheck="tickets:update"
                bgColor="awaitingToFinish"
                onClick={async () => {
                  const updated = await handleUpdateOneTicket({
                    id: localTicket.id,
                    statusName: 'awaitingToFinish',
                    userId,
                  });
                  if (updated) setLocalTicket(updated);
                }}
              />
            )}
            {(localTicket.statusName === 'open' ||
              localTicket.statusName === 'awaitingToFinish') && (
              <Button
                label="Reprovar"
                permToCheck="tickets:update"
                bgColor="dismissed"
                onClick={() => handleSetView('dismiss')}
              />
            )}
            {localTicket.statusName === 'open' && (
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
            )}
            {localTicket.statusName === 'awaitingToFinish' && (
              <>
                <Button
                  label="Finalizar"
                  permToCheck="tickets:update"
                  bgColor="finished"
                  onClick={async () => {
                    const updated = await handleUpdateOneTicket({
                      id: localTicket.id,
                      statusName: 'finished',
                      userId,
                    });
                    if (updated) setLocalTicket(updated);
                  }}
                />
                <div style={{ position: 'relative' }} ref={popoverRef}>
                  <IconButton
                    icon={icon.callBack}
                    title="Mais opções"
                    permToCheck="tickets:update"
                    onClick={() => setConfirmPopoverOpen((prev) => !prev)}
                  />
                  {isConfirmPopoverOpen && popoverContent}
                </div>
              </>
            )}
          </Style.ButtonsContainer>
        )
      )}
    </Style.TicketDetailsContainer>
  );
}

export default TicketDetails;
