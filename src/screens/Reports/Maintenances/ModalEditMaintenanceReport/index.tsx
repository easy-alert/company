/* eslint-disable react/no-array-index-key */
// LIBS
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { useEffect, useState } from 'react';
import { Button } from '../../../../components/Buttons/Button';
import { Input } from '../../../../components/Inputs/Input';
import { Modal } from '../../../../components/Modal';
import { EventTag } from '../../../Calendar/utils/EventTag';
import { Image } from '../../../../components/Image';
import { DotLoading } from '../../../../components/Loadings/DotLoading';
import { ImagePreview } from '../../../../components/ImagePreview';
import { IconButton } from '../../../../components/Buttons/IconButton';
import { DotSpinLoading } from '../../../../components/Loadings/DotSpinLoading';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../assets/icons';

// TYPES
import { IMaintenanceReport, IModalEditMaintenanceReport } from './types';
import { AnnexesAndImages, IMaintenance } from '../../../Calendar/types';

// FUNCTIONS
import { applyMask, dateFormatter, uploadManyFiles } from '../../../../utils/functions';
import { requestMaintenanceDetailsForEdit, requestEditReport } from './functions';
import { useAuthContext } from '../../../../contexts/Auth/UseAuthContext';
import { PopoverButton } from '../../../../components/Buttons/PopoverButton';
import { theme } from '../../../../styles/theme';
import { requestDeleteMaintenanceHistory } from '../functions';
import { LinkSupplierToMaintenanceHistory } from '../../../../components/LinkSupplierToMaintenanceHistory';
import { MaintenanceHistoryActivities } from '../../../../components/MaintenanceHistoryActivities';

export const ModalEditMaintenanceReport = ({
  maintenanceHistoryId,
  handleModalEditReport,
  onThenActionRequest,
}: IModalEditMaintenanceReport) => {
  const { account } = useAuthContext();

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
      instructions: [],
    },
    resolutionDate: '',
    notificationDate: '',
    MaintenancesStatus: {
      name: 'pending',
    },
    MaintenanceReport: [{ cost: 0, id: '', observation: '', ReportAnnexes: [], ReportImages: [] }],
  });

  // MODAL EDITAR RELATO

  const [maintenanceReport, setMaintenanceReport] = useState<IMaintenanceReport>({
    cost: 'R$ 0,00',
    observation: '',
    id: '',
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
    requestMaintenanceDetailsForEdit({
      setMaintenance,
      setModalLoading,
      setFiles,
      setImages,
      setMaintenanceReport,
      maintenanceHistoryId,
    });
  }, []);

  return (
    <Modal title="Editar relato" setModal={handleModalEditReport}>
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

            {maintenance?.Maintenance.MaintenanceType.name === 'occasional' ? (
              <EventTag status="occasional" />
            ) : (
              <EventTag status="common" />
            )}
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

            <Style.Row>
              <h6>Data de conclusão</h6>
              <p className="p2">{dateFormatter(maintenance.resolutionDate)}</p>
            </Style.Row>

            {!!maintenance.daysInAdvance && (
              <Style.Row>
                <h6>Dias antecipados</h6>
                <p className="p2">{maintenance.daysInAdvance}</p>
              </Style.Row>
            )}

            <LinkSupplierToMaintenanceHistory maintenanceHistoryId={maintenance.id} />
            <MaintenanceHistoryActivities maintenanceHistoryId={maintenance.id} />

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
              value={maintenanceReport.observation ?? ''}
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
                    {files.map((e, i: number) => (
                      <Style.Tag title={e.name} key={i}>
                        <a
                          title={e.originalName}
                          href={e.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                        >
                          <p className="p3">{e.name}</p>
                          <Image size="16px" img={icon.download} />
                        </a>
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
                    downloadUrl={e.url}
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
          </Style.Content>

          <Style.ButtonContainer>
            {!onModalQuery && maintenance.Maintenance.MaintenanceType.name === 'occasional' && (
              <PopoverButton
                actionButtonBgColor={theme.color.actionDanger}
                borderless
                disabled={onModalQuery}
                type="Button"
                label="Excluir"
                message={{
                  title: 'Deseja excluir este histórico de manutenção?',
                  content: 'Atenção, essa ação não poderá ser desfeita posteriormente.',
                  contentColor: theme.color.danger,
                }}
                actionButtonClick={() => {
                  requestDeleteMaintenanceHistory({
                    maintenanceHistoryId,
                    handleModalEditReport,
                    onThenRequest: async () => onThenActionRequest(),
                    setOnModalQuery,
                  });
                }}
              />
            )}

            <Button
              label="Editar relato"
              disable={onFileQuery || onImageQuery || onModalQuery}
              loading={onModalQuery}
              onClick={() => {
                requestEditReport({
                  setOnModalQuery,
                  maintenanceReport,
                  handleModalEditReport,
                  files,
                  images,
                  origin: account?.origin ?? 'Company',
                  maintenanceHistoryId,

                  onThenRequest: async () => onThenActionRequest(),
                });
              }}
            />
          </Style.ButtonContainer>
        </Style.Container>
      )}
    </Modal>
  );
};
