// REACT
import { useEffect, useMemo, useState } from 'react';

// COMPONENTS
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import { ReactSelectCreatableComponent } from '@components/ReactSelectCreatableComponent';

// HOOKS
import { useTicketPlacesForSelect } from '@hooks/useTicketPlacesForSelect';
import { useTicketServiceTypesForSelect } from '@hooks/useTicketServiceTypesForSelect';

// SERVICES
import { Api } from '@services/api';
import { getBuildingsApartmentsById } from '@services/apis/getBuildingsApartmentsById';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';
import { FormikTextArea } from '@components/Form/FormikTextArea';
import { DragAndDropFiles } from '@components/DragAndDropFiles';
import { ImagePreview } from '@components/ImagePreview';
import { DotLoading } from '@components/Loadings/DotLoading';
import { FormikSelect } from '@components/Form/FormikSelect';
import { ListTag } from '@components/ListTag';

// GLOBAL UTILS
import { applyMask, catchHandler, isImage, unMask, uploadManyFiles } from '@utils/functions';
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { IBuilding } from '@customTypes/IBuilding';
import type { IBuildingApartment } from '@customTypes/IBuildingApartments';
import { defaultConfig } from '../ModalEditTicketForm/domain/defaultConfig.constant';
import { useTicketFormConfigApi } from '../ModalEditTicketForm/hooks/useTicketFormConfigApi';
import { useEditTicketFormConfig } from '../ModalEditTicketForm/hooks/useEditTicketFormConfig';
import { TicketFormConfig } from '../ModalEditTicketForm/domain/ticketFormConfig.type';

// STYLES
import * as Style from './styles';

interface IModalCreateTicket {
  buildings: IBuilding[];
  handleCreateTicketModal: (modal: boolean) => void;
  handleRefresh?: () => void;
}

function buildSchema(formConfig: TicketFormConfig) {
  const schema: any = {
    buildingNanoId: yup.string().required('O prédio deve ser preenchido.'),
  };

  const isRequired = (x: boolean, msg: string) =>
    x ? yup.string().required(msg) : yup.string().optional();

  if (!formConfig.residentName.hidden)
    schema.residentName = isRequired(
      formConfig.residentName.required,
      'O nome do morador deve ser preenchido.',
    );
  if (!formConfig.residentPhone.hidden)
    schema.residentPhone = isRequired(
      formConfig.residentPhone.required,
      'O telefone do morador deve ser preenchido.',
    );
  if (!formConfig.residentApartment.hidden)
    schema.residentApartment = isRequired(
      formConfig.residentApartment.required,
      'O apartamento do morador deve ser preenchido.',
    );
  if (!formConfig.residentEmail.hidden)
    schema.residentEmail = formConfig.residentEmail.required
      ? yup.string().email('E-mail inválido.').required('O e-mail do morador deve ser preenchido.')
      : yup.string().email('E-mail inválido.').optional();
  if (!formConfig.residentCPF.hidden)
    schema.residentCPF = isRequired(
      formConfig.residentCPF.required,
      'O CPF do morador deve ser preenchido.',
    );
  if (!formConfig.description.hidden)
    schema.description = isRequired(
      formConfig.description.required,
      'A descrição deve ser preenchido.',
    );
  if (!formConfig.placeId.hidden)
    schema.placeId = isRequired(
      formConfig.placeId.required,
      'O local da ocorrência deve ser preenchido.',
    );
  if (!formConfig.types.hidden)
    schema.types = formConfig.types.required
      ? yup
          .array()
          .of(
            yup.object({
              serviceTypeId: yup.string().required('O tipo da assistência deve ser preenchido.'),
            }),
          )
          .min(1, 'O tipo da assistência deve ser preenchido.')
          .required('O tipo da assistência deve ser preenchido.')
      : yup
          .array()
          .of(yup.object({ serviceTypeId: yup.string().optional() }))
          .optional();

  return yup.object(schema).required();
}

