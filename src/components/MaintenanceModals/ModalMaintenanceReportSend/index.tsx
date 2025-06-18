/* eslint-disable react/no-array-index-key */
// REACT
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// HOOKS
import { useMaintenancePriorities } from '@hooks/useMaintenancePriorities';
import { useHasPermission } from '@hooks/useHasPermission';

// SERVICES
import { getMaintenanceDetails } from '@services/apis/getMaintenanceDetails';
import { getMaintenanceReportProgress } from '@services/apis/getMaintenanceReportProgress';
import { sendMaintenanceReport } from '@services/apis/sendMaintenanceReport';
import { saveMaintenanceReport } from '@services/apis/saveMaintenanceReport';
import { maintenanceToggleProgress } from '@services/apis/maintenanceToggleProgress';

// COMPONENTS
import { EventTag } from '@components/EventTag';
import { Input } from '@components/Inputs/Input';
import { Select } from '@components/Inputs/Select';
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { Image } from '@components/Image';
import { DotLoading } from '@components/Loadings/DotLoading';
import { ImagePreview } from '@components/ImagePreview';
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { LinkSupplierToMaintenanceHistory } from '@components/LinkSupplierToMaintenanceHistory';
import { MaintenanceHistoryActivities } from '@components/MaintenanceHistoryActivities';
import { ListTag } from '@components/ListTag';
import { InProgressTag } from '@components/InProgressTag';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import { ModalEditMaintenanceHistory } from '@components/MaintenanceModals/ModalEditMaintenanceHistory';
import UserResponsible from '@components/UserResponsible';

// GLOBAL STYLES
import { icon } from '@assets/icons';

// GLOBAL FUNCTIONS
import { applyMask, dateFormatter, uploadManyFiles } from '@utils/functions';

// GLOBAL THEMES
import { theme } from '@styles/theme';

