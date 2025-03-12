/* eslint-disable react/no-array-index-key */
// REACT
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { EventTag } from '@components/EventTag';
import { Input } from '@components/Inputs/Input';
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { Image } from '@components/Image';
import { DotLoading } from '@components/Loadings/DotLoading';
import { ImagePreview } from '@components/ImagePreview';
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { LinkSupplierToMaintenanceHistory } from '@components/LinkSupplierToMaintenanceHistory';
import { MaintenanceHistoryActivities } from '@components/MaintenanceHistoryActivities';
import { ShareMaintenanceHistoryButton } from '@components/ShareMaintenanceHistoryButton';
import { ListTag } from '@components/ListTag';
import { InProgressTag } from '@components/InProgressTag';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import UserResponsible from '@components/UserResponsible';

// GLOBAL TYLES
import { icon } from '@assets/icons';

// GLOBAL FUNCTIONS
import { applyMask, dateFormatter, uploadManyFiles } from '@utils/functions';

// GLOBAL THEMES
import { theme } from '@styles/theme';

// UTILS
import {
  requestReportProgress,
  requestSaveReportProgress,
  requestSendReport,
  requestToggleInProgress,
} from './functions';
import { requestMaintenanceDetails } from '../functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { AnnexesAndImages, IMaintenance } from '../types';
import type { IMaintenanceReport, IModalSendMaintenanceReport } from './types';

