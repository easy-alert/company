import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import * as Style from './styles';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Buttons/Button';
import { FormikInput } from '../../../components/Form/FormikInput';
import { Api } from '../../../services/api';
import { catchHandler, uploadManyFiles } from '../../../utils/functions';
import { Input } from '../../../components/Inputs/Input';
import { FormikTextArea } from '../../../components/Form/FormikTextArea';
import { DragAndDropFiles } from '../../../components/DragAndDropFiles';
import { ImagePreview } from '../../../components/ImagePreview';
import { DotLoading } from '../../../components/Loadings/DotLoading';
import { FormikSelect } from '../../../components/Form/FormikSelect';
import { Row, FileAndImageRow } from '../ModalTicketDetails/styles';
import { ImageLoadingTag } from '../../Checklists/ModalChecklistDetails/styles';
import { ReactSelectComponent } from '../../../components/ReactSelectComponent';

interface IModalCreateTicket {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  buildingNanoId: string;
  buildingName: string;
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
  setModal,
  buildingNanoId,
  buildingName,
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

  useEffect(() => {
    getAuxiliaryData();
  }, []);

  return (
    <Modal setModal={setModal} title="Abrir novo chamado">
      <Style.Container>
        <Formik
          initialValues={{
            buildingNanoId,
            residentName: '',
            residentApartment: '',
            residentEmail: '',
            description: '',
            placeId: '',
            types: [],
          }}
          validationSchema={schema}
          onSubmit={async (values: TSchema) => {
            setOnQuery(true);

            await Api.post(`/tickets`, {
              ...values,
              images,
            })
              .then((res) => {
                toast.success(res.data.ServerMessage.message);
                setModal(false);
              })
              .catch((err) => {
                catchHandler(err);
              })
              .finally(() => {
                setOnQuery(false);
              });
          }}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <Input
                name="buildingName"
                label="Edificação *"
                defaultValue={buildingName}
                disabled
              />

              <FormikInput
                name="residentName"
                label="Nome do morador *"
                placeholder="Ex: Informe o nome"
                maxLength={250}
                error={touched.residentName && (errors.residentName || null)}
              />

              <FormikInput
                name="residentApartment"
                label="Apartamento do morador *"
                placeholder="Ex: Informe o apartamento"
                maxLength={15}
                error={touched.residentName && (errors.residentName || null)}
              />

              <FormikInput
                name="residentEmail"
                label="E-mail do morador"
                placeholder="Ex: Informe o e-mail"
                maxLength={200}
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
                maxLength={500}
                error={touched.description && (errors.description || null)}
              />

              <Row>
                <h6>Imagens *</h6>
                <FileAndImageRow>
                  <DragAndDropFiles
                    disabled={onImageQuery}
                    width="132px"
                    height="136px"
                    onlyImages
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
                    images.map((image: { name: string; url: string }, index: number) => (
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
                    ))}

                  {onImageQuery &&
                    [...Array(imagesToUploadCount).keys()].map((e) => (
                      <ImageLoadingTag key={e}>
                        <DotLoading />
                      </ImageLoadingTag>
                    ))}
                </FileAndImageRow>
              </Row>

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
