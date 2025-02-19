import { useEffect, useState } from 'react';

// LIBS
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikSelect } from '@components/Form/FormikSelect';
import { FormikCheckbox } from '@components/Form/FormikCheckbox';
import { FormikTextArea } from '@components/Form/FormikTextArea';
import { Input } from '@components/Inputs/Input';
import { DragAndDropFiles } from '@components/DragAndDropFiles';
import { ImagePreview } from '@components/ImagePreview';
import { DotLoading } from '@components/Loadings/DotLoading';

// GLOBAL UTILS
import { applyMask, capitalizeFirstLetter, catchHandler, uploadManyFiles } from '@utils/functions';

// GLOBAL STYLES
import * as Style from './styles';

// GLOBAL TYPES
import { ITimeInterval } from '../../../utils/types';

// STYLES
import { Row, FileAndImageRow, ImageLoadingTag } from '../ModalChecklistDetails/styles';

interface IModalCreateChecklist {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  timeIntervals: ITimeInterval[];
  buildingNanoId: string;
  buildingName: string;
  onThenRequest: () => Promise<void>;
}

const schema = yup
  .object({
    buildingNanoId: yup.string().required('Campo obrigatório.'),
    name: yup.string().required('Campo obrigatório.'),
    syndicId: yup.string().required('Campo obrigatório.'),
    description: yup.string(),
    date: yup.string().required('Campo obrigatório.'),

    hasFrequency: yup.boolean(),

    frequency: yup
      .string()
      .matches(/^\d/, 'O prazo para execução deve ser um número.')
      .when('hasFrequency', {
        is: (hasFrequency: boolean) => hasFrequency,
        then: yup
          .string()
          .matches(/^\d/, 'O prazo para execução deve ser um número.')
          .required('Campo obrigatório.'),
      }),
    frequencyTimeIntervalId: yup.string().required('Campo obrigatório.'),
  })
  .required();

type TSchema = yup.InferType<typeof schema>;

export const ModalCreateChecklist = ({
  setModal,
  timeIntervals,
  onThenRequest,
  buildingNanoId,
  buildingName,
}: IModalCreateChecklist) => {
  const [syndics, setSyndics] = useState<{ name: string; id: string }[]>([]);
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const [imagesToUploadCount, setImagesToUploadCount] = useState<number>(0);

  const [checklistDetailImages, setChecklistDetailImages] = useState<
    { url: string; name: string }[]
  >([]);

  const listSyndics = async () => {
    await Api.get(`/buildings/notifications/list-for-select/${buildingNanoId}`)
      .then((res) => {
        setSyndics(res.data.syndics);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  useEffect(() => {
    listSyndics();
  }, []);

  return (
    <Modal setModal={setModal} title="Cadastrar checklist">
      <Style.Container>
        <Formik
          initialValues={{
            name: '',
            buildingNanoId,
            date: '',
            frequency: '',
            frequencyTimeIntervalId: timeIntervals[0].id,
            description: '',
            syndicId: '',
            hasFrequency: false,
          }}
          validationSchema={schema}
          onSubmit={async (values: TSchema) => {
            setOnQuery(true);

            await Api.post(`/checklists`, {
              ...values,
              frequency: values.frequency ? Number(values.frequency) : null,
              detailImages: checklistDetailImages,
            })
              .then((res) => {
                onThenRequest();
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
                name="name"
                label="Nome *"
                placeholder="Ex: Retirar o lixo"
                error={touched.name && (errors.name || null)}
              />

              <FormikSelect
                name="syndicId"
                selectPlaceholderValue={values.syndicId}
                label="Responsável *"
                error={touched.syndicId && (errors.syndicId || null)}
              >
                <option value="" disabled hidden>
                  Selecione
                </option>
                {syndics.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </FormikSelect>

              <FormikTextArea
                label="Descrição"
                placeholder="Insira a descrição"
                name="description"
                error={touched.description && (errors.description || null)}
              />

              <Row>
                <h6>Imagens da checklist</h6>
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

                      setChecklistDetailImages((prev) => [...prev, ...formattedUploadedFiles]);
                    }}
                  />
                  {checklistDetailImages.length > 0 &&
                    checklistDetailImages.map(
                      (image: { name: string; url: string }, index: number) => (
                        <ImagePreview
                          key={image.url}
                          src={image.url}
                          downloadUrl={image.url}
                          imageCustomName={image.name}
                          width="132px"
                          height="136px"
                          onTrashClick={() => {
                            setChecklistDetailImages((prev) => {
                              const newState = [...prev];
                              newState.splice(index, 1);
                              return newState;
                            });
                          }}
                        />
                      ),
                    )}

                  {onImageQuery &&
                    [...Array(imagesToUploadCount).keys()].map((e) => (
                      <ImageLoadingTag key={e}>
                        <DotLoading />
                      </ImageLoadingTag>
                    ))}
                </FileAndImageRow>
              </Row>

              <FormikInput
                name="date"
                label="Data *"
                type="date"
                error={touched.date && (errors.date || null)}
                typeDatePlaceholderValue={values.date}
              />

              <FormikCheckbox
                label="Periodicidade"
                name="hasFrequency"
                onChange={() => {
                  setFieldValue('hasFrequency', !values.hasFrequency);
                  setFieldValue('frequency', '');
                }}
              />

              {values.hasFrequency && (
                <Style.FrequencyWrapper>
                  <FormikInput
                    name="frequency"
                    label="Periodicidade *"
                    placeholder="Ex: 2"
                    maxLength={4}
                    error={touched.frequency && (errors.frequency || null)}
                    onChange={(e) => {
                      setFieldValue(
                        'frequency',
                        applyMask({ mask: 'NUM', value: e.target.value }).value,
                      );
                    }}
                  />
                  <FormikSelect
                    name="frequencyTimeIntervalId"
                    selectPlaceholderValue={values.frequencyTimeIntervalId}
                    label="Unidade *"
                  >
                    {timeIntervals.map(({ id, pluralLabel, singularLabel }) => (
                      <option value={id} key={id}>
                        {Number(values.frequency) > 1
                          ? capitalizeFirstLetter(pluralLabel)
                          : capitalizeFirstLetter(singularLabel)}
                      </option>
                    ))}
                  </FormikSelect>
                </Style.FrequencyWrapper>
              )}

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
