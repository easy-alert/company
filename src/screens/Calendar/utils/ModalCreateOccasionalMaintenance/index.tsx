// LIBS
import { useEffect, useState } from 'react';

// COMPONENTS

import { useDropzone } from 'react-dropzone';
import * as Style from './styles';
import { Image } from '../../../../components/Image';

import { DotSpinLoading } from '../../../../components/Loadings/DotSpinLoading';
import { Select } from '../../../../components/Inputs/Select';
import { TextArea } from '../../../../components/Inputs/TextArea';
import { Modal } from '../../../../components/Modal';
import { Input } from '../../../../components/Inputs/Input';
import { Button } from '../../../../components/Buttons/Button';
import { icon } from '../../../../assets/icons';
import { IconButton } from '../../../../components/Buttons/IconButton';
import { DotLoading } from '../../../../components/Loadings/DotLoading';
import { ImagePreview } from '../../../../components/ImagePreview';

// TYPES
import {
  IAuxiliaryData,
  ICreateOccasionalMaintenanceData,
  IModalCreateOccasionalMaintenance,
} from './utils/types';

// FUNCTIONS
import { ModalCreateOccasionalMaintenanceInstructions } from './ModalCreateOccasionalMaintenance';
import {
  findCategoryById,
  requestAuxiliaryDataForCreateOccasionalMaintenance,
  requestCreateOccasionalMaintenance,
} from './utils/functions';

import { applyMask, uploadFile } from '../../../../utils/functions';
import { CRUDInput } from '../../../../components/Inputs/CRUDInput';
import { useAuthContext } from '../../../../contexts/Auth/UseAuthContext';

export const ModalCreateOccasionalMaintenance = ({
  setModal,
  getCalendarData,
}: IModalCreateOccasionalMaintenance) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onFileQuery, setOnFileQuery] = useState<boolean>(false);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const { account } = useAuthContext();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    disabled: onFileQuery,
  });

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

  const [view, setView] = useState<number>(0);

  const [auxiliaryData, setAuxiliaryData] = useState<IAuxiliaryData>({
    Buildings: [],
    Categories: [],
  });

  const [data, setData] = useState<ICreateOccasionalMaintenanceData>({
    buildingId: '',
    executionDate: '',

    categoryData: {
      id: '',
      name: '',
    },

    maintenanceData: {
      element: '',
      activity: '',
      responsible: '',
    },
    reportData: {
      cost: '',
      observation: '',
      files: [],
      images: [],
    },
  });

  useEffect(() => {
    requestAuxiliaryDataForCreateOccasionalMaintenance({ setAuxiliaryData, setLoading });
  }, []);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const uploadAcceptedFiles = async () => {
        setOnFileQuery(true);

        const { Location: fileUrl, originalname: originalName } = await uploadFile(
          acceptedFiles[0],
        );

        setData((prevState) => ({
          ...prevState,
          reportData: {
            ...prevState.reportData,
            files: [
              ...prevState.reportData.files,
              { url: fileUrl, originalName, name: originalName },
            ],
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

        const { Location: fileUrl, originalname: originalName } = await uploadFile(
          acceptedImages[0],
        );

        setData((prevState) => ({
          ...prevState,
          reportData: {
            ...prevState.reportData,
            images: [
              ...prevState.reportData.images,
              { url: fileUrl, originalName, name: originalName },
            ],
          },
        }));

        setOnImageQuery(false);
      };

      uploadAcceptedImages();
    }
  }, [acceptedImages]);

  if (view === 0) return ModalCreateOccasionalMaintenanceInstructions({ setView, setModal });

  return (
    <Modal title="Manutenção avulsa" setModal={setModal}>
      {loading ? (
        <Style.OnQueryContainer>
          <DotSpinLoading />
        </Style.OnQueryContainer>
      ) : (
        <Style.FormContainer>
          <Select
            label="Edificação *"
            value={data.buildingId}
            selectPlaceholderValue={data.buildingId}
            onChange={(evt) =>
              setData((prevState) => ({ ...prevState, buildingId: evt.target.value }))
            }
          >
            <option value="" disabled>
              Selecione
            </option>
            {auxiliaryData.Buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </Select>

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
                  maintenanceData: {
                    id: '',
                    activity: '',
                    element: '',
                    responsible: '',
                  },
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
                  maintenanceData: {
                    id: '',
                    activity: '',
                    element: '',
                    responsible: '',
                  },
                })),
            }}
          />

          <CRUDInput
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
                    executionDate: '',
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
                    executionDate: '',
                  },
                })),
            }}
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
            onChange={(evt) =>
              setData((prevState) => ({
                ...prevState,
                executionDate: evt.target.value,
              }))
            }
          />

          {new Date(data.executionDate) < new Date() && (
            <>
              <Input
                label="Custo"
                placeholder="Ex: R$ 100,00"
                maxLength={14}
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
                label="Observação do relato"
                placeholder="Digite aqui"
                maxLength={600}
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

                    <Image img={icon.addFile} width="48px" height="46px" radius="0" />
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

                  {data.reportData.images.map((e, i: number) => (
                    <ImagePreview
                      // eslint-disable-next-line react/no-array-index-key
                      key={e.name + i}
                      width="132px"
                      height="136px"
                      imageCustomName={e.name}
                      imageOriginalName={e.name}
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

                  {onImageQuery && (
                    <Style.ImageLoadingTag>
                      <DotLoading />
                    </Style.ImageLoadingTag>
                  )}
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
                  getCalendarData,
                  data,
                  setModal,
                  setOnQuery,
                  origin: account?.origin || 'Company',
                })
              }
            />
          </Style.ButtonContainer>
        </Style.FormContainer>
      )}
    </Modal>
  );
};
