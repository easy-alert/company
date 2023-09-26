/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../services/api';
import { catchHandler, query, unMask } from '../../../../../../utils/functions';

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
  })
    .then((res) => {
      setModal(false);
      toast.success(res.data.ServerMessage.message);
      // não precisaria desse set, se fosse consumir com o useserachparams
      query.set('flow', '1');
      navigate(`/buildings/details/${res.data.building.id}?flow=1`);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaModalCreateBuilding = yup
  .object({
    name: yup.string().required('O nome deve ser preenchido.'),
    buildingTypeId: yup.string().required('O tipo deve ser selecionado.'),
    cep: yup.string().min(9, 'Digite um CEP válido.'),
    city: yup.string(),
    state: yup.string(),
    neighborhood: yup.string(),
    streetName: yup.string(),
    area: yup.string().not(['0,00'], 'Digite um número maior que zero.'),
    deliveryDate: yup.date().required('A data de início deve ser preenchida.'),
    warrantyExpiration: yup
      .date()
      .required('O término da garantia deve ser preenchido.')
      .min(yup.ref('deliveryDate'), 'O término da garantia deve ser maior que a data de início.'),
    keepNotificationAfterWarrantyEnds: yup.boolean(),
  })
  .required();
