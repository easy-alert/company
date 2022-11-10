/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../services/api';
import { catchHandler, unMask } from '../../../../../../utils/functions';
import { requestBuildingList } from '../../functions';

// TYPES
import { IRequestCreateBuilding } from './types';

export const requestCreateBuilding = async ({
  values,
  setModal,
  setOnQuery,
  page,
  setBuildingList,
  setCount,
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
    area: values.area !== '' ? unMask(values.area) : null,
    deliveryDate: new Date(values.deliveryDate),
    warrantyExpiration: new Date(values.warrantyExpiration),
    keepNotificationAfterWarrantyEnds: values.keepNotificationAfterWarrantyEnds,
  })
    .then((res) => {
      requestBuildingList({ page, setBuildingList, setCount });
      setModal(false);
      toast.success(res.data.ServerMessage.message);
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
    deliveryDate: yup.date().required('A data de entrega deve ser preenchida.'),
    warrantyExpiration: yup
      .date()
      .required('O término da garantia deve ser preenchido.')
      .min(yup.ref('deliveryDate'), 'O término da garantia deve ser maior que a data de entrega.'),
    keepNotificationAfterWarrantyEnds: yup.boolean(),
  })
  .required();