export const ModalSendMaintenanceReport = ({
  userId,
  maintenanceHistoryId,
  handleModals,
  handleRefresh,
}: IModalSendMaintenanceReport) => {
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

  const [files, setFiles] = useState<AnnexesAndImages[]>([]);
  const [onFileQuery, setOnFileQuery] = useState<boolean>(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled: onFileQuery,
  });

  const [images, setImages] = useState<AnnexesAndImages[]>([]);
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

  const [modalLoading, setModalLoading] = useState<boolean>(true);
  const [onQuery, setOnQuery] = useState<boolean>(false);

  // #region api function
  const handleGetMaintenanceDetails = async () => {
    const responseData = await requestMaintenanceDetails({
      maintenanceHistoryId,
    });

    setMaintenance(responseData);
  };

  const handleGetReportProgress = async () => {
    const responseData = await requestReportProgress({
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

  const handleChangeMaintenanceProgress = async () => {
    setOnQuery(true);

    try {
      await requestToggleInProgress({
        syndicNanoId: '',
        userId: userId ?? '',
        maintenanceHistoryId,
        inProgressChange: !maintenance.inProgress,
      });

      handleModals('modalSendMaintenanceReport', false);
    } finally {
      handleRefresh();
      setOnQuery(false);
    }
  };

  const handleSaveMaintenance = async () => {
    setOnQuery(true);

    try {
      await requestSaveReportProgress({
        syndicNanoId: '',
        userId: userId ?? '',
        maintenanceHistoryId,
        maintenanceReport,
        files,
        images,
      });

      handleModals('modalSendMaintenanceReport', false);
    } finally {
      handleRefresh();
      setOnQuery(false);
    }
  };

  const handleSendReportMaintenance = async () => {
    setOnQuery(true);

    try {
      await requestSendReport({
        syndicNanoId: '',
        userId: userId ?? '',
        maintenanceHistoryId,
        maintenanceReport,
        files,
        images,
      });

      handleModals('modalSendMaintenanceReport', false);
    } finally {
      handleRefresh();
      setOnQuery(false);
    }
  };
  // #endregion

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const uploadAcceptedFiles = async () => {
        setOnFileQuery(true);

        const uploadedFiles = await uploadManyFiles(acceptedFiles);

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

        const uploadedImages = await uploadManyFiles(acceptedImages);

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
  }, []);

  return (
    <Modal
      bodyWidth="475px"
      title={maintenance.canReport ? 'Enviar relato' : 'Detalhes de manutenção'}
      setModal={(modalState) => handleModals('modalSendMaintenanceReport', modalState)}
    >
      {modalLoading ? (
        <Style.LoadingContainer>
          <DotSpinLoading />
        </Style.LoadingContainer>
      ) : (
        <Style.Container>
          <ShareMaintenanceHistoryButton maintenanceHistoryId={maintenanceHistoryId} />

          <h3>{maintenance?.Building.name}</h3>

          <Style.StatusTagWrapper>
            {maintenance.MaintenancesStatus.name === 'overdue' && <EventTag status="completed" />}
            <EventTag status={maintenance?.MaintenancesStatus.name} />
            {maintenance?.Maintenance.MaintenanceType.name === 'occasional' ? (
              <EventTag status="occasional" />
            ) : (
              <EventTag status="common" />
            )}
            {(maintenance?.MaintenancesStatus.name === 'expired' ||
              maintenance?.MaintenancesStatus.name === 'pending') &&
              maintenance.inProgress && <InProgressTag />}
          </Style.StatusTagWrapper>

          <Style.Content>
            <Style.Row>
              <h6>Categoria</h6>
              <p className="p2">{maintenance.Maintenance.Category.name}</p>
            </Style.Row>
            <Style.Row>
              <h6>Elemento</h6>
              <p className="p2">{maintenance.Maintenance.element}</p>
            </Style.Row>
            <Style.Row>
              <h6>Atividade</h6>
              <p className="p2">{maintenance.Maintenance.activity}</p>
            </Style.Row>
            <Style.Row>
              <h6>Responsável</h6>
              <p className="p2">{maintenance.Maintenance.responsible}</p>
            </Style.Row>

            <Style.Row>
              <h6>Fonte</h6>
              <p className="p2">{maintenance.Maintenance.source}</p>
            </Style.Row>

            <Style.Row>
              <h6>Observação da manutenção</h6>
              <p className="p2">{maintenance.Maintenance.observation ?? '-'}</p>
            </Style.Row>

            <Style.Row>
              <h6>Instruções</h6>
              <Style.FileAndImageRow>
                {maintenance.Maintenance.instructions.length > 0
                  ? maintenance.Maintenance.instructions.map(({ url, name }) => (
                      <ListTag padding="4px 12px" downloadUrl={url} key={url} label={name} />
                    ))
                  : '-'}
              </Style.FileAndImageRow>
            </Style.Row>

            {maintenance.Maintenance.MaintenanceType.name !== 'occasional' && (
              <Style.Row>
                <h6>Periodicidade</h6>
                <p className="p2">
                  A cada{' '}
                  {maintenance.Maintenance.frequency > 1
                    ? `${maintenance.Maintenance.frequency} ${maintenance.Maintenance.FrequencyTimeInterval.pluralLabel}`
                    : `${maintenance.Maintenance.frequency} ${maintenance.Maintenance.FrequencyTimeInterval.singularLabel}`}
                </p>
              </Style.Row>
            )}

            <Style.Row>
              <h6>Data de notificação</h6>
              <p className="p2">{dateFormatter(maintenance.notificationDate)}</p>
            </Style.Row>

            {maintenance.Maintenance.MaintenanceType.name !== 'occasional' && (
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

            <div style={{ marginTop: '12px' }}>
              {maintenance?.userResponsible && (
                <UserResponsible user={maintenance?.userResponsible} />
              )}
            </div>

            <LinkSupplierToMaintenanceHistory maintenanceHistoryId={maintenanceHistoryId} />
            <MaintenanceHistoryActivities maintenanceHistoryId={maintenanceHistoryId} />

            {maintenance.canReport && (
              <>
                <Input
                  label="Custo"
                  placeholder="Ex: R$ 100,00"
                  maxLength={14}
                  value={maintenanceReport.cost}
                  onChange={(e) => {
                    setMaintenanceReport((prevState) => {
                      const newState = { ...prevState };
                      newState.cost = applyMask({ mask: 'BRL', value: e.target.value }).value;
                      return newState;
                    });
                  }}
                />

                <Style.FileStyleRow disabled={onFileQuery}>
                  <h6>Anexar</h6>
                  <Style.FileRow>
                    <Style.DragAndDropZoneFile {...getRootProps({ className: 'dropzone' })}>
                      <input {...getInputProps()} />

                      <Image img={icon.addFile} width="40px" height="32px" radius="0" />
                    </Style.DragAndDropZoneFile>

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
                    <Style.DragAndDropZoneImage {...getRootPropsImages({ className: 'dropzone' })}>
                      <input {...getInputPropsImages()} />
                      <Image img={icon.addImage} width="40px" height="38px" radius="0" />
                    </Style.DragAndDropZoneImage>

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
                  actionButtonClick={() => handleChangeMaintenanceProgress()}
                  borderless
                  textColor={theme.color.actionBlue}
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
                  actionButtonClick={() => handleSaveMaintenance()}
                  textColor={theme.color.actionBlue}
                  borderless
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
                actionButtonClick={() => handleSendReportMaintenance()}
                label="Finalizar manutenção"
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
              center
              onClick={() => handleModals('modalSendMaintenanceReport', false)}
            />
          )}
        </Style.Container>
      )}
    </Modal>
  );
};
