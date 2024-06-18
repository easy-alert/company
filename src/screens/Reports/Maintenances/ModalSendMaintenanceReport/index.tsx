/* eslint-disable react/no-array-index-key */
// LIBS
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { useEffect, useState } from 'react';
import { Button } from '../../../../components/Buttons/Button';
import { Input } from '../../../../components/Inputs/Input';
import { Modal } from '../../../../components/Modal';
import { EventTag } from '../../../Calendar/utils/EventTag';
import { DotLoading } from '../../../../components/Loadings/DotLoading';
import { Image } from '../../../../components/Image';
import { ImagePreview } from '../../../../components/ImagePreview';
import { IconButton } from '../../../../components/Buttons/IconButton';
import { DotSpinLoading } from '../../../../components/Loadings/DotSpinLoading';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../assets/icons';

// TYPES
import { IMaintenanceReport, IModalSendMaintenanceReport } from './types';
import { AnnexesAndImages, IMaintenance } from '../../../Calendar/types';

// FUNCTIONS
import { applyMask, dateFormatter, uploadManyFiles } from '../../../../utils/functions';
import { requestMaintenanceDetails } from '../ModalMaintenanceDetails/functions';
import { requestReportProgress, requestSaveReportProgress, requestSendReport } from './functions';
import { TextArea } from '../../../../components/Inputs/TextArea';
import { useAuthContext } from '../../../../contexts/Auth/UseAuthContext';
import { PopoverButton } from '../../../../components/Buttons/PopoverButton';
import { theme } from '../../../../styles/theme';
import { requestDeleteMaintenanceHistory } from '../functions';
import { InProgressTag } from '../../../../components/InProgressTag';

export const ModalSendMaintenanceReport = ({
  setModal,
  maintenanceHistoryId,
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
    },
    resolutionDate: '',
    notificationDate: '',
    MaintenancesStatus: {
      name: 'pending',
    },
    MaintenanceReport: [{ cost: 0, id: '', observation: '', ReportAnnexes: [], ReportImages: [] }],
  });

  const { account } = useAuthContext();

  const [maintenanceReport, setMaintenanceReport] = useState<IMaintenanceReport>({
    cost: 'R$ 0,00',
    observation: '',
  });

  const [modalLoading, setModalLoading] = useState<boolean>(true);

  const [onModalQuery, setOnModalQuery] = useState<boolean>(false);

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
      title={maintenance.canReport ? 'Enviar relato' : 'Detalhes de manutenção'}
      setModal={setModal}
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
            {maintenance?.Maintenance.MaintenanceType.name === 'occasional' && (
              <EventTag status="occasional" />
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

                <TextArea
                  label="Observação do relato"
                  placeholder="Digite aqui"
                  maxLength={600}
                  value={maintenanceReport.observation}
                  onChange={(e) => {
                    setMaintenanceReport((prevState) => {
                      const newState = { ...prevState };
                      newState.observation = e.target.value;
                      return newState;
                    });
                  }}
                />

                <Style.Row disabled={onFileQuery}>
                  <h6>Anexar</h6>
                  <Style.FileRow>
                    <Style.DragAndDropZoneFile {...getRootProps({ className: 'dropzone' })}>
                      <input {...getInputProps()} />

                      <Image img={icon.addFile} width="60px" height="48px" radius="0" />
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
                </Style.Row>
                <Style.Row disabled={onImageQuery}>
                  <h6>Imagens</h6>

                  <Style.FileAndImageRow>
                    <Style.DragAndDropZoneImage {...getRootPropsImages({ className: 'dropzone' })}>
                      <input {...getInputPropsImages()} />
                      <Image img={icon.addImage} width="48px" height="46px" radius="0" />
                    </Style.DragAndDropZoneImage>

                    {images.map((e, i: number) => (
                      <ImagePreview
                        key={e.name + i}
                        width="132px"
                        height="136px"
                        imageCustomName={e.name}
                        imageOriginalName={e.name}
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
                </Style.Row>
              </>
            )}
          </Style.Content>
          <Style.ButtonContainer>
            {!onModalQuery && maintenance.Maintenance.MaintenanceType.name === 'occasional' && (
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
                    setModal,
                    setOnModalQuery,
                    onThenRequest: async () => onThenRequest(),
                  });
                }}
              />
            )}

            {maintenance.canReport ? (
              <>
                {/* {!onModalQuery && (
                  <PopoverButton
                    disabled={onFileQuery || onImageQuery || onModalQuery}
                    actionButtonClick={() => {
                      requestToggleInProgress({
                        maintenanceHistoryId,
                        setModal,
                        setOnQuery: setOnModalQuery,
                        onThenActionRequest,
                        inProgressChange: !maintenance.inProgress,
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
                )} */}

                {!onModalQuery && (
                  <PopoverButton
                    disabled={onFileQuery || onImageQuery || onModalQuery}
                    actionButtonClick={() => {
                      requestSaveReportProgress({
                        files,
                        images,
                        setModal,
                        maintenanceHistoryId,
                        maintenanceReport,
                        setOnModalQuery,
                        onThenRequest: async () => onThenRequest(),
                      });
                    }}
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
                      setModal,
                      files,
                      images,
                      origin: account?.origin ?? 'Company',
                      onThenRequest: async () => onThenRequest(),
                    });
                  }}
                  label="Finalizar manutenção"
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
                  setModal(false);
                }}
              />
            )}
          </Style.ButtonContainer>
        </Style.Container>
      )}
    </Modal>
  );
};
