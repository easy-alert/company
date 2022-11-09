/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../services/api';
import { catchHandler, unMask } from '../../../../../../utils/functions';
import { requestBuildingDetails } from '../../functions';

// TYPES
import { IRequestEditBuilding } from './types';

export const requestEditBuilding = async ({
  values,
  setModal,
  setOnQuery,
  setBuilding,
}: IRequestEditBuilding) => {
  setOnQuery(true);

  await Api.put('/buildings/edit', {
    buildingId: values.id,
    data: {
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
    },
  })
    .then((res) => {
      requestBuildingDetails({ buildingId: values.id, setBuilding });
      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaModalEditBuilding = yup
  .object({
    name: yup.string().required('O nome deve ser preenchido.'),
    buildingTypeId: yup.string().required('O tipo deve ser selecionado.'),
    cep: yup.string(),
    city: yup.string(),
    state: yup.string(),
    neighborhood: yup.string(),
    streetName: yup.string(),
    area: yup.string(),
    deliveryDate: yup.date().required('A data de entrega deve ser preenchida.'),
    warrantyExpiration: yup
      .date()
      .required('O término da garantia deve ser preenchido.')
      .min(yup.ref('deliveryDate'), 'O término da garantia deve ser maior que a data de entrega.'),
    keepNotificationAfterWarrantyEnds: yup.boolean(),
  })
  .required();
