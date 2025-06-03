// REACT
import { useEffect, useState } from 'react';

// LIBS
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import { useDropzone } from 'react-dropzone';

// GLOBAL COMPONENTS
import { FormikSelect } from '@components/Form/FormikSelect';
import { Button } from '@components/Buttons/Button';
import { FormikCheckbox } from '@components/Form/FormikCheckbox';
import { Modal } from '@components/Modal';
import { FormikInput } from '@components/Form/FormikInput';
import { Image } from '@components/Image';
import { DotLoading } from '@components/Loadings/DotLoading';
import { Input } from '@components/Inputs/Input';
import { IconButton } from '@components/Buttons/IconButton';
import { ImagePreview } from '@components/ImagePreview';

// GLOBAL UTILS
import {
  applyMask,
  convertToFormikDate,
  increaseDaysInDate,
  uploadManyFiles,
} from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// UTILS
import { handleAdditionalInformations } from './functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IModalAdditionalInformations } from './types';
import type { IMaintenanceReport } from '../../../../../../Calendar/utils/ModalSendMaintenanceReport/types';
import type { AnnexesAndImages } from '../../../../../../Calendar/types';

export const ModalAdditionalInformations = ({
  setModal,
  setCategories,
  categoryIndex,
  maintenanceIndex,
  selectedMaintenance,
  categories,
  hasHistory,
  canAnticipate,
  maxDaysToAnticipate,
}: IModalAdditionalInformations) => {
  const schemaAdditionalInformations = yup
    .object({
      hasLastResolutionDate: yup.boolean(),
      lastResolutionDate: yup.date().when('hasLastResolutionDate', {
        is: (hasLastResolutionDate: boolean) => hasLastResolutionDate === true,
        then: yup.date().required('Informe a data da última conclusão.'),
      }),

      status: yup.string().required('Campo obrigatório'),

      hasFirstNotificationDate: yup.boolean(),
      firstNotificationDate: yup.date().when('hasFirstNotificationDate', {
        is: (hasFirstNotificationDate: boolean) => hasFirstNotificationDate === true,
        then: yup.date().required('Informe a data da próxima notificação.'),
      }),

      daysToAnticipate: yup
        .number()
        .required('Campo obrigatório')
        .min(0, 'Informe um número maior que zero.')
        .max(
          maxDaysToAnticipate,
          `O limite de antecipação dessa manutenção é ${Math.floor(maxDaysToAnticipate)} dias.`,
        )
        .integer('Informe um número inteiro.'),
    })
    .required();

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

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const uploadAcceptedFiles = async () => {
        setOnFileQuery(true);

        const uploadedFiles = await uploadManyFiles([...acceptedFiles]);

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

        const uploadedImages = await uploadManyFiles([...acceptedImages]);

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
    if (selectedMaintenance.maintenanceReport) {
      setMaintenanceReport(selectedMaintenance.maintenanceReport);
    }

    if (selectedMaintenance.files) {
      setFiles(selectedMaintenance.files);
    }

    if (selectedMaintenance.images) {
      setImages(selectedMaintenance.images);
    }
  }, []);

  return (
    <Modal title="Informações adicionais" setModal={setModal}>
      <Formik
        initialValues={{
          hasLastResolutionDate: !!selectedMaintenance.resolutionDate,
          lastResolutionDate: selectedMaintenance.resolutionDate
            ? convertToFormikDate(selectedMaintenance.resolutionDate)
            : '',
          hasFirstNotificationDate: !!selectedMaintenance.notificationDate,
          status: 'completed',
          firstNotificationDate: selectedMaintenance.notificationDate
            ? convertToFormikDate(selectedMaintenance.notificationDate)
            : '',
          daysToAnticipate: selectedMaintenance.daysToAnticipate ?? 0,
        }}
        validationSchema={schemaAdditionalInformations}
        onSubmit={(values) => {
          handleAdditionalInformations({
            setCategories,
            values,
            categoryIndex,
            maintenanceIndex,
            setModal,
            files,
            images,
            maintenanceReport,
            categories,
            selectedMaintenance,
          });
        }}
      >
        {({ errors, values, touched, setFieldValue, setTouched }) => (
          <Form>
            <>
              <Style.Wrapper decreaseOpacity={hasHistory}>
                <FormikCheckbox
                  disable={hasHistory}
                  label="Informar data da próxima notificação"
                  name="hasFirstNotificationDate"
                  onChange={() => {
                    setFieldValue('hasFirstNotificationDate', !values.hasFirstNotificationDate);

                    if (values.firstNotificationDate) {
                      setTouched({ firstNotificationDate: false });
                      setFieldValue('firstNotificationDate', '');
                    }
                  }}
                />
                <FormikInput
                  typeDatePlaceholderValue={values.firstNotificationDate}
                  min={increaseDaysInDate({ date: new Date(), daysToIncrease: 1 })}
                  disabled={!values.hasFirstNotificationDate || hasHistory}
                  name="firstNotificationDate"
                  type="date"
                  value={values.firstNotificationDate}
                  error={
                    touched.firstNotificationDate && errors.firstNotificationDate
                      ? errors.firstNotificationDate
                      : null
                  }
                />
              </Style.Wrapper>

              <Style.Wrapper decreaseOpacity={hasHistory}>
                <FormikCheckbox
                  disable={hasHistory}
                  label="Informar data e status da última manutenção"
                  name="hasLastResolutionDate"
                  onChange={() => {
                    setFieldValue('hasLastResolutionDate', !values.hasLastResolutionDate);
                    setFieldValue('status', 'completed');

                    if (values.lastResolutionDate) {
                      setTouched({ lastResolutionDate: false });
                      setFieldValue('lastResolutionDate', '');
                    }

                    setMaintenanceReport({ cost: 'R$ 0,00', observation: '' });
                    setFiles([]);
                    setImages([]);
                  }}
                />
                <FormikInput
                  typeDatePlaceholderValue={values.lastResolutionDate}
                  max={convertToFormikDate(new Date())}
                  disabled={!values.hasLastResolutionDate || hasHistory}
                  name="lastResolutionDate"
                  type="date"
                  value={values.lastResolutionDate}
                  error={
                    touched.lastResolutionDate && errors.lastResolutionDate
                      ? errors.lastResolutionDate
                      : null
                  }
                />

                {values.hasLastResolutionDate && (
                  <Style.ReportWrapper>
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

                    <FormikSelect
                      label="Status"
                      name="status"
                      disabled={hasHistory}
                      onChange={(e) => setFieldValue('status', e.target.value)}
                      error={touched.status && errors.status ? errors.status : null}
                    >
                      <option value="expired">Vencida</option>
                      <option value="pending">Em andamento</option>
                      <option value="completed">Concluída</option>
                      <option value="overdue">Feita em atraso</option>
                    </FormikSelect>

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

                    <Style.Row disabled={onFileQuery}>
                      <h6>Anexar</h6>
                      <Style.FileRow>
                        <Style.DragAndDropZoneFile {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />

                          <Image img={icon.addFile} width="40px" height="32px" radius="0" />
                        </Style.DragAndDropZoneFile>

                        {(files.length > 0 || onFileQuery) && (
                          <Style.FileAndImageRow>
                            {files.map((e, i: number) => (
                              <Style.Tag title={e.name} key={e.url}>
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
                        <Style.DragAndDropZoneImage
                          {...getRootPropsImages({ className: 'dropzone' })}
                        >
                          <input {...getInputPropsImages()} />
                          <Image img={icon.addImage} width="40px" height="38px" radius="0" />
                        </Style.DragAndDropZoneImage>

                        {images.map((e, i: number) => (
                          <ImagePreview
                            key={e.url}
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
                    </Style.Row>
                  </Style.ReportWrapper>
                )}
              </Style.Wrapper>
            </>
            <Style.Wrapper decreaseOpacity={!canAnticipate}>
              <FormikInput
                disabled={!canAnticipate}
                name="daysToAnticipate"
                label="Dias para antecipar cada notificação"
                type="number"
                placeholder="Informe um número"
                error={
                  touched.daysToAnticipate && errors.daysToAnticipate
                    ? errors.daysToAnticipate
                    : null
                }
              />
            </Style.Wrapper>

            <Button
              bgColor="primary"
              disable={onImageQuery || onFileQuery}
              style={{ marginTop: '8px' }}
              center
              label="Salvar"
              type="submit"
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
