// COMPONENTS
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../../../../../../../components/Buttons/Button';
import { FormikCheckbox } from '../../../../../../../components/Form/FormikCheckbox';
import { Modal } from '../../../../../../../components/Modal';
import { FormikInput } from '../../../../../../../components/Form/FormikInput';
import { Image } from '../../../../../../../components/Image';
import { DotLoading } from '../../../../../../../components/Loadings/DotLoading';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../../../../assets/icons';

// FUNCTIONS
import { handleAdditionalInformations, schemaAdditionalInformations } from './functions';
import {
  applyMask,
  convertToFormikDate,
  increaseDaysInDate,
  uploadFile,
} from '../../../../../../../utils/functions';
// TYPES
import { IModalAdditionalInformations } from './types';
import { IMaintenanceReport } from '../../../../../../Calendar/utils/ModalSendMaintenanceReport/types';
import { AnnexesAndImages } from '../../../../../../Calendar/types';
import { Input } from '../../../../../../../components/Inputs/Input';
import { TextArea } from '../../../../../../../components/Inputs/TextArea';
import { IconButton } from '../../../../../../../components/Buttons/IconButton';
import { ImagePreview } from '../../../../../../../components/ImagePreview';

export const ModalAdditionalInformations = ({
  setModal,
  setCategories,
  categoryIndex,
  maintenanceIndex,
  selectedMaintenance,
  categories,
}: IModalAdditionalInformations) => {
  const [maintenanceReport, setMaintenanceReport] = useState<IMaintenanceReport>({
    cost: 'R$ 0,00',
    observation: '',
  });

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
          firstNotificationDate: selectedMaintenance.notificationDate
            ? convertToFormikDate(selectedMaintenance.notificationDate)
            : '',
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
          });
        }}
      >
        {({ errors, values, touched, setFieldValue, setTouched }) => (
          <Form>
            <Style.Wrapper>
              <FormikCheckbox
                label="Informar data da primeira notificação"
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
                min={increaseDaysInDate({ date: new Date(), daysToIncrease: 1 })}
                disabled={!values.hasFirstNotificationDate}
                name="firstNotificationDate"
                type="date"
                value={values.firstNotificationDate}
                error={
                  touched.firstNotificationDate && errors.firstNotificationDate
                    ? errors.firstNotificationDate
                    : null
                }
                placeholder="Ex: João Silva"
                maxLength={40}
              />
            </Style.Wrapper>

            <Style.Wrapper>
              <FormikCheckbox
                label="Informar data da última conclusão"
                name="hasLastResolutionDate"
                onChange={() => {
                  setFieldValue('hasLastResolutionDate', !values.hasLastResolutionDate);

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
                max={convertToFormikDate(new Date())}
                disabled={!values.hasLastResolutionDate}
                name="lastResolutionDate"
                type="date"
                value={values.lastResolutionDate}
                error={
                  touched.lastResolutionDate && errors.lastResolutionDate
                    ? errors.lastResolutionDate
                    : null
                }
                placeholder="Ex: João Silva"
                maxLength={40}
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
                      <Style.DragAndDropZoneImage
                        {...getRootPropsImages({ className: 'dropzone' })}
                      >
                        <input {...getInputPropsImages()} />
                        <Image img={icon.addImage} width="48px" height="46px" radius="0" />
                      </Style.DragAndDropZoneImage>

                      {images.map((e, i: number) => (
                        <ImagePreview
                          key={e.url}
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
                </Style.ReportWrapper>
              )}
            </Style.Wrapper>
            <Button
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
