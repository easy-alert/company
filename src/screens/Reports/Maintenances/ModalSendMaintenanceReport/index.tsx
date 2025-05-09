// REACT
import { useEffect, useState } from 'react';

// LIBS
import { useDropzone } from 'react-dropzone';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { Input } from '@components/Inputs/Input';
import { Modal } from '@components/Modal';
import { DotLoading } from '@components/Loadings/DotLoading';
import { Image } from '@components/Image';
import { ImagePreview } from '@components/ImagePreview';
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { useAuthContext } from '@contexts/Auth/UseAuthContext';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import { MaintenanceHistoryActivities } from '@components/MaintenanceHistoryActivities';
import { ListTag } from '@components/ListTag';
import { InProgressTag } from '@components/InProgressTag';
import { LinkSupplierToMaintenanceHistory } from '@components/LinkSupplierToMaintenanceHistory';

// GLOBAL UTILS
import { applyMask, dateFormatter, uploadManyFiles } from '@utils/functions';

// ASSETS
import { icon } from '@assets/icons';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL TYPES
import type { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';
import type { IMaintenance } from '@customTypes/IMaintenance';
import type { IMaintenanceReport } from '@customTypes/IMaintenanceReport';

// COMPONENTS
import { EventTag } from '../../../Calendar/utils/EventTag';

// UTILS
import { requestReportProgress, requestSaveReportProgress, requestSendReport } from './functions';
import { requestDeleteMaintenanceHistory } from '../functions';
import { requestMaintenanceDetails } from '../../../Calendar/utils/ModalMaintenanceDetails/functions';
import { requestToggleInProgress } from '../../../Calendar/utils/ModalSendMaintenanceReport/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IModalSendMaintenanceReport } from './types';

export const ModalSendMaintenanceReport = ({
  maintenanceHistoryId,
  handleModalSendMaintenanceReport,
  onThenRequest,
}: IModalSendMaintenanceReport) => {
  const [maintenance, setMaintenance] = useState<IMaintenance>({
    Building: {
      name: '',
    },
    canReport: false,
    daysInAdvance: 0,
    dueDate: '',
    id: '',
    inProgress: false,
    priorityName: '',
    Maintenance: {
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
      instructions: [],
    },
    resolutionDate: '',
    notificationDate: '',
    MaintenancesStatus: {
      name: 'pending',
    },
    MaintenanceReport: [{ cost: 0, id: '', observation: '', ReportAnnexes: [], ReportImages: [] }],
  });

  const { account } = useAuthContext();

  // MODAL ENVIAR RELATO

  const [maintenanceReport, setMaintenanceReport] = useState<IMaintenanceReport>({
    cost: 'R$ 0,00',
    observation: '',
  });

  const [modalLoading, setModalLoading] = useState<boolean>(true);

  const [onModalQuery, setOnModalQuery] = useState<boolean>(false);

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
    requestReportProgress({
      maintenanceHistoryId,
      setFiles,
      setImages,
      setMaintenanceReport,
    }).then(() => {
      requestMaintenanceDetails({
        maintenanceHistoryId,
        setMaintenance,
        setModalLoading,
      });
    });
  }, []);

  return (
    <Modal
      bodyWidth="475px"
      title={maintenance.canReport ? 'Enviar relato' : 'Detalhes de manutenção'}
      maintenanceHistoryId={maintenanceHistoryId}
      setModal={handleModalSendMaintenanceReport}
    >
      {modalLoading ? (
        <Style.LoadingContainer>
          <DotSpinLoading />
        </Style.LoadingContainer>
      ) : (
        <Style.Container>
          <h3>{maintenance?.Building.name}</h3>
          <Style.StatusTagWrapper>
            {maintenance.MaintenancesStatus.name === 'overdue' && <EventTag status="completed" />}
            <EventTag status={maintenance?.MaintenancesStatus.name} />
            {maintenance?.Maintenance.MaintenanceType?.name === 'occasional' ? (
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
              <p className="p2">{maintenance.Maintenance.Category?.name ?? '-'}</p>
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
                {(maintenance.Maintenance.instructions?.length || 0) > 0
                  ? maintenance.Maintenance.instructions?.map(({ url, name }) => (
                      <ListTag
                        padding="4px 12px"
                        downloadUrl={url ?? ''}
                        key={url}
                        label={name ?? ''}
                      />
                    ))
                  : '-'}
              </Style.FileAndImageRow>
            </Style.Row>

            {maintenance.Maintenance.MaintenanceType?.name !== 'occasional' && (
              <Style.Row>
                <h6>Periodicidade</h6>
                <p className="p2">
                  A cada{' '}
                  {(maintenance.Maintenance.frequency || 0) > 1
                    ? `${maintenance.Maintenance.frequency} ${maintenance.Maintenance.FrequencyTimeInterval?.pluralLabel}`
                    : `${maintenance.Maintenance.frequency} ${maintenance.Maintenance.FrequencyTimeInterval?.singularLabel}`}
                </p>
              </Style.Row>
            )}

            <Style.Row>
              <h6>Data de notificação</h6>
              <p className="p2">{dateFormatter(maintenance.notificationDate)}</p>
            </Style.Row>

            {maintenance.Maintenance.MaintenanceType?.name !== 'occasional' && (
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

            <LinkSupplierToMaintenanceHistory maintenanceHistoryId={maintenance.id} />
            <MaintenanceHistoryActivities maintenanceHistoryId={maintenance.id} />

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

                {/* <TextArea
                  label="Observação do relato"
                  placeholder="Digite aqui"
                  value={maintenanceReport.observation}
                  onChange={(e) => {
                    setMaintenanceReport((prevState) => {
                      const newState = { ...prevState };
                      newState.observation = e.target.value;
                      return newState;
                    });
                  }}
                /> */}

                <Style.FileStyleRow disabled={onFileQuery}>
                  <h6>Anexar</h6>
                  <Style.FileRow>
                    <Style.DragAndDropZoneFile {...getRootProps({ className: 'dropzone' })}>
                      <input {...getInputProps()} />

                      <Image img={icon.addFile} width="40px" height="32px" radius="0" />
                    </Style.DragAndDropZoneFile>

                    {(files.length > 0 || onFileQuery) && (
                      <Style.FileAndImageRow>
                        {files.map((file, i: number) => (
                          <Style.Tag title={file.name} key={file.originalName}>
                            <p className="p3">{file.name}</p>

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
                          acceptedFiles.map((acceptedFile) => (
                            <Style.FileLoadingTag key={acceptedFile.name}>
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

                    {images.map((image, i: number) => (
                      <ImagePreview
                        key={image.name}
                        width="97px"
                        height="97px"
                        imageCustomName={image.name}
                        src={image.url}
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
                      acceptedImages.map((acceptedImage) => (
                        <Style.ImageLoadingTag key={acceptedImage.name}>
                          <DotLoading />
                        </Style.ImageLoadingTag>
                      ))}
                  </Style.FileAndImageRow>
                </Style.FileStyleRow>
              </>
            )}
          </Style.Content>
          <Style.ButtonContainer>
            {!onModalQuery && maintenance.Maintenance.MaintenanceType?.name === 'occasional' && (
              <PopoverButton
                actionButtonBgColor={theme.color.actionDanger}
                borderless
                type="Button"
                disabled={onModalQuery}
                label="Excluir"
                message={{
                  title: 'Deseja excluir este histórico de manutenção?',
                  content: 'Atenção, essa ação não poderá ser desfeita posteriormente.',
                  contentColor: theme.color.danger,
                }}
                actionButtonClick={() => {
                  requestDeleteMaintenanceHistory({
                    maintenanceHistoryId,
                    handleModalSendMaintenanceReport,
                    setOnModalQuery,
                    onThenRequest: async () => onThenRequest(),
                  });
                }}
              />
            )}

            {maintenance.canReport ? (
              <>
                {!onModalQuery && (
                  <PopoverButton
                    actionButtonBgColor="primary"
                    disabled={onFileQuery || onImageQuery || onModalQuery}
                    actionButtonClick={() => {
                      requestToggleInProgress({
                        maintenanceHistoryId,
                        handleModalSendMaintenanceReport,
                        setOnQuery: setOnModalQuery,
                        inProgressChange: !maintenance.inProgress,
                        onThenActionRequest: async () => onThenRequest(),
                      });
                    }}
                    textColor={theme.color.actionBlue}
                    borderless
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

                {!onModalQuery && (
                  <PopoverButton
                    disabled={onFileQuery || onImageQuery || onModalQuery}
                    actionButtonClick={() => {
                      requestSaveReportProgress({
                        files,
                        images,
                        handleModalSendMaintenanceReport,
                        maintenanceHistoryId,
                        maintenanceReport,
                        setOnModalQuery,
                        onThenRequest: async () => onThenRequest(),
                      });
                    }}
                    actionButtonBgColor="primary"
                    textColor={theme.color.actionBlue}
                    borderless
                    label="Salvar progresso"
                    message={{
                      title: 'Tem certeza que deseja salvar o progresso?',
                      content: '',
                    }}
                    type="Button"
                  />
                )}

                <PopoverButton
                  disabled={onFileQuery || onImageQuery}
                  loading={onModalQuery}
                  actionButtonClick={() => {
                    requestSendReport({
                      setOnModalQuery,
                      maintenanceHistoryId,
                      maintenanceReport,
                      handleModalSendMaintenanceReport,
                      files,
                      images,
                      origin: account?.origin ?? 'Company',
                      onThenRequest: async () => onThenRequest(),
                    });
                  }}
                  actionButtonBgColor="primary"
                  label="Finalizar manutenção"
                  bgColor="primary"
                  message={{
                    title: 'Tem certeza que deseja enviar o relato?',
                    content: 'Esta ação é irreversível.',
                    contentColor: theme.color.danger,
                  }}
                  type="Button"
                />
              </>
            ) : (
              <Button
                label="Fechar"
                onClick={() => {
                  handleModalSendMaintenanceReport(false);
                }}
              />
            )}
          </Style.ButtonContainer>
        </Style.Container>
      )}
    </Modal>
  );
};
