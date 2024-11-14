// REACT
import { useEffect, useState } from 'react';

// COMPONENTS
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { Input } from '@components/Inputs/Input';
import { FormikTextArea } from '@components/Form/FormikTextArea';
import { DragAndDropFiles } from '@components/DragAndDropFiles';
import { ImagePreview } from '@components/ImagePreview';
import { DotLoading } from '@components/Loadings/DotLoading';
import { FormikSelect } from '@components/Form/FormikSelect';
import { ReactSelectComponent } from '@components/ReactSelectComponent';
import { ListTag } from '@components/ListTag';

// GLOBAL UTILS
import { catchHandler, isImage, uploadManyFiles } from '@utils/functions';

// GLOBAL TYPES
import type { IBuilding } from '@customTypes/IBuilding';

// STYLES
import * as Style from './styles';
import { ImageLoadingTag } from '../../Checklists/ModalChecklistDetails/styles';

interface IModalCreateTicket {
  buildings: IBuilding[];
  handleCreateTicketModal: (modal: boolean) => void;
  handleRefresh?: () => void;
}

interface IAuxiliaryData {
  id: string;
  label: string;
}

const schema = yup
  .object({
    buildingNanoId: yup.string().required('Campo obrigatório.'),
    residentName: yup.string().required('Campo obrigatório.'),
    residentApartment: yup.string().required('Campo obrigatório.'),
    residentEmail: yup.string().email('E-mail inválido.'),
    description: yup.string().required('Campo obrigatório.'),
    placeId: yup.string().required('Campo obrigatório.'),
    types: yup
      .array()
      .of(
        yup.object({
          serviceTypeId: yup.string().required('Campo obrigatório.'),
        }),
      )
      .min(1, 'Campo obrigatório.')
      .required('Campo obrigatório.'),
  })
  .required();

type TSchema = yup.InferType<typeof schema>;

export const ModalCreateTicket = ({
  buildings,
  handleCreateTicketModal,
  handleRefresh,
}: IModalCreateTicket) => {
  const [places, setPlaces] = useState<IAuxiliaryData[]>([]);
  const [types, setTypes] = useState<IAuxiliaryData[]>([]);

  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const [imagesToUploadCount, setImagesToUploadCount] = useState<number>(0);
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);

  const getAuxiliaryData = async () => {
    await Api.get(`/tickets/extras/auxiliary-data`)
      .then((res) => {
        setPlaces(res.data.places);
        setTypes(res.data.types);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  const submitForm = async (values: TSchema) => {
    setOnQuery(true);

    await Api.post(`/tickets`, {
      ...values,
      images,
      residentEmail: values.residentEmail || null,
    })
      .then((res) => {
        toast.success(res.data.ServerMessage.message);
        handleCreateTicketModal(false);

        if (handleRefresh) {
          handleRefresh();
        }
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  useEffect(() => {
    getAuxiliaryData();
  }, []);

  return (
    <Modal setModal={handleCreateTicketModal} title="Abrir novo chamado">
      <Style.Container>
        <Formik
          initialValues={{
            buildingNanoId: '',
            residentName: '',
            residentApartment: '',
            residentEmail: '',
            description: '',
            placeId: '',
            types: [],
          }}
          validationSchema={schema}
          onSubmit={submitForm}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <FormikSelect
                name="buildingNanoId"
                selectPlaceholderValue={values.buildingNanoId}
                label="Prédio *"
                error={touched.buildingNanoId && (errors.buildingNanoId || null)}
              >
                <option value="" disabled hidden>
                  Selecione
                </option>

                {buildings.map(({ nanoId, name }) => (
                  <option value={nanoId} key={nanoId}>
                    {name}
                  </option>
                ))}
              </FormikSelect>

              <FormikInput
                name="residentName"
                label="Nome do morador *"
                placeholder="Ex: Informe o nome"
                error={touched.residentName && (errors.residentName || null)}
              />

              <FormikInput
                name="residentApartment"
                label="Apartamento do morador *"
                placeholder="Ex: Informe o apartamento"
                error={touched.residentName && (errors.residentName || null)}
              />

              <FormikInput
                name="residentEmail"
                label="E-mail do morador"
                placeholder="Ex: Informe o e-mail"
                error={touched.residentEmail && (errors.residentEmail || null)}
              />

              <FormikSelect
                name="placeId"
                selectPlaceholderValue={values.placeId}
                label="Local da ocorrência *"
                error={touched.placeId && (errors.placeId || null)}
              >
                <option value="" disabled hidden>
                  Selecione
                </option>
                {places.map(({ id, label }) => (
                  <option value={id} key={id}>
                    {label}
                  </option>
                ))}
              </FormikSelect>

              <ReactSelectComponent
                selectPlaceholderValue={values.types.length}
                isMulti
                isClearable={false}
                label="Tipo da manutenção *"
                id="1"
                name="2"
                options={types.map(({ id, label }) => ({
                  label,
                  value: id,
                }))}
                placeholder="Selecione"
                onChange={(evt) => {
                  const data = evt?.map(({ value }: { value: string }) => ({
                    serviceTypeId: value,
                  }));
                  setFieldValue('types', data);
                }}
                error={touched.types && (errors.types || null)}
              />

              <FormikTextArea
                label="Descrição *"
                placeholder="Informe a descrição"
                name="description"
                error={touched.description && (errors.description || null)}
              />

              <Style.Row>
                <h6>Anexos *</h6>
                <Style.FileAndImageRow>
                  <DragAndDropFiles
                    disabled={onImageQuery}
                    width="132px"
                    height="136px"
                    getAcceptedFiles={async ({ acceptedFiles }) => {
                      setImagesToUploadCount(acceptedFiles.length);
                      setOnImageQuery(true);
                      const uploadedFiles = await uploadManyFiles(acceptedFiles);
                      setOnImageQuery(false);
                      setImagesToUploadCount(0);

                      const formattedUploadedFiles = uploadedFiles.map(
                        ({ Location, originalname }) => ({
                          name: originalname,
                          url: Location,
                        }),
                      );

                      setImages((prev) => [...prev, ...formattedUploadedFiles]);
                    }}
                  />
                  {images.length > 0 &&
                    images.map((image: { name: string; url: string }, index: number) => {
                      if (isImage(image.url)) {
                        return (
                          <ImagePreview
                            key={image.url}
                            src={image.url}
                            downloadUrl={image.url}
                            imageCustomName={image.name}
                            width="132px"
                            height="136px"
                            onTrashClick={() => {
                              setImages((prev) => {
                                const newState = [...prev];
                                newState.splice(index, 1);
                                return newState;
                              });
                            }}
                          />
                        );
                      }

                      return (
                        <ListTag
                          downloadUrl={image.url}
                          key={image.url}
                          padding="4px 12px"
                          label={image.name}
                          maxWidth="100px"
                          onClick={() => {
                            setImages((prev) => {
                              const newState = [...prev];
                              newState.splice(index, 1);
                              return newState;
                            });
                          }}
                        />
                      );
                    })}

                  {onImageQuery &&
                    [...Array(imagesToUploadCount).keys()].map((e) => (
                      <ImageLoadingTag key={e}>
                        <DotLoading />
                      </ImageLoadingTag>
                    ))}
                </Style.FileAndImageRow>
              </Style.Row>

              <Button
                center
                label="Cadastrar"
                type="submit"
                loading={onQuery}
                disable={onImageQuery}
              />
            </Form>
          )}
        </Formik>
      </Style.Container>
    </Modal>
  );
};
