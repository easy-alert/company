/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Api } from '@services/api';
import { unMask, catchHandler, uploadFile } from '@utils/functions';

// FUNCTIONS

// TYPES
import { IRequestDeleteBuilding, IRequestEditBuilding } from './types';

export const requestEditBuilding = async ({
  values,
  setModal,
  setOnQuery,
  requestBuildingDetailsCall,
}: IRequestEditBuilding) => {
  setOnQuery(true);
  let imageUrl: string | null = null;

  if (typeof values.image === 'object') {
    const { Location } = await uploadFile(values.image);
    imageUrl = Location;
  } else {
    imageUrl = values.image || '';
  }

  await Api.put('/buildings/edit', {
    buildingId: values.id,
    data: {
      image: imageUrl,
      name: values.name,
      buildingTypeId: values.buildingTypeId,
      cep: values.cep !== '' ? unMask(values.cep) : null,
      city: values.city !== '' ? values.city : null,
      state: values.state !== '' ? values.state : null,
      neighborhood: values.neighborhood !== '' ? values.neighborhood : null,
      streetName: values.streetName !== '' ? values.streetName : null,
      area: null,
      warrantyExpiration: new Date(new Date(values.warrantyExpiration).setUTCHours(3, 0, 0, 0)),
      keepNotificationAfterWarrantyEnds: values.keepNotificationAfterWarrantyEnds,
      mandatoryReportProof: values.mandatoryReportProof,
      nextMaintenanceCreationBasis: values.nextMaintenanceCreationBasis,
      isActivityLogPublic: values.isActivityLogPublic,
      guestCanCompleteMaintenance: values.guestCanCompleteMaintenance,
    },
  })
    .then((res) => {
      requestBuildingDetailsCall();
      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

export const requestDeleteBuilding = async ({
  setModal,
  setOnQuery,
  buildingId,
  navigate,
}: IRequestDeleteBuilding) => {
  setOnQuery(true);

  await Api.delete('/buildings/delete', {
    data: {
      buildingId,
    },
  })
    .then((res) => {
      setModal(false);
      navigate('/buildings', { replace: true });
      toast.success(res.data.ServerMessage.message);
      setOnQuery(false);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaModalEditBuilding = yup
  .object({
    image: yup
      .mixed()
      .nullable()
      .notRequired()
      .test(
        'FileSize',
        'O tamanho da imagem excedeu o limite.',
        (value) => value.length || (value && value.size <= 5000000),
      )
      .test(
        'FileType',
        'Formato inválido.',
        (value) =>
          value.length ||
          (value &&
            (value.type === 'image/png' ||
              value.type === 'image/jpeg' ||
              value.type === 'image/jpg')),
      ),
    name: yup.string().required('O nome deve ser preenchido.'),
    buildingTypeId: yup.string().required('O tipo deve ser selecionado.'),
    cep: yup.string().min(9, 'Digite um CEP válido.').required('o CEP deve ser preenchido.'),
    city: yup.string().required('Campo obrigatório.'),
    state: yup.string().required('Campo obrigatório.'),
    nextMaintenanceCreationBasis: yup.string().required('Campo obrigatório.'),
    neighborhood: yup.string(),
    streetName: yup.string(),
    area: yup.string().not(['0,00'], 'Digite um número maior que zero.'),
    deliveryDate: yup.date(),
    warrantyExpiration: yup
      .date()
      .required('O término da garantia deve ser preenchido.')
      .min(yup.ref('deliveryDate'), 'O término da garantia deve ser maior que a data de início.'),
    keepNotificationAfterWarrantyEnds: yup.boolean(),
    isActivityLogPublic: yup.boolean(),
    guestCanCompleteMaintenance: yup.boolean(),
  })
  .required();