export const ModalCreateTicket = ({
  buildings,
  handleCreateTicketModal,
  handleRefresh,
}: IModalCreateTicket) => {
  const { ticketPlacesForSelect, loadingTicketPlacesForSelect, reloadTicketPlaces } =
    useTicketPlacesForSelect();
  const {
    ticketServiceTypesForSelect,
    loadingTicketServiceTypesForSelect,
    reloadTicketServiceTypes,
  } = useTicketServiceTypesForSelect();

  const [buildingsApartments, setBuildingsApartments] = useState<IBuildingApartment[]>([]);

  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const [imagesToUploadCount, setImagesToUploadCount] = useState<number>(0);
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);

  const { config: formConfig, setConfig } = useEditTicketFormConfig();
  const { loadConfig } = useTicketFormConfigApi();

  const handleGetBuildingsApartmentsById = async (buildingId: string) => {
    try {
      const responseData = await getBuildingsApartmentsById({ buildingId });

      setBuildingsApartments(responseData.buildingApartments);
    } catch (error: any) {
      handleToastify(error.response);
    }
  };

  useEffect(() => {
    loadConfig()
      .then((data) => setConfig({ ...defaultConfig, ...data }))
      .catch(() => setConfig(defaultConfig));
  }, []);

  const [addedPlaces, setAddedPlaces] = useState<
    {
      id: string;
      label: string;
      companyId?: string | null;
    }[]
  >([]);
  const [removedPlaceIds, setRemovedPlaceIds] = useState<string[]>([]);

  const [addedTypes, setAddedTypes] = useState<
    {
      id: string;
      singularLabel: string;
      companyId?: string | null;
    }[]
  >([]);
  const [removedTypeIds, setRemovedTypeIds] = useState<string[]>([]);

  const mergedPlaces = useMemo(() => {
    const base = ticketPlacesForSelect || [];
    const byId = new Map<string, { id: string; label: string; companyId?: string | null }>();
    base.forEach((p) => byId.set(p.id, p));
    addedPlaces.forEach((p) => byId.set(p.id, p));
    removedPlaceIds.forEach((id) => byId.delete(id));
    return Array.from(byId.values());
  }, [ticketPlacesForSelect, addedPlaces, removedPlaceIds]);

  const mergedTypes = useMemo(() => {
    const base = ticketServiceTypesForSelect || [];
    const byId = new Map<
      string,
      { id: string; singularLabel: string; companyId?: string | null }
    >();
    base.forEach((t) => byId.set(t.id, t));
    addedTypes.forEach((t) => byId.set(t.id, t));
    removedTypeIds.forEach((id) => byId.delete(id));
    return Array.from(byId.values());
  }, [ticketServiceTypesForSelect, addedTypes, removedTypeIds]);

  const isInitialLoading =
    ticketPlacesForSelect.length === 0 &&
    ticketServiceTypesForSelect.length === 0 &&
    (loadingTicketPlacesForSelect || loadingTicketServiceTypesForSelect);

  const submitForm = async (values: any) => {
    setOnQuery(true);

    const attachmentsRequired =
      (values.buildingNanoId &&
        buildings.find((b) => b.nanoId === values.buildingNanoId)?.ticketAnnexRequired) ||
      formConfig.attachments.required;

    if (attachmentsRequired && images.length === 0) {
      toast.error('Anexos são obrigatórios');
      setOnQuery(false);
      return;
    }

    const schema = buildSchema(formConfig);
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (err: any) {
      toast.error('Preencha os campos obrigatórios');
      setOnQuery(false);
      return;
    }

    await Api.post(`/tickets`, {
      ...values,
      residentCPF: unMask(values.residentCPF),
      residentPhone: unMask(values.residentPhone),
      residentEmail: values.residentEmail.toLowerCase(),
      images,
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

  return (
    <Modal setModal={handleCreateTicketModal} title="Abrir novo chamado">
      {isInitialLoading ? (
        <DotLoading />
      ) : (
        <Style.Container>
          <Formik
            initialValues={{
              buildingNanoId: '',
              residentName: '',
              residentPhone: '',
              residentApartment: '',
              residentEmail: '',
              residentCPF: '',
              description: '',
              placeId: '',
              types: [],
            }}
            validationSchema={buildSchema(formConfig)}
            onSubmit={submitForm}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <FormikSelect
                  arrowColor="primary"
                  name="buildingNanoId"
                  selectPlaceholderValue={values.buildingNanoId}
                  label="Prédio *"
                  onChange={(evt) => {
                    setFieldValue('buildingNanoId', evt.target.value);
                    setFieldValue('residentApartment', '');
                    handleGetBuildingsApartmentsById(evt.target.value);
                  }}
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

                {!formConfig.residentApartment.hidden &&
                  (buildingsApartments.length > 0 ? (
                    <FormikSelect
                      name="residentApartment"
                      label={`Apartamento do morador ${
                        formConfig.residentApartment.required ? '*' : ''
                      }`}
                      selectPlaceholderValue={values.residentApartment}
                      error={touched.residentApartment && (errors.residentApartment || null)}
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>

                      {buildingsApartments.map(({ id, number }) => (
                        <option value={number} key={id}>
                          {number}
                        </option>
                      ))}
                    </FormikSelect>
                  ) : (
                    <FormikInput
                      name="residentApartment"
                      label={`Apartamento do morador ${
                        formConfig.residentApartment.required ? '*' : ''
                      }`}
                      placeholder="Ex: Informe o apartamento"
                      disabled={!values.buildingNanoId}
                      error={touched.residentName && (errors.residentName || null)}
                    />
                  ))}

                {!formConfig.residentName.hidden && (
                  <FormikInput
                    name="residentName"
                    label={`Nome do morador ${formConfig.residentName.required ? '*' : ''}`}
                    placeholder="Ex: Informe o nome"
                    disabled={!values.buildingNanoId}
                    error={touched.residentName && (errors.residentName || null)}
                  />
                )}

                {!formConfig.residentPhone.hidden && (
                  <FormikInput
                    label={`Telefone do morador ${formConfig.residentPhone.required ? '*' : ''}`}
                    name="residentPhone"
                    maxLength={
                      applyMask({
                        value: values.residentPhone,
                        mask: 'TEL',
                      }).length || 1
                    }
                    value={applyMask({ value: values.residentPhone, mask: 'TEL' }).value}
                    error={
                      touched.residentPhone && errors.residentPhone ? errors.residentPhone : null
                    }
                    placeholder="Ex: (00) 00000-0000"
                    onChange={(e) => {
                      setFieldValue('residentPhone', e.target.value);
                    }}
                    disabled={!values.buildingNanoId}
                  />
                )}

                {!formConfig.residentCPF.hidden && (
                  <FormikInput
                    label={`CPF do morador ${formConfig.residentCPF.required ? '*' : ''}`}
                    name="residentCPF"
                    placeholder="Ex: 000.000.000-00"
                    value={applyMask({ mask: 'CPF', value: values.residentCPF }).value}
                    error={touched.residentCPF && (errors.residentCPF || null)}
                    disabled={!values.buildingNanoId}
                    maxLength={
                      applyMask({
                        mask: 'CPF',
                        value: values.residentCPF,
                      }).length || 1
                    }
                    onChange={(e) => setFieldValue('residentCPF', e.target.value)}
                  />
                )}

                {!formConfig.residentEmail.hidden && (
                  <FormikInput
                    name="residentEmail"
                    label={`E-mail do morador ${formConfig.residentEmail.required ? '*' : ''}`}
                    placeholder="Ex: Informe o e-mail"
                    disabled={!values.buildingNanoId}
                    error={touched.residentEmail && (errors.residentEmail || null)}
                  />
                )}

                {!formConfig.placeId.hidden && (
                  <ReactSelectCreatableComponent
                    selectPlaceholderValue={values.placeId}
                    isClearable
                    label={`Local da ocorrência ${formConfig.placeId.required ? '*' : ''}`}
                    id="place"
                    name="place"
                    options={mergedPlaces.map(({ id, label, companyId }) => ({
                      label,
                      value: id,
                      companyId,
                    }))}
                    value={(() => {
                      const option = mergedPlaces.find(({ id }) => id === values.placeId);
                      return option
                        ? { label: option.label, value: option.id, companyId: option.companyId }
                        : null;
                    })()}
                    placeholder="Selecione ou crie"
                    onChange={(evt: any) => {
                      setFieldValue('placeId', evt?.value || '');
                    }}
                    onCreateOption={async (inputValue: string) => {
                      const res = await Api.post('/tickets/places', { label: inputValue });
                      const created = res.data.place;
                      setAddedPlaces((prev) => [
                        { id: created.id, label: created.label, companyId: created.companyId },
                        ...prev,
                      ]);
                      setRemovedPlaceIds((prev) => prev.filter((id) => id !== created.id));
                      setFieldValue('placeId', created.id);
                    }}
                    onDeleteOption={async (val: any) => {
                      try {
                        if (!val) return;
                        await Api.delete(`/tickets/places/${val.value}`);
                        setRemovedPlaceIds((prev) =>
                          prev.includes(val.value) ? prev : [...prev, val.value],
                        );
                        setAddedPlaces((prev) => prev.filter((p) => p.id !== val.value));
                        if (values.placeId === val.value) setFieldValue('placeId', '');
                      } catch (err) {
                        catchHandler(err);
                      }
                    }}
                    isDisabled={!values.buildingNanoId}
                    error={touched.placeId && (errors.placeId || null)}
                  />
                )}

                {!formConfig.types.hidden && (
                  <ReactSelectCreatableComponent
                    selectPlaceholderValue={values.types.length}
                    isMulti
                    isClearable={false}
                    label={`Tipo da assistência ${formConfig.types.required ? '*' : ''}`}
                    id="types"
                    name="types"
                    options={mergedTypes.map(({ id, singularLabel, companyId }) => ({
                      label: singularLabel,
                      value: id,
                      companyId,
                    }))}
                    value={(() => {
                      const selectedIds = (values.types || []).map((t: any) => t.serviceTypeId);
                      return mergedTypes
                        .filter(({ id }) => selectedIds.includes(id))
                        .map(({ id, singularLabel, companyId }) => ({
                          label: singularLabel,
                          value: id,
                          companyId,
                        }));
                    })()}
                    placeholder="Selecione ou crie"
                    onChange={(evt) => {
                      const data = evt?.map(({ value }: { value: string }) => ({
                        serviceTypeId: value,
                      }));
                      setFieldValue('types', data);
                    }}
                    onCreateOption={async (inputValue: string) => {
                      try {
                        const res = await Api.post('/tickets/service-types', { name: inputValue });
                        const created = res.data.serviceType;
                        setAddedTypes((prev) => [
                          {
                            id: created.id,
                            singularLabel: created.singularLabel,
                            companyId: created.companyId,
                          },
                          ...prev,
                        ]);
                        setRemovedTypeIds((prev) => prev.filter((id) => id !== created.id));
                        const newTypes = [...values.types, { serviceTypeId: created.id }];
                        setFieldValue('types', newTypes);
                      } catch (err) {
                        catchHandler(err);
                      }
                    }}
                    onDeleteOption={async (val: any) => {
                      try {
                        if (!val) return;
                        await Api.delete(`/tickets/service-types/${val.value}`);
                        setRemovedTypeIds((prev) =>
                          prev.includes(val.value) ? prev : [...prev, val.value],
                        );
                        setAddedTypes((prev) => prev.filter((t) => t.id !== val.value));
                        const filtered = (values.types || []).filter(
                          (t: any) => t.serviceTypeId !== val.value,
                        );
                        setFieldValue('types', filtered);
                      } catch (err) {
                        catchHandler(err);
                      }
                    }}
                    isDisabled={!values.buildingNanoId}
                    error={touched.types && (errors.types || null)}
                  />
                )}

                {!formConfig.description.hidden && (
                  <FormikTextArea
                    label={`Descrição ${formConfig.description.required ? '*' : ''}`}
                    placeholder="Informe a descrição"
                    name="description"
                    disabled={!values.buildingNanoId}
                    error={touched.description && (errors.description || null)}
                  />
                )}

                {!formConfig.attachments.hidden && (
                  <Style.Row>
                    <h6>Anexos</h6>

                    <Style.FileAndImageRow>
                      <DragAndDropFiles
                        disabled={onImageQuery || !values.buildingNanoId}
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
                          <Style.ImageLoadingTag key={e}>
                            <DotLoading />
                          </Style.ImageLoadingTag>
                        ))}
                    </Style.FileAndImageRow>
                  </Style.Row>
                )}

                <Button
                  bgColor="primary"
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
      )}
    </Modal>
  );
};

