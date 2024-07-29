// LIBS
import { useEffect, useState } from 'react';

// COMPONENTS

import { useDropzone } from 'react-dropzone';
import { useSearchParams } from 'react-router-dom';
import * as Style from './styles';
import { Image } from '../../../components/Image';

import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { TextArea } from '../../../components/Inputs/TextArea';
import { Modal } from '../../../components/Modal';
import { Input } from '../../../components/Inputs/Input';
import { Button } from '../../../components/Buttons/Button';
import { icon } from '../../../assets/icons';
import { IconButton } from '../../../components/Buttons/IconButton';
import { DotLoading } from '../../../components/Loadings/DotLoading';
import { ImagePreview } from '../../../components/ImagePreview';

// TYPES
import { IAuxiliaryData, ICreateOccasionalMaintenanceData } from './types';

// FUNCTIONS
import {
  findCategoryById,
  requestAuxiliaryDataForCreateOccasionalMaintenance,
  requestCreateOccasionalMaintenance,
} from './functions';

import { applyMask, uploadManyFiles } from '../../../utils/functions';
import { CRUDInput } from '../../../components/Inputs/CRUDInput';
import { useAuthContext } from '../../../contexts/Auth/UseAuthContext';

interface IModalCreateOccasionalMaintenanceForTicket {
  setModal: (setModal: boolean) => void;
  ticketsToAnswer: string;
  ticketIds: string[];
  onThenRequest: () => Promise<void>;
  resetSelectedTickets: () => void;
  buildingId: string;
}