// TYPES
import type { IMaintenance } from '@customTypes/IMaintenance';
import type { IMaintenanceReport } from '@customTypes/IMaintenanceReport';
import type { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';

// STYLES
import * as Style from './styles';

// TYPES
import type { IModalMaintenanceReportSend } from './types';

export const ModalMaintenanceReportSend = ({
  maintenanceHistoryId,
  refresh,
  handleModals,
  handleRefresh,
}: IModalMaintenanceReportSend) => {
  const {
    account: {
      origin,
      User: { id: userId },
    },
  } = useAuthContext();
  const { hasPermission: hasUpdatePermission } = useHasPermission({
    permToCheck: ['maintenances:update'],
  });

  const { maintenancePriorities } = useMaintenancePriorities();

  const [maintenance, setMaintenance] = useState<IMaintenance>({
    Building: {
      name: '',
      guestCanCompleteMaintenance: false,
    },
    canReport: false,
    daysInAdvance: 0,
    dueDate: '',
    id: '',
    inProgress: false,
    Maintenance: {
      instructions: [],
      activity: '',
      Category: {
        name: '',
      },
      element: '',
      frequency: 0,
      FrequencyTimeInterval: {
        pluralLabel: '',
        singularLabel: '',
      },
      MaintenanceType: {
        name: '',
      },
      observation: '',
      responsible: '',
      source: '',
    },
    resolutionDate: '',
    notificationDate: '',
    MaintenancesStatus: {
      name: 'pending',
    },
    MaintenanceReport: [{ cost: 0, id: '', observation: '', ReportAnnexes: [], ReportImages: [] }],
    MaintenanceReportProgress: [
      { cost: 0, id: '', observation: '', ReportAnnexesProgress: [], ReportImagesProgress: [] },
    ],
  });

  // MODAL ENVIAR RELATO
  const [maintenanceReport, setMaintenanceReport] = useState<IMaintenanceReport>({
    cost: 'R$ 0,00',
    observation: '',
  });

  const [files, setFiles] = useState<IAnnexesAndImages[]>([]);
  const [onFileQuery, setOnFileQuery] = useState<boolean>(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled: onFileQuery,
  });

  const [images, setImages] = useState<IAnnexesAndImages[]>([]);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const {
    acceptedFiles: acceptedImages,
    getRootProps: getRootPropsImages,
    getInputProps: getInputPropsImages,
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'audio/flac': ['.flac'], // Colocado isso pro celular abrir as opções de camera corretamente.
    },
    disabled: onImageQuery,
  });

  const [modalEditMaintenanceHistory, setModalEditMaintenanceHistory] = useState<boolean>(false);

  const [modalLoading, setModalLoading] = useState<boolean>(true);
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const handleEditModal = (modalState: boolean) => {
    setModalEditMaintenanceHistory(modalState);
  };

  // #region api function
  const handleGetMaintenanceDetails = async () => {
    const responseData = await getMaintenanceDetails({
      maintenanceHistoryId,
    });

    setMaintenance(responseData);
  };

  const handleGetReportProgress = async () => {
    const responseData = await getMaintenanceReportProgress({
      maintenanceHistoryId,
    });

    if (responseData.progress) {
      setMaintenanceReport({
        cost: applyMask({ mask: 'BRL', value: String(responseData.progress.cost) }).value,
        observation: responseData.progress.observation || '',
      });
      setFiles(responseData.progress.ReportAnnexesProgress);
      setImages(responseData.progress.ReportImagesProgress);
    }
  };

  const handleMaintenanceToggleProgress = async (inProgressChange: boolean) => {
    setOnQuery(true);

    try {
      await maintenanceToggleProgress({
        userId: userId ?? '',
        maintenanceHistoryId,
        inProgressChange,
      });
    } finally {
      if (handleRefresh) handleRefresh();
      setOnQuery(false);
    }
  };

  const handleSaveMaintenanceReport = async (inProgress?: boolean) => {
    setOnQuery(true);

    try {
      await saveMaintenanceReport({
        maintenanceHistoryId,
        inProgress,
        userId: userId ?? '',
        maintenanceReport,
        files,
        images,
        origin,
      });

      handleModals('modalMaintenanceReportSend', false);
    } finally {
      if (handleRefresh) handleRefresh();
      setOnQuery(false);
    }
  };

  const handleSendMaintenanceReport = async () => {
    setOnQuery(true);

    try {
      await sendMaintenanceReport({
        syndicNanoId: '',
        userId: userId ?? '',
        maintenanceHistoryId,
        maintenanceReport,
        files,
        images,
        origin,
      });

      handleModals('modalMaintenanceReportSend', false);
    } finally {
      if (handleRefresh) handleRefresh();
      setOnQuery(false);
    }
  };
  // #endregion

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const uploadAcceptedFiles = async () => {
        setOnFileQuery(true);

        const uploadedFiles = await uploadManyFiles([...acceptedFiles]);

        const formattedFiles = uploadedFiles.map((file) => ({
          name: file.originalname,
          originalName: file.originalname,
          url: file.Location,
        }));

        setFiles((prevState) => {
          let newState = [...prevState];
          newState = [...newState, ...formattedFiles];
          return newState;
        });
        setOnFileQuery(false);
      };

      uploadAcceptedFiles();
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (acceptedImages.length > 0) {
      const uploadAcceptedImages = async () => {
        setOnImageQuery(true);

        const uploadedImages = await uploadManyFiles([...acceptedImages]);

        const formattedImages = uploadedImages.map((file) => ({
          name: file.originalname,
          originalName: file.originalname,
          url: file.Location,
        }));

        setImages((prevState) => {
          let newState = [...prevState];
          newState = [...newState, ...formattedImages];
          return newState;
        });
        setOnImageQuery(false);
      };

      uploadAcceptedImages();
    }
  }, [acceptedImages]);

  useEffect(() => {
    setModalLoading(true);

    try {
      handleGetReportProgress();
      handleGetMaintenanceDetails();
    } finally {
      setTimeout(() => {
        setModalLoading(false);
      }, 500);
    }
  }, [refresh]);

  return (
    <>
      {modalEditMaintenanceHistory && (
        <ModalEditMaintenanceHistory
          userId={userId}
          maintenance={maintenance}
          handleEditModal={handleEditModal}
          handleRefresh={handleRefresh}
        />
      )}

      <Modal
        bodyWidth="475px"
        title={maintenance.canReport ? 'Enviar relato' : 'Detalhes de manutenção'}
        maintenanceHistoryId={maintenanceHistoryId}
        setModal={(modalState) => handleModals('modalMaintenanceReportSend', modalState)}
        handleEdit={() => handleEditModal(true)}
      >
        {modalLoading ? (
          <Style.LoadingContainer>
            <DotSpinLoading />
          </Style.LoadingContainer>
        ) : (
          <Style.Container>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: theme.size.xsm,
              }}
            >
              <h3>{maintenance?.Building?.name}</h3>

              <EventTag
                label={`#${maintenance.serviceOrderNumber}`}
                color={theme.color.gray4}
                bgColor="transparent"
                fontWeight="bold"
              />
            </div>

            <Style.StatusTagWrapper>
              {maintenance?.MaintenancesStatus?.name === 'overdue' && (
                <EventTag status="completed" />
              )}
              <EventTag status={maintenance?.MaintenancesStatus?.name} />
              {maintenance?.Maintenance?.MaintenanceType?.name === 'occasional' ? (
                <EventTag status="occasional" />
              ) : (
                <EventTag status="common" />
              )}
              {(maintenance?.MaintenancesStatus?.name === 'expired' ||
                maintenance?.MaintenancesStatus?.name === 'pending') &&
                maintenance.inProgress && <InProgressTag />}
            </Style.StatusTagWrapper>

            <Style.Content>
              <Style.Row>
                <h6>Categoria</h6>
                <p className="p2">{maintenance?.Maintenance?.Category?.name}</p>
              </Style.Row>
              <Style.Row>
                <h6>Elemento</h6>
                <p className="p2">{maintenance?.Maintenance?.element}</p>
              </Style.Row>
              <Style.Row>
                <h6>Atividade</h6>
                <p className="p2">{maintenance?.Maintenance?.activity}</p>
              </Style.Row>
              <Style.Row>
                <h6>Responsável</h6>
                <p className="p2">{maintenance?.Maintenance?.responsible}</p>
              </Style.Row>

              <Style.Row>
                <h6>Fonte</h6>
                <p className="p2">{maintenance?.Maintenance?.source}</p>
              </Style.Row>

              <Style.Row>
                <h6>Observação da manutenção</h6>
                <p className="p2">{maintenance?.Maintenance?.observation ?? '-'}</p>
              </Style.Row>

              <Style.Row>
                <h6>Instruções</h6>
                <Style.FileAndImageRow>
                  {(maintenance?.Maintenance?.instructions?.length ?? 0) > 0
                    ? maintenance?.Maintenance?.instructions?.map(({ url, name }) => (
                        <ListTag
                          padding="4px 12px"
                          downloadUrl={url}
                          key={url}
                          label={name ?? ''}
                        />
                      ))
                    : '-'}
                </Style.FileAndImageRow>
              </Style.Row>

              {maintenance?.Maintenance?.MaintenanceType?.name !== 'occasional' && (
                <Style.Row>
                  <h6>Periodicidade</h6>
                  <p className="p2">
                    A cada{' '}
                    {(maintenance?.Maintenance?.frequency ?? 0) > 1
                      ? `${maintenance?.Maintenance?.frequency ?? 0} ${
                          maintenance?.Maintenance?.FrequencyTimeInterval?.pluralLabel
                        }`
                      : `${maintenance?.Maintenance?.frequency ?? 0} ${
                          maintenance?.Maintenance?.FrequencyTimeInterval?.singularLabel
                        }`}
                  </p>
                </Style.Row>
              )}

              <Style.Row>
                <h6>Data de notificação</h6>
                <p className="p2">{dateFormatter(maintenance.notificationDate)}</p>
              </Style.Row>

              {maintenance?.Maintenance?.MaintenanceType?.name !== 'occasional' && (
                <Style.Row>
                  <h6>Data de vencimento</h6>
                  <p className="p2">{dateFormatter(maintenance.dueDate)}</p>
                </Style.Row>
              )}

              {!!maintenance.daysInAdvance && (
                <Style.Row>
                  <h6>Dias antecipados</h6>
                  <p className="p2">{maintenance.daysInAdvance}</p>
                </Style.Row>
              )}

              {maintenance.additionalInfo && (
                <Style.Row>
                  <h6>Info. Adicional</h6>
                  <p className="p2">{maintenance.additionalInfo}</p>
                </Style.Row>
              )}

              {maintenance?.Users && maintenance?.Users?.length > 0 && (
                <UserResponsible
                  title={
                    (maintenance?.Users?.length ?? 0) > 1
                      ? 'Usuários responsáveis'
                      : 'Usuário responsável'
                  }
                  users={maintenance.Users.map(({ User }) => ({
                    ...User,
                  }))}
                />
              )}

              <LinkSupplierToMaintenanceHistory
                maintenanceHistoryId={maintenanceHistoryId}
                showSupplierButton={maintenance.canReport}
              />
              <MaintenanceHistoryActivities
                maintenanceHistoryId={maintenanceHistoryId}
                showTextArea={maintenance.canReport}
              />

              {maintenance.canReport && (
                <>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Input
                      label="Custo"
                      placeholder="Ex: R$ 100,00"
                      maxLength={14}
                      value={maintenanceReport.cost}
                      permToCheck="maintenances:update"
                      onChange={(e) => {
                        setMaintenanceReport((prevState) => {
                          const newState = { ...prevState };
                          newState.cost = applyMask({ mask: 'BRL', value: e.target.value }).value;
                          return newState;
                        });
                      }}
                    />

                    <Select
                      label="Prioridade"
                      arrowColor="primary"
                      selectPlaceholderValue="Selecione uma prioridade"
                      value={maintenance.priorityName}
                      permToCheck="maintenances:update"
                      onChange={(e) => {
                        setMaintenance((prevState) => {
                          const newState = { ...prevState };
                          newState.priorityName = e.target.value;

                          return newState;
                        });
                      }}
                    >
                      <option value="" disabled>
                        Selecione uma prioridade
                      </option>

                      {maintenancePriorities.map((priority) => (
                        <option key={priority.name} value={priority.name}>
                          {priority.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <Style.FileStyleRow disabled={onFileQuery}>
                    <h6>Anexar</h6>
                    <Style.FileRow>
                      {hasUpdatePermission && (
                        <Style.DragAndDropZoneFile {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <Image img={icon.addFile} width="40px" height="32px" radius="0" />
                        </Style.DragAndDropZoneFile>
                      )}

                      {(files.length > 0 || onFileQuery) && (
                        <Style.FileAndImageRow>
                          {files.map((e, i: number) => (
                            <Style.Tag title={e.name} key={i}>
                              <p className="p3">{e.name}</p>
                              <IconButton
                                size="16px"
                                icon={icon.xBlack}
                                onClick={() => {
                                  setFiles((prevState) => {
                                    const newState = [...prevState];
                                    newState.splice(i, 1);
                                    return newState;
                                  });
                                }}
                              />
                            </Style.Tag>
                          ))}
                          {onFileQuery &&
                            acceptedFiles.map((e) => (
                              <Style.FileLoadingTag key={e.name}>
                                <DotLoading />
                              </Style.FileLoadingTag>
                            ))}
                        </Style.FileAndImageRow>
                      )}
                    </Style.FileRow>
                  </Style.FileStyleRow>
                  <Style.FileStyleRow disabled={onImageQuery}>
                    <h6>Imagens</h6>

                    <Style.FileAndImageRow>
                      {hasUpdatePermission && (
                        <Style.DragAndDropZoneImage
                          {...getRootPropsImages({ className: 'dropzone' })}
                        >
                          <input {...getInputPropsImages()} />
                          <Image img={icon.addImage} width="40px" height="38px" radius="0" />
                        </Style.DragAndDropZoneImage>
                      )}

                      {images.map((e, i: number) => (
                        <ImagePreview
                          key={e.name + i}
                          width="97px"
                          height="97px"
                          imageCustomName={e.name}
                          src={e.url}
                          onTrashClick={() => {
                            setImages((prevState) => {
                              const newState = [...prevState];
                              newState.splice(i, 1);
                              return newState;
                            });
                          }}
                        />
                      ))}

                      {onImageQuery &&
                        acceptedImages.map((e) => (
                          <Style.ImageLoadingTag key={e.name}>
                            <DotLoading />
                          </Style.ImageLoadingTag>
                        ))}
                    </Style.FileAndImageRow>
                  </Style.FileStyleRow>
                </>
              )}
            </Style.Content>

            {maintenance.canReport ? (
              <Style.ButtonContainer>
                {!onQuery && (
                  <PopoverButton
                    disabled={onFileQuery || onImageQuery || onQuery}
                    actionButtonClick={() =>
                      handleMaintenanceToggleProgress(!maintenance.inProgress)
                    }
                    borderless
                    actionButtonBgColor="primary"
                    textColor="actionBlue"
                    label={maintenance.inProgress ? 'Parar execução' : 'Iniciar execução'}
                    message={{
                      title: maintenance.inProgress
                        ? 'Tem certeza que deseja alterar a execução?'
                        : 'Iniciar a execução apenas indica que a manutenção está sendo realizada, mas não conclui a manutenção.',
                      content: 'Esta ação é reversível.',
                    }}
                    type="Button"
                  />
                )}

                {!onQuery && (
                  <PopoverButton
                    disabled={onFileQuery || onImageQuery || onQuery}
                    actionButtonClick={() => handleSaveMaintenanceReport(maintenance?.inProgress)}
                    textColor="actionBlue"
                    borderless
                    actionButtonBgColor="primary"
                    label="Salvar"
                    message={{
                      title: 'Tem certeza que deseja salvar o progresso?',
                      content: '',
                    }}
                    type="Button"
                  />
                )}

                <PopoverButton
                  disabled={onFileQuery || onImageQuery}
                  loading={onQuery}
                  actionButtonClick={() => handleSendMaintenanceReport()}
                  label="Finalizar manutenção"
                  actionButtonBgColor="primary"
                  bgColor="primary"
                  message={{
                    title: 'Tem certeza que deseja enviar o relato?',
                    content: 'Esta ação é irreversível.',
                    contentColor: theme.color.danger,
                  }}
                  type="Button"
                />
              </Style.ButtonContainer>
            ) : (
              <Button
                label="Fechar"
                bgColor="primary"
                center
                onClick={() => handleModals('modalMaintenanceReportSend', false)}
              />
            )}
          </Style.Container>
        )}
      </Modal>
    </>
  );
};
