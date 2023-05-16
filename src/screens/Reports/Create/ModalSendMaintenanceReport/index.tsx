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
import { IMaintenanceReport, IModalSendMaintenanceReport } from './types';
import { AnnexesAndImages, IMaintenance } from '../../../Calendar/types';

// FUNCTIONS
import { applyMask, dateFormatter, uploadFile } from '../../../../utils/functions';
import { requestMaintenanceDetails } from '../ModalMaintenanceDetails/functions';
import { requestSendReport } from './functions';
import { TextArea } from '../../../../components/Inputs/TextArea';
import { useAuthContext } from '../../../../contexts/Auth/UseAuthContext';

export const ModalSendMaintenanceReport = ({
  setModal,
  maintenanceHistoryId,
  filters,
  setCounts,
  setLoading,
  setMaintenances,
  setOnQuery,
}: IModalSendMaintenanceReport) => {
  const [maintenance, setMaintenance] = useState<IMaintenance>({} as IMaintenance);

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
    multiple: false,
    disabled: onFileQuery,
  });

  const [images, setImages] = useState<AnnexesAndImages[]>([]);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const {
    acceptedFiles: acceptedImages,
    getRootProps: getRootPropsImages,
    getInputProps: getInputPropsImages,
  } = useDropzone({
    multiple: false,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    disabled: onImageQuery,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const uploadAcceptedFiles = async () => {
        setOnFileQuery(true);

        const { Location: fileUrl, originalname: originalName } = await uploadFile(
          acceptedFiles[0],
        );

        setFiles((prevState) => {
          let newState = [...prevState];
          newState = [...newState, { originalName, name: originalName, url: fileUrl }];
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

        const { Location: fileUrl, originalname: originalName } = await uploadFile(
          acceptedImages[0],
        );

        setImages((prevState) => {
          let newState = [...prevState];
          newState = [...newState, { originalName, name: originalName, url: fileUrl }];
          return newState;
        });
        setOnImageQuery(false);
      };

      uploadAcceptedImages();
    }
  }, [acceptedImages]);

  useEffect(() => {
    requestMaintenanceDetails({
      maintenanceHistoryId,
      setMaintenance,
      setModalLoading,
    });
  }, []);

  return (
    <Modal title="Enviar relato" setModal={setModal}>
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
              <h6>Data de notificação</h6>
              <p className="p2">{dateFormatter(maintenance.notificationDate)}</p>
            </Style.Row>
            <Style.Row>
              <h6>Data de vencimento</h6>
              <p className="p2">{dateFormatter(maintenance.dueDate)}</p>
            </Style.Row>
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
                  maxLength={300}
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
                        {onFileQuery && (
                          <Style.FileLoadingTag>
                            <DotLoading />
                          </Style.FileLoadingTag>
                        )}
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

                    {onImageQuery && (
                      <Style.ImageLoadingTag>
                        <DotLoading />
                      </Style.ImageLoadingTag>
                    )}
                  </Style.FileAndImageRow>
                </Style.Row>
              </>
            )}
          </Style.Content>
          {maintenance.canReport ? (
            <Button
              label="Enviar relato"
              center
              disable={onFileQuery || onImageQuery}
              loading={onModalQuery}
              onClick={() => {
                requestSendReport({
                  setOnModalQuery,
                  maintenanceHistoryId,
                  maintenanceReport,
                  setModal,
                  files,
                  images,
                  origin: account?.origin ?? 'Company',
                  filters,
                  setCounts,
                  setLoading,
                  setMaintenances,
                  setOnQuery,
                });
              }}
            />
          ) : (
            <Button
              label="Fechar"
              center
              onClick={() => {
                setModal(false);
              }}
            />
          )}
        </Style.Container>
      )}
    </Modal>
  );
};