export const ModalCreateOccasionalMaintenanceForTicket = ({
  setModal,
  onThenRequest,
  ticketsToAnswer,
  ticketIds,
  resetSelectedTickets,
  buildingId,
}: IModalCreateOccasionalMaintenanceForTicket) => {
  const { account } = useAuthContext();

  const [search] = useSearchParams();
  const syndicNanoId = search.get('syndicNanoId') ?? '';

  const [loading, setLoading] = useState<boolean>(true);
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onFileQuery, setOnFileQuery] = useState<boolean>(false);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);

  const [data, setData] = useState<ICreateOccasionalMaintenanceData>({
    buildingId,
    executionDate: '',

    categoryData: {
      id: '',
      name: '',
    },

    inProgress: false,

    maintenanceData: {
      element: '',
      activity: '',
      responsible: '',
    },
    reportData: {
      cost: 'R$ 0,00',
      observation: '',
      files: [],
      images: [],
    },
  });

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled: onFileQuery || data.inProgress,
  });

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
    disabled: onImageQuery || data.inProgress,
  });

  const [auxiliaryData, setAuxiliaryData] = useState<IAuxiliaryData>({
    Buildings: [],
    Categories: [],
  });

  useEffect(() => {
    requestAuxiliaryDataForCreateOccasionalMaintenance({
      setAuxiliaryData,
      setLoading,
    });
  }, []);

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

        setData((prevState) => ({
          ...prevState,
          reportData: {
            ...prevState.reportData,
            files: [...prevState.reportData.files, ...formattedFiles],
          },
        }));
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

        setData((prevState) => ({
          ...prevState,
          reportData: {
            ...prevState.reportData,
            images: [...prevState.reportData.images, ...formattedImages],
          },
        }));

        setOnImageQuery(false);
      };

      uploadAcceptedImages();
    }
  }, [acceptedImages]);

  return (
    <Modal title="Nova manutenção para chamados" setModal={setModal}>
      {loading ? (
        <Style.OnQueryContainer>
          <DotSpinLoading />
        </Style.OnQueryContainer>
      ) : (
        <Style.FormContainer>
          <p className="p1">{ticketsToAnswer}</p>

          <CRUDInput
            label="Categoria *"
            value={data.categoryData.name}
            select={{
              getEvtValue: (value) =>
                setData((prevState) => ({
                  ...prevState,
                  categoryData: {
                    id: value,
                    name:
                      findCategoryById({ id: value, categoriesData: auxiliaryData.Categories })
                        ?.name ?? '',
                  },
                  // maintenanceData: {
                  //   activity: '',
                  //   element: '',
                  //   responsible: '',
                  // },
                })),
              createLabel: 'Criar categoria',
              options: auxiliaryData.Categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            }}
            input={{
              placeholder: 'Digite o nome da categoria',
              getEvtValue: (value) =>
                setData((prevState) => ({
                  ...prevState,
                  categoryData: {
                    ...prevState.categoryData,
                    name: value,
                  },
                })),
              onXClick: () =>
                setData((prevState) => ({
                  ...prevState,
                  categoryData: {
                    id: '',
                    name: '',
                  },
                  // maintenanceData: {
                  //   activity: '',
                  //   element: '',
                  //   responsible: '',
                  // },
                })),
            }}
          />

          {/* <CRUDInput
            label="Elemento *"
            disabled={!data.categoryData.name}
            value={data.maintenanceData.element}
            select={{
              getEvtValue: (value) => {
                const maintenance = findCategoryById({
                  id: data.categoryData.id,
                  categoriesData: auxiliaryData.Categories,
                })?.Maintenances?.find((maintenanceData) => maintenanceData.id === value);

                setData((prevState) => ({
                  ...prevState,
                  maintenanceData: {
                    ...prevState.maintenanceData,
                    element: maintenance?.element ?? '',
                    responsible: maintenance?.responsible ?? '',
                    activity: maintenance?.activity ?? '',
                  },
                }));
              },

              createLabel: 'Criar manutenção',
              options:
                findCategoryById({
                  id: data.categoryData.id,
                  categoriesData: auxiliaryData.Categories,
                })?.Maintenances?.map((maintenance) => ({
                  value: maintenance.id,
                  label: maintenance.element,
                })) || [],
            }}
            input={{
              placeholder: 'Digite o nome da manutenção',
              getEvtValue: (value) =>
                setData((prevState) => ({
                  ...prevState,
                  maintenanceData: {
                    ...prevState.maintenanceData,
                    element: value,
                  },
                })),
              onXClick: () =>
                setData((prevState) => ({
                  ...prevState,
                  maintenanceData: {
                    element: '',
                    activity: '',
                    responsible: '',
                  },
                })),
            }}
          /> */}

          <Input
            label="Elemento *"
            placeholder="Informe o elemento"
            value={data.maintenanceData.element}
            onChange={(evt) =>
              setData((prevState) => ({
                ...prevState,
                maintenanceData: { ...prevState.maintenanceData, element: evt.target.value },
              }))
            }
          />

          <Input
            label="Atividade *"
            placeholder="Ex: Troca de lâmpada"
            value={data.maintenanceData.activity}
            onChange={(evt) =>
              setData((prevState) => ({
                ...prevState,
                maintenanceData: { ...prevState.maintenanceData, activity: evt.target.value },
              }))
            }
          />

          <Input
            label="Responsável *"
            placeholder="Ex: João da Silva"
            value={data.maintenanceData.responsible}
            onChange={(evt) =>
              setData((prevState) => ({
                ...prevState,
                maintenanceData: { ...prevState.maintenanceData, responsible: evt.target.value },
              }))
            }
          />

          <Input
            label="Data de execução *"
            type="date"
            value={data.executionDate}
            typeDatePlaceholderValue={data.executionDate}
            onChange={(evt) =>
              setData((prevState) => ({
                ...prevState,
                executionDate: evt.target.value,
              }))
            }
          />

          <Style.Label htmlFor="inProgress">
            <input
              id="inProgress"
              type="checkbox"
              checked={data.inProgress}
              onChange={() => {
                setData((prevState) => ({
                  ...prevState,
                  inProgress: !prevState.inProgress,
                  reportData: {
                    cost: 'R$ 0,00',
                    observation: '',
                    files: [],
                    images: [],
                  },
                }));
              }}
            />
            Iniciar em execução
          </Style.Label>

          {!data.inProgress && new Date(data.executionDate) < new Date() && (
            <>
              <Input
                disabled={data.inProgress}
                label="Custo"
                placeholder="Ex: R$ 100,00"
                maxLength={20}
                value={data.reportData.cost}
                onChange={(evt) => {
                  setData((prevState) => ({
                    ...prevState,
                    reportData: {
                      ...prevState.reportData,

                      cost: applyMask({ mask: 'BRL', value: evt.target.value }).value,
                    },
                  }));
                }}
              />

              <TextArea
                disabled={data.inProgress}
                label="Observação do relato"
                placeholder="Digite aqui"
                value={data.reportData.observation}
                onChange={(evt) => {
                  setData((prevState) => ({
                    ...prevState,
                    reportData: {
                      ...prevState.reportData,
                      observation: evt.target.value,
                    },
                  }));
                }}
              />

              <Style.Row disabled={onFileQuery}>
                <h6>Anexar</h6>
                <Style.FileRow>
                  <Style.DragAndDropZoneFile {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />

                    <Image img={icon.addFile} width="60px" height="48px" radius="0" />
                  </Style.DragAndDropZoneFile>

                  {(data.reportData.files.length > 0 || onFileQuery) && (
                    <Style.FileAndImageRow>
                      {data.reportData.files.map((e, i: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Style.Tag title={e.name} key={i}>
                          <p className="p3">{e.name}</p>
                          <IconButton
                            size="16px"
                            icon={icon.xBlack}
                            onClick={() => {
                              setData((prevState) => ({
                                ...prevState,
                                reportData: {
                                  ...prevState.reportData,
                                  files: prevState.reportData.files.filter(
                                    (_, index) => index !== i,
                                  ),
                                },
                              }));
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

                  {data.reportData.images.map((e, i: number) => (
                    <ImagePreview
                      // eslint-disable-next-line react/no-array-index-key
                      key={e.name + i}
                      width="132px"
                      height="136px"
                      imageCustomName={e.name}
                      src={e.url}
                      onTrashClick={() => {
                        setData((prevState) => ({
                          ...prevState,
                          reportData: {
                            ...prevState.reportData,
                            images: prevState.reportData.images.filter((_, index) => index !== i),
                          },
                        }));
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
          <Style.ButtonContainer>
            <Button
              loading={onQuery}
              disable={onQuery || onFileQuery}
              label="Confirmar"
              center
              onClick={() =>
                requestCreateOccasionalMaintenance({
                  onThenRequest,
                  data,
                  setModal,
                  setOnQuery,
                  origin: account?.origin ?? 'Company',
                  syndicNanoId,
                  ticketIds,
                  resetSelectedTickets,
                })
              }
            />
          </Style.ButtonContainer>
        </Style.FormContainer>
      )}
    </Modal>
  );
};
