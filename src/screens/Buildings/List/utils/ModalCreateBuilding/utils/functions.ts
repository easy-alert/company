/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '@services/api';
import { catchHandler, unMask } from '@utils/functions';

// TYPES
import { IRequestCreateBuilding } from './types';

export const requestCreateBuilding = async ({
  values,
  setModal,
  setOnQuery,
  navigate,
}: IRequestCreateBuilding) => {
  setOnQuery(true);

  await Api.post('/buildings/create', {
    name: values.name,
    buildingTypeId: values.buildingTypeId,
    cep: values.cep !== '' ? unMask(values.cep) : null,
    city: values.city !== '' ? values.city : null,
    state: values.state !== '' ? values.state : null,
    neighborhood: values.neighborhood !== '' ? values.neighborhood : null,
    streetName: values.streetName !== '' ? values.streetName : null,
    area: null,
    deliveryDate: new Date(new Date(values.deliveryDate).setUTCHours(3, 0, 0, 0)),
    warrantyExpiration: new Date(new Date(values.warrantyExpiration).setUTCHours(3, 0, 0, 0)),
    keepNotificationAfterWarrantyEnds: values.keepNotificationAfterWarrantyEnds,
    mandatoryReportProof: values.mandatoryReportProof,
    nextMaintenanceCreationBasis: values.nextMaintenanceCreationBasis,
    isActivityLogPublic: values.isActivityLogPublic,
    guestCanCompleteMaintenance: values.guestCanCompleteMaintenance,
  })
    .then((res) => {
      setModal(false);
      toast.success(res.data.ServerMessage.message);
      // não precisaria desse set, se fosse consumir com o useserachparams
      navigate(`/buildings/details/${res.data.building.id}`);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

const fieldLabels: Record<string, string> = {
  name: 'Nome',
  buildingTypeId: 'tipo',
  cep: 'CEP',
  state: 'Estado',
  city: 'Cidade',
  deliveryDate: 'Data de início',
  warrantyExpiration: 'Término da garantia',
};

// YUP
export const schemaModalCreateBuilding = yup
  .object({
    name: yup.string().required(() => `O ${fieldLabels.name.toLowerCase()} deve ser preenchido.`),
    buildingTypeId: yup
      .string()
      .required(() => `O ${fieldLabels.buildingTypeId.toLowerCase()} deve ser preenchido.`),
    cep: yup
      .string()
      .min(9, 'Digite um CEP válido.')
      .required(() => `O ${fieldLabels.cep.toLowerCase()} deve ser preenchido.`),
    city: yup.string().required(() => `A ${fieldLabels.city.toLowerCase()} deve ser preenchida.`),
    state: yup.string().required(() => `O ${fieldLabels.state.toLowerCase()} deve ser preenchido.`),
    neighborhood: yup.string(),
    streetName: yup.string(),
    area: yup.string().not(['0,00'], 'Digite um número maior que zero.'),
    deliveryDate: yup
      .date()
      .required(() => `A ${fieldLabels.deliveryDate.toLowerCase()} deve ser preenchida.`),
    warrantyExpiration: yup
      .date()
      .required(() => `O ${fieldLabels.warrantyExpiration.toLowerCase()} deve ser preenchido.`)
      .min(yup.ref('deliveryDate'), 'O término da garantia deve ser maior que a data de início.'),
    keepNotificationAfterWarrantyEnds: yup.boolean(),
    nextMaintenanceCreationBasis: yup.string().required('Campo obrigatório.'),
    isActivityLogPublic: yup.boolean(),
    guestCanCompleteMaintenance: yup.boolean(),
  })
  .required();
